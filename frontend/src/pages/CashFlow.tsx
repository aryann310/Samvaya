import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { getCashFlow } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard, SkeletonChart } from '../components/ui/SkeletonLoader';
import DataTable from '../components/ui/DataTable';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, AlertTriangle } from 'lucide-react';

export default function CashFlow() {
  const { t } = useTranslation();
  const { businessId, loading: ctxLoading } = useBusiness();
  const { data: cashFlowData, loading: dataLoading } = useApi(
    () => getCashFlow(businessId!),
    [businessId]
  );

  const isLoading = ctxLoading || dataLoading || !cashFlowData;

  if (isLoading) {
    return (
      <div className="page-enter p-6 space-y-6">
        <PageHeader title={t('cashflow.title')} />
        <SkeletonCard />
        <SkeletonChart />
        <SkeletonCard />
      </div>
    );
  }

  const historyColumns = [
    { key: 'month', label: t('cashflow.month') || 'Month' },
    { 
      key: 'inflow', 
      label: t('cashflow.inflows') || 'Inflow',
      render: (_: any, row: any) => <span className="text-success">{formatINR(row.inflows?.total || 0)}</span>
    },
    { 
      key: 'outflow', 
      label: t('cashflow.outflows') || 'Outflow',
      render: (_: any, row: any) => <span className="text-danger">{formatINR(row.outflows?.total || 0)}</span>
    },
    { 
      key: 'net', 
      label: t('cashflow.netFlow') || 'Net Flow',
      render: (_: any, row: any) => {
        const val = row.netFlow || 0;
        return (
          <span className={`font-semibold ${val >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatINR(val)}
          </span>
        );
      }
    },
    { 
      key: 'balance', 
      label: t('cashflow.closingBalance') || 'Closing Balance',
      render: (_: any, row: any) => <span className="font-semibold text-charcoal">{formatINR(row.closingBalance || 0)}</span>
    }
  ];

  return (
    <div className="page-enter p-4 md:p-6 space-y-6 min-h-screen">
      <PageHeader title={t('cashflow.title', 'Cash Flow Analysis')} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 rounded-3xl bg-card/70 backdrop-blur-md border border-glass-border p-6 shadow-glass-shadow text-foreground flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4 text-primary shadow-2xs">
            <Wallet size={28} />
          </div>
          <p className="text-muted-foreground font-medium text-xs mb-1">{t('cashflow.currentBalance', 'Current Available Balance')}</p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">{formatINR(cashFlowData.currentBalance)}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-lime-500/10 text-lime-700 dark:text-lime-400 border border-lime-500/20">
            Live Verified Liquid Reserves
          </span>
        </div>
        
        {cashFlowData.alerts && cashFlowData.alerts.length > 0 && (
          <div className="md:col-span-2 flex flex-col space-y-3 justify-center">
            {cashFlowData.alerts.map((alert: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-2xl flex items-start border bg-card/70 backdrop-blur-md shadow-glass-shadow ${alert.type === 'danger' ? 'border-red-500/30 text-red-600 dark:text-red-400' : 'border-amber-500/30 text-amber-600 dark:text-amber-400'}`}>
                <AlertTriangle className={`mr-3 mt-0.5 flex-shrink-0 ${alert.type === 'danger' ? 'text-red-500' : 'text-amber-500'}`} size={20} />
                <div>
                  <h4 className="font-bold text-sm text-foreground">{alert.title}</h4>
                  <p className="text-xs sm:text-sm mt-1 text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{t('cashflow.monthlyOverview', 'Monthly Cash Flow')}</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">Inflow vs Outflow Trend</span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={cashFlowData.entries.map((e: any) => ({
                month: e.month,
                inflow: e.inflows?.total || 0,
                outflow: e.outflows?.total || 0,
                net: e.netFlow || 0
              }))} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.2)" />
              <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground" tick={{ fill: 'currentColor' }} />
              <YAxis tickFormatter={(val) => `₹${val/1000}k`} stroke="currentColor" className="text-muted-foreground" tick={{ fill: 'currentColor' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.75rem', color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--foreground)' }}
                formatter={(val: any) => formatINR(val)} 
              />
              <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
              <Bar dataKey="inflow" name={t('cashflow.inflow', 'Inflow')} fill="#84cc16" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" name={t('cashflow.outflow', 'Outflow')} fill="#fb923c" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="net" name={t('cashflow.net', 'Net Balance')} stroke="#0284c7" strokeWidth={3} dot={{ fill: '#0284c7', r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground px-1">{t('cashflow.forecast', '3-Month Cash Forecast')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cashFlowData.forecast.map((fc: any, idx: number) => (
            <div key={idx} className="bg-card/70 backdrop-blur-md border border-glass-border p-5 rounded-3xl shadow-glass-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-glass-border mb-4">
                <h3 className="font-bold text-lg text-foreground">{fc.month}</h3>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md border border-border">Projected</span>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cashflow.projectedInflow', 'Projected Inflow')}</span>
                  <span className="text-emerald-600 font-semibold">{formatINR(fc.projectedInflow || fc.inflow || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cashflow.projectedOutflow', 'Projected Outflow')}</span>
                  <span className="text-rose-600 font-semibold">{formatINR(fc.projectedOutflow || fc.outflow || 0)}</span>
                </div>
                <div className="flex justify-between border-t border-glass-border pt-3 mt-2">
                  <span className="font-medium text-foreground">{t('cashflow.projectedBalance', 'Projected Balance')}</span>
                  <span className="font-bold text-foreground">{formatINR(fc.projectedBalance || fc.balance || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card/70 backdrop-blur-md border border-glass-border p-6 rounded-3xl shadow-glass-shadow">
        <h2 className="text-xl font-bold text-foreground mb-4">{t('cashflow.detailTable', 'Monthly Details')}</h2>
        <DataTable columns={historyColumns} data={cashFlowData.entries} />
      </div>
    </div>
  );
}
