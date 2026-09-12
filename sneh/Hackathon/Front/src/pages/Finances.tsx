import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { getFinances, calculateLoanAffordability } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard, SkeletonChart } from '../components/ui/SkeletonLoader';
import StatCard from '../components/ui/StatCard';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Percent, Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { LoanAffordabilityResult } from '../types';

export default function Finances() {
  const { t } = useTranslation();
  const { businessId, loading: ctxLoading } = useBusiness();
  const { data: financeData, loading: dataLoading } = useApi(
    () => getFinances(businessId!),
    [businessId]
  );

  // Loan Affordability Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [calcResult, setCalcResult] = useState<LoanAffordabilityResult | null>(null);
  const [calcLoading, setCalcLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAffordability = async () => {
      try {
        setCalcLoading(true);
        const res = await calculateLoanAffordability({
          principal: loanAmount,
          rate: interestRate,
          years: tenureYears,
          loanAmount,
          interestRate,
          tenureMonths: tenureYears * 12,
          monthlyIncome: 180000,
          monthlyExpenses: 145000,
        });
        if (isMounted) {
          setCalcResult(res);
        }
      } catch (err) {
        console.error('Failed to calculate loan affordability', err);
      } finally {
        if (isMounted) setCalcLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAffordability();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [loanAmount, interestRate, tenureYears]);

  const isLoading = ctxLoading || dataLoading || !financeData;

  if (isLoading) {
    return (
      <div className="page-enter p-6 space-y-6">
        <PageHeader title={t('finances.title')} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonChart />
      </div>
    );
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  const categoryColumns = [
    { key: 'category', label: t('finances.category') },
    { 
      key: 'amount', 
      label: t('finances.amount'),
      render: (val: number) => formatINR(val)
    }
  ];

  return (
    <div className="page-enter p-4 md:p-6 space-y-6 bg-[#0B0C0F] text-[#DFE6EF] min-h-screen">
      <PageHeader title={t('finances.title')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label={t('finances.totalRevenue')} 
          value={formatINR(financeData.totalRevenue)} 
          trend={financeData.revenueTrend}
          sparklineData={financeData.monthlyData.map(m => m.revenue)}
          icon={<TrendingUp className="text-[#10B981]" />} 
        />
        <StatCard 
          label={t('finances.totalExpenses')} 
          value={formatINR(financeData.totalExpenses)} 
          trend={0}
          sparklineData={financeData.monthlyData.map(m => m.expenses)}
          icon={<TrendingDown className="text-[#EF4444]" />} 
        />
        <StatCard 
          label={t('finances.netProfit')} 
          value={formatINR(financeData.totalProfit)} 
          trend={0}
          sparklineData={financeData.monthlyData.map(m => m.profit)}
          icon={<DollarSign className="text-[#38BDF8]" />} 
        />
        <StatCard 
          label={t('finances.avgProfitMargin')} 
          value={`${financeData.avgProfitMargin.toFixed(1)}%`} 
          trend={0}
          sparklineData={financeData.monthlyData.map(m => m.profitMargin)}
          icon={<Percent className="text-[#7E8A99]" />} 
        />
      </div>

      <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-[#DFE6EF]">{t('finances.revenueVsExpenses')}</h2>
          <span className="text-xs text-[#7E8A99] bg-[#11141A] px-2.5 py-1 rounded-full border border-[#323A46]">Monthly Aggregates</span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financeData.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#323A46" />
              <XAxis dataKey="month" stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
              <YAxis tickFormatter={(val) => `₹${val/1000}k`} stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#11141A', borderColor: '#323A46', borderRadius: '0.75rem', color: '#DFE6EF' }}
                itemStyle={{ color: '#DFE6EF' }}
                formatter={(val: number) => formatINR(val)} 
              />
              <Legend wrapperStyle={{ color: '#DFE6EF' }} />
              <Bar dataKey="revenue" name={t('finances.revenue')} fill="#38BDF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name={t('finances.expenses')} fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-heading font-bold text-[#DFE6EF] mb-4">{t('finances.revenueBreakdown')}</h2>
          <div className="h-[250px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financeData.revenueByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="category"
                >
                  {financeData.revenueByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#11141A', borderColor: '#323A46', borderRadius: '0.75rem', color: '#DFE6EF' }}
                  itemStyle={{ color: '#DFE6EF' }}
                  formatter={(val: number) => formatINR(val)} 
                />
                <Legend wrapperStyle={{ color: '#DFE6EF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <DataTable columns={categoryColumns} data={financeData.revenueByCategory} />
        </div>

        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-heading font-bold text-[#DFE6EF] mb-4">{t('finances.expenseBreakdown')}</h2>
          <div className="h-[250px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financeData.expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="category"
                >
                  {financeData.expenseByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#11141A', borderColor: '#323A46', borderRadius: '0.75rem', color: '#DFE6EF' }}
                  itemStyle={{ color: '#DFE6EF' }}
                  formatter={(val: number) => formatINR(val)} 
                />
                <Legend wrapperStyle={{ color: '#DFE6EF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <DataTable columns={categoryColumns} data={financeData.expenseByCategory} />
        </div>
      </div>

      {/* Loan Affordability Calculator Section */}
      <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#38BDF8]/10 rounded-xl text-[#38BDF8] border border-[#38BDF8]/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-[#DFE6EF]">{t('finances.loanCalculator')}</h2>
            <p className="text-sm text-[#7E8A99]">{t('finances.loanCalculatorDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6 bg-[#11141A] p-5 rounded-xl border border-[#323A46]">
            {/* Principal Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium text-[#DFE6EF]">
                <span>{t('finances.loanAmount')}</span>
                <span className="text-[#38BDF8] font-bold text-base">{formatINR(loanAmount)}</span>
              </div>
              <input 
                type="range" 
                min={10000} 
                max={1000000} 
                step={10000} 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#38BDF8] h-2 bg-[#1B2028] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#7E8A99]">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium text-[#DFE6EF]">
                <span>{t('finances.interestRate')}</span>
                <span className="text-[#38BDF8] font-bold text-base">{interestRate}% p.a.</span>
              </div>
              <input 
                type="range" 
                min={7} 
                max={20} 
                step={0.5} 
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#38BDF8] h-2 bg-[#1B2028] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#7E8A99]">
                <span>7%</span>
                <span>12%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium text-[#DFE6EF]">
                <span>{t('finances.tenure')}</span>
                <span className="text-[#38BDF8] font-bold text-base">{tenureYears * 12} {t('finances.month')} ({tenureYears} {tenureYears === 1 ? 'Year' : 'Years'})</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={5} 
                step={1} 
                value={tenureYears} 
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#38BDF8] h-2 bg-[#1B2028] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#7E8A99]">
                <span>1 Year (12M)</span>
                <span>3 Years (36M)</span>
                <span>5 Years (60M)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-5 rounded-xl border border-[#323A46] bg-[#11141A] flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#323A46]">
                <span className="text-sm font-medium text-[#7E8A99]">{t('finances.emi')}</span>
                <span className="text-2xl font-heading font-bold text-[#DFE6EF]">
                  {calcResult ? formatINR(Math.round(calcResult.emi)) : '...'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7E8A99]">{t('finances.totalInterest')}</span>
                <span className="font-semibold text-[#DFE6EF]">
                  {calcResult ? formatINR(Math.round(calcResult.totalInterest)) : '...'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7E8A99]">{t('finances.totalPayment')}</span>
                <span className="font-semibold text-[#DFE6EF]">
                  {calcResult ? formatINR(Math.round(calcResult.totalPayment || (calcResult.totalAmount || 0))) : '...'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7E8A99]">{t('finances.dtiRatio')}</span>
                <span className="font-semibold text-[#DFE6EF]">
                  {calcResult ? `${(calcResult.dtiRatio || calcResult.dti || 0).toFixed(1)}%` : '...'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#323A46]">
              {calcResult && (calcResult.affordable ?? calcResult.isAffordable) ? (
                <div className="flex items-center gap-2 p-3 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-lg font-medium text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>{t('finances.affordable')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] rounded-lg font-medium text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>{t('finances.notAffordable')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
