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
    <div className="page-enter p-4 md:p-6 space-y-6 bg-[#0B0C0F] text-[#DFE6EF] min-h-screen">
      <PageHeader title={t('cashflow.title')} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 rounded-2xl bg-gradient-to-br from-[#1B2028] via-[#232A35] to-[#1B2028] border border-[#323A46] p-6 shadow-xl text-[#DFE6EF] flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#38BDF8]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-[#11141A] border border-[#323A46] flex items-center justify-center mb-4 text-[#38BDF8] shadow-inner">
            <Wallet size={28} />
          </div>
          <p className="text-[#7E8A99] font-medium text-sm mb-1">{t('cashflow.currentBalance')}</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#DFE6EF] tracking-tight">{formatINR(cashFlowData.currentBalance)}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
            Live Verified Liquid Reserves
          </span>
        </div>
        
        {cashFlowData.alerts && cashFlowData.alerts.length > 0 && (
          <div className="md:col-span-2 flex flex-col space-y-3 justify-center">
            {cashFlowData.alerts.map((alert: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-xl flex items-start border bg-[#1B2028] ${alert.type === 'danger' ? 'border-[#EF4444]/40 text-[#EF4444]' : 'border-[#F59E0B]/40 text-[#F59E0B]'}`}>
                <AlertTriangle className={`mr-3 mt-0.5 flex-shrink-0 ${alert.type === 'danger' ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`} size={20} />
                <div>
                  <h4 className="font-bold text-sm text-[#DFE6EF]">{alert.title}</h4>
                  <p className="text-xs sm:text-sm mt-1 text-[#A4B0BE]">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-[#DFE6EF]">{t('cashflow.monthlyOverview') || 'Monthly Cash Flow'}</h2>
          <span className="text-xs text-[#7E8A99] bg-[#11141A] px-2.5 py-1 rounded-full border border-[#323A46]">Inflow vs Outflow Trend</span>
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#323A46" />
              <XAxis dataKey="month" stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
              <YAxis tickFormatter={(val) => `₹${val/1000}k`} stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#11141A', borderColor: '#323A46', borderRadius: '0.75rem', color: '#DFE6EF' }}
                itemStyle={{ color: '#DFE6EF' }}
                formatter={(val: number) => formatINR(val)} 
              />
              <Legend wrapperStyle={{ color: '#DFE6EF' }} />
              <Bar dataKey="inflow" name={t('cashflow.inflow') || 'Inflow'} fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" name={t('cashflow.outflow') || 'Outflow'} fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="net" name={t('cashflow.net') || 'Net'} stroke="#38BDF8" strokeWidth={3} dot={{ fill: '#38BDF8', r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-[#DFE6EF] px-1">{t('cashflow.forecast') || '3-Month Cash Forecast'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cashFlowData.forecast.map((fc: any, idx: number) => (
            <div key={idx} className="bg-[#1B2028] border border-[#323A46] p-5 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#323A46] mb-4">
                <h3 className="font-bold text-lg text-[#38BDF8]">{fc.month}</h3>
                <span className="text-[11px] uppercase tracking-wider text-[#7E8A99] font-mono bg-[#11141A] px-2 py-0.5 rounded border border-[#323A46]">Projected</span>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#7E8A99]">{t('cashflow.projectedInflow') || 'Projected Inflow'}</span>
                  <span className="text-[#10B981] font-semibold">{formatINR(fc.projectedInflow || fc.inflow || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E8A99]">{t('cashflow.projectedOutflow') || 'Projected Outflow'}</span>
                  <span className="text-[#EF4444] font-semibold">{formatINR(fc.projectedOutflow || fc.outflow || 0)}</span>
                </div>
                <div className="flex justify-between border-t border-[#323A46] pt-3 mt-2">
                  <span className="font-medium text-[#DFE6EF]">{t('cashflow.projectedBalance') || 'Projected Balance'}</span>
                  <span className="font-bold text-[#38BDF8]">{formatINR(fc.projectedBalance || fc.balance || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-heading font-bold text-[#DFE6EF] mb-4">{t('cashflow.detailTable') || 'Monthly Details'}</h2>
        <DataTable columns={historyColumns} data={cashFlowData.entries} />
      </div>
    </div>
  );
}
