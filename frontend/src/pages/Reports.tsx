import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { getReports } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import InsightCard from '../components/ui/InsightCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export default function Reports() {
  const { t } = useTranslation();
  const { businessId, business, loading: ctxLoading } = useBusiness();
  const [range, setRange] = useState('6m');
  
  const { data: reportData, loading: dataLoading } = useApi(
    () => getReports(businessId!, range),
    [businessId, range]
  );

  const isLoading = ctxLoading || dataLoading || !reportData || !business;

  const handleExportPDF = () => {
    if (!reportData || !business) return;
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Business Report: ${business.name}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Period: Last ${range}`, 14, 40);

    doc.setFontSize(16);
    doc.text('Financial Summary', 14, 55);
    
    const financialBody = [
      ['Total Revenue', formatINR(reportData.financialSummary.revenue)],
      ['Total Expenses', formatINR(reportData.financialSummary.expenses)],
      ['Net Profit', formatINR(reportData.financialSummary.profit)],
    ];

    (doc as any).autoTable({
      startY: 60,
      head: [['Metric', 'Value']],
      body: financialBody,
      theme: 'grid',
    });

    const currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.text('Inventory Summary', 14, currentY);
    
    const inventoryBody = [
      ['Total Items', reportData.inventorySummary.totalItems.toString()],
      ['Low Stock', reportData.inventorySummary.lowStockItems.toString()],
      ['Total Value', formatINR(reportData.inventorySummary.totalValue)],
    ];

    (doc as any).autoTable({
      startY: currentY + 5,
      head: [['Metric', 'Value']],
      body: inventoryBody,
      theme: 'grid',
    });

    doc.save(`${business.name.replace(/\s+/g, '_')}_Report.pdf`);
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    
    const csvData = reportData.monthlyTrend.map((row: any) => ({
      Month: row.month,
      Revenue: row.revenue,
      Expenses: row.expenses,
      Profit: row.profit
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'financial_trends.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="page-enter p-6 space-y-6">
        <PageHeader title={t('reports.title')} />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="page-enter p-4 md:p-6 space-y-6 min-h-screen">
      <PageHeader 
        title={t('reports.title', 'Financial Reports & Executive Audit')} 
        subtitle={t('reports.subtitle', 'Export professional P&L sheets and performance audits for bank submissions.')}
        action={{
          label: 'Export PDF',
          onClick: handleExportPDF,
          icon: <Download size={16} className="mr-2" />
        }}
      />

      <div className="flex justify-end items-center space-x-3 mb-4">
        <select 
          value={range} 
          onChange={(e) => setRange(e.target.value)}
          className="bg-card border border-glass-border text-foreground text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-primary shadow-xs hidden sm:block"
        >
          <option value="1m">{t('reports.lastMonth', 'Last Month')}</option>
          <option value="3m">{t('reports.last3Months', 'Last 3 Months')}</option>
          <option value="6m">{t('reports.last6Months', 'Last 6 Months')}</option>
          <option value="1y">{t('reports.lastYear', 'Last 1 Year')}</option>
        </select>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card hover:bg-muted border border-glass-border text-foreground text-sm font-semibold shadow-xs transition-colors" title="Export CSV">
          <FileSpreadsheet size={16} className="text-primary hidden sm:block" /> CSV
        </button>
      </div>

      <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 sm:p-10 max-w-4xl mx-auto rounded-3xl shadow-glass-shadow printable-document">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-glass-border pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary font-black text-xl shadow-2xs">
              S
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{business?.name || 'Shree Ganesh Kirana Store'}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">{business?.location?.village || 'Modhera'}, {business?.location?.district || 'Mehsana'} &bull; GST: {business?.gstNumber || '24ABCDE1234F1Z5'}</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span className="inline-block px-3 py-1 bg-lime-500/10 text-lime-700 dark:text-lime-400 border border-lime-500/20 font-bold text-xs rounded-full uppercase tracking-wider mb-1">
              {t('reports.businessReport', 'Executive Business Audit')}
            </span>
            <p className="text-xs text-muted-foreground font-mono">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between border-b border-glass-border pb-2 mb-4">
            <h2 className="text-lg font-bold text-foreground">{t('reports.financialSummary', 'Financial Summary')}</h2>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">INR (₹)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/40 border border-border p-4 rounded-2xl text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t('dashboard.revenue', 'Revenue')}</p>
              <p className="text-2xl font-black text-foreground mt-1">{formatINR(reportData.financialSummary.revenue)}</p>
            </div>
            <div className="bg-muted/40 border border-border p-4 rounded-2xl text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t('dashboard.expenses', 'Expenses')}</p>
              <p className="text-2xl font-black text-rose-600 font-mono mt-1">{formatINR(reportData.financialSummary.expenses)}</p>
            </div>
            <div className="bg-muted/40 border border-border p-4 rounded-2xl text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t('dashboard.profit', 'Net Profit')}</p>
              <p className="text-2xl font-black text-emerald-600 font-mono mt-1">{formatINR(reportData.financialSummary.profit)}</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between border-b border-glass-border pb-2 mb-4">
            <h2 className="text-lg font-bold text-foreground">{t('reports.monthlyTrends', 'Monthly Revenue Trajectory')}</h2>
            <span className="text-xs text-muted-foreground">Historical Performance</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData.monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.2)" />
                <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground" tick={{ fill: 'currentColor' }} />
                <YAxis tickFormatter={(val) => `₹${val/1000}k`} stroke="currentColor" className="text-muted-foreground" tick={{ fill: 'currentColor' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.75rem', color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(val: any) => formatINR(val)} 
                />
                <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                <Line type="monotone" dataKey="revenue" name={t('dashboard.revenue', 'Revenue')} stroke="#84cc16" strokeWidth={2.5} dot={{ fill: '#84cc16', r: 3 }} />
                <Line type="monotone" dataKey="expenses" name={t('dashboard.expenses', 'Expenses')} stroke="#fb923c" strokeWidth={2.5} dot={{ fill: '#fb923c', r: 3 }} />
                <Line type="monotone" dataKey="profit" name={t('dashboard.profit', 'Profit')} stroke="#0284c7" strokeWidth={2.5} dot={{ fill: '#0284c7', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-glass-border pb-2">{t('reports.inventorySummary', 'Inventory Health')}</h2>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-border pb-2 text-sm">
                <span className="text-muted-foreground">Total Items</span>
                <span className="font-bold text-foreground">{reportData.inventorySummary.totalItems}</span>
              </li>
              <li className="flex justify-between border-b border-border pb-2 text-sm">
                <span className="text-muted-foreground">Low Stock Alert</span>
                <span className="font-bold text-amber-600">{reportData.inventorySummary.lowStockItems}</span>
              </li>
              <li className="flex justify-between pb-2 text-sm">
                <span className="text-muted-foreground">Inventory Value</span>
                <span className="font-bold text-foreground">{formatINR(reportData.inventorySummary.totalValue)}</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-glass-border pb-2">{t('reports.marketPosition', 'Market Standing')}</h2>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-border pb-2 text-sm">
                <span className="text-muted-foreground">Local Competitors</span>
                <span className="font-bold text-foreground">{reportData.hyperlocalSummary.competitorCount}</span>
              </li>
              <li className="flex justify-between border-b border-border pb-2 text-sm">
                <span className="text-muted-foreground">Market Position</span>
                <span className="font-bold text-foreground">{reportData.hyperlocalSummary.marketPosition}</span>
              </li>
              <li className="flex justify-between pb-2 text-sm">
                <span className="text-muted-foreground">Top Opportunity</span>
                <span className="font-bold text-emerald-600">{reportData.hyperlocalSummary.topOpportunity}</span>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 border-b border-glass-border pb-2">{t('reports.topInsights', 'AI Key Observations')}</h2>
          <div className="grid grid-cols-1 gap-3">
            {reportData.topInsights.map((insight: any, idx: number) => (
              <div key={idx} className="bg-muted/40 p-4 rounded-2xl border border-border">
                <h4 className="font-bold text-sm text-foreground mb-1">{insight.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
