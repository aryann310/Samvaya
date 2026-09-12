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
    <div className="page-enter p-4 md:p-6 space-y-6 bg-[#0B0C0F] text-[#DFE6EF] min-h-screen">
      <PageHeader 
        title={t('reports.title')} 
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
          className="bg-[#1B2028] border border-[#323A46] text-[#DFE6EF] text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-[#38BDF8] hidden sm:block"
        >
          <option value="1m" className="bg-[#1B2028]">{t('reports.lastMonth')}</option>
          <option value="3m" className="bg-[#1B2028]">{t('reports.last3Months')}</option>
          <option value="6m" className="bg-[#1B2028]">{t('reports.last6Months')}</option>
          <option value="1y" className="bg-[#1B2028]">{t('reports.lastYear')}</option>
        </select>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1B2028] hover:bg-[#232A35] border border-[#323A46] text-[#DFE6EF] text-sm font-semibold transition-colors" title="Export CSV">
          <FileSpreadsheet size={16} className="text-[#38BDF8] hidden sm:block" /> CSV
        </button>
      </div>

      <div className="bg-[#1B2028] border border-[#323A46] p-6 sm:p-10 max-w-4xl mx-auto rounded-3xl shadow-2xl printable-document">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#323A46] pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#11141A] border border-[#323A46] flex items-center justify-center text-[#38BDF8] font-black text-xl shadow-inner">
              S
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#DFE6EF]">{business?.name || 'Patel General Store'}</h1>
              <p className="text-xs sm:text-sm text-[#7E8A99]">{business?.location?.village || 'Modhera'}, {business?.location?.district || 'Mehsana'} &bull; GST: {business?.gstNumber || '24ABCDE1234F1Z5'}</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span className="inline-block px-3 py-1 bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 font-bold text-xs rounded-full uppercase tracking-wider mb-1">
              {t('reports.businessReport') || 'Executive Business Audit'}
            </span>
            <p className="text-xs text-[#7E8A99] font-mono">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between border-b border-[#323A46] pb-2 mb-4">
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF]">{t('reports.financialSummary')}</h2>
            <span className="text-xs text-[#7E8A99] uppercase tracking-wider">INR Currency</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#11141A] border border-[#323A46] p-4 rounded-2xl text-center">
              <p className="text-xs text-[#7E8A99] uppercase tracking-wider font-semibold">{t('dashboard.revenue')}</p>
              <p className="text-2xl font-heading font-black text-[#DFE6EF] mt-1">{formatINR(reportData.financialSummary.revenue)}</p>
            </div>
            <div className="bg-[#11141A] border border-[#323A46] p-4 rounded-2xl text-center">
              <p className="text-xs text-[#7E8A99] uppercase tracking-wider font-semibold">{t('dashboard.expenses')}</p>
              <p className="text-2xl font-heading font-black text-[#EF4444] mt-1">{formatINR(reportData.financialSummary.expenses)}</p>
            </div>
            <div className="bg-[#11141A] border border-[#323A46] p-4 rounded-2xl text-center">
              <p className="text-xs text-[#7E8A99] uppercase tracking-wider font-semibold">{t('dashboard.profit')}</p>
              <p className="text-2xl font-heading font-black text-[#10B981] mt-1">{formatINR(reportData.financialSummary.profit)}</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between border-b border-[#323A46] pb-2 mb-4">
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF]">{t('reports.monthlyTrends')}</h2>
            <span className="text-xs text-[#7E8A99]">Monthly Trajectory</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData.monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#323A46" />
                <XAxis dataKey="month" stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
                <YAxis tickFormatter={(val) => `₹${val/1000}k`} stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#11141A', borderColor: '#323A46', borderRadius: '0.75rem', color: '#DFE6EF' }}
                  itemStyle={{ color: '#DFE6EF' }}
                  formatter={(val: any) => formatINR(val)} 
                />
                <Legend wrapperStyle={{ color: '#DFE6EF' }} />
                <Line type="monotone" dataKey="revenue" name={t('dashboard.revenue')} stroke="#38BDF8" strokeWidth={2.5} dot={{ fill: '#38BDF8', r: 3 }} />
                <Line type="monotone" dataKey="expenses" name={t('dashboard.expenses')} stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 3 }} />
                <Line type="monotone" dataKey="profit" name={t('dashboard.profit')} stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF] mb-4 border-b border-[#323A46] pb-2">{t('reports.inventorySummary')}</h2>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-[#323A46]/60 pb-2 text-sm">
                <span className="text-[#7E8A99]">Total Items</span>
                <span className="font-bold text-[#DFE6EF]">{reportData.inventorySummary.totalItems}</span>
              </li>
              <li className="flex justify-between border-b border-[#323A46]/60 pb-2 text-sm">
                <span className="text-[#7E8A99]">Low Stock Alert</span>
                <span className="font-bold text-[#EF4444]">{reportData.inventorySummary.lowStockItems}</span>
              </li>
              <li className="flex justify-between pb-2 text-sm">
                <span className="text-[#7E8A99]">Inventory Value</span>
                <span className="font-bold text-[#38BDF8]">{formatINR(reportData.inventorySummary.totalValue)}</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF] mb-4 border-b border-[#323A46] pb-2">{t('reports.marketPosition')}</h2>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-[#323A46]/60 pb-2 text-sm">
                <span className="text-[#7E8A99]">Local Competitors</span>
                <span className="font-bold text-[#DFE6EF]">{reportData.hyperlocalSummary.competitorCount}</span>
              </li>
              <li className="flex justify-between border-b border-[#323A46]/60 pb-2 text-sm">
                <span className="text-[#7E8A99]">Market Position</span>
                <span className="font-bold text-[#38BDF8]">{reportData.hyperlocalSummary.marketPosition}</span>
              </li>
              <li className="flex justify-between pb-2 text-sm">
                <span className="text-[#7E8A99]">Top Opportunity</span>
                <span className="font-bold text-[#10B981]">{reportData.hyperlocalSummary.topOpportunity}</span>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] mb-4 border-b border-[#323A46] pb-2">{t('reports.topInsights')}</h2>
          <div className="grid grid-cols-1 gap-3">
            {reportData.topInsights.map((insight: any, idx: number) => (
              <div key={idx} className="bg-[#11141A] p-4 rounded-xl border border-[#323A46]">
                <h4 className="font-bold text-sm text-[#38BDF8] mb-1">{insight.title}</h4>
                <p className="text-xs text-[#A4B0BE] leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
