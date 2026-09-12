import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { getDashboard, completePriority } from '../services/api';
import { SkeletonCard, SkeletonChart } from '../components/ui/SkeletonLoader';
import InsightCard from '../components/ui/InsightCard';
import StatCard from '../components/ui/StatCard';
import GaugeChart from '../components/ui/GaugeChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, TrendingUp, TrendingDown, MapPin, Activity, Check, Sparkles, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslation();
  const { businessId, business, loading: businessLoading } = useBusiness();
  const { data: dashboard, loading: dashboardLoading, refetch } = useApi(
    () => getDashboard(businessId!),
    [businessId]
  );
  const [completingPriority, setCompletingPriority] = useState<string | null>(null);

  const handleCompletePriority = async (id: string) => {
    setCompletingPriority(id);
    try {
      await completePriority(id);
      refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setCompletingPriority(null);
    }
  };

  const isLoading = businessLoading || dashboardLoading || !dashboard;

  if (isLoading) {
    return (
      <div className="page-enter p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter p-4 md:p-6 space-y-8 min-h-screen bg-[#0B0C0F] text-[#DFE6EF]">
      {/* Bespoke Executive Hero Banner - Obsidian Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B2028] via-[#232A35] to-[#1B2028] text-[#DFE6EF] p-6 sm:p-8 shadow-2xl border border-[#323A46]">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-56 h-56 bg-[#7E8A99]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11141A] border border-[#323A46] text-xs font-bold text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>AI Autonomous Pulse &bull; Active Real-time</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black tracking-tight text-[#DFE6EF]">
              {business?.name || 'Patel General Store'}
            </h1>
            <p className="text-sm sm:text-base text-[#A4B0BE] leading-relaxed">
              {dashboard.healthScore.explanation || 'Operational metrics indicate strong cash reserve resilience with high festive demand forecasted.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start md:self-center">
            <Link 
              to="/advisor"
              className="px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-[#0B0C0F] font-extrabold text-sm shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Ask Advisor</span>
            </Link>
            <Link 
              to="/reports"
              className="px-5 py-2.5 rounded-xl bg-[#1B2028] hover:bg-[#323A46] text-[#DFE6EF] font-semibold text-sm border border-[#323A46] transition-all flex items-center gap-1.5"
            >
              <span>Audit Report</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Health Score & Key Stat Cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Health Score Card */}
        <div className="w-full lg:w-1/3 flex flex-col justify-between items-center rounded-2xl bg-[#1B2028] border border-[#323A46] p-6 shadow-xl relative overflow-hidden">
          <div className="w-full flex items-center justify-between pb-3 border-b border-[#323A46] mb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DFE6EF]">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Financial Health</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
              Optimal
            </span>
          </div>

          <div className="my-auto py-2">
            <GaugeChart 
              score={dashboard.healthScore.score} 
              size={220} 
              label={t('dashboard.healthScore')} 
              explanation={dashboard.healthScore.explanation} 
            />
          </div>

          <div className="w-full pt-4 border-t border-[#323A46] flex items-center justify-between text-xs text-[#7E8A99]">
            <span>Audit cycle: Monthly</span>
            <span className="font-semibold text-[#DFE6EF]">Grade: AA Stable</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard 
            label={t('dashboard.revenue')} 
            value={formatINR(dashboard.stats.revenue.value)} 
            trend={dashboard.stats.revenue.trend} 
            sparklineData={dashboard.stats.revenue.data}
            icon={<TrendingUp className="text-[#10B981]" />} 
          />
          <StatCard 
            label={t('dashboard.expenses')} 
            value={formatINR(dashboard.stats.expenses.value)} 
            trend={dashboard.stats.expenses.trend} 
            sparklineData={dashboard.stats.expenses.data}
            icon={<TrendingDown className="text-[#EF4444]" />} 
          />
          <StatCard 
            label={t('dashboard.profit')} 
            value={formatINR(dashboard.stats.profit.value)} 
            trend={dashboard.stats.profit.trend} 
            sparklineData={dashboard.stats.profit.data}
            icon={<Activity className="text-[#38BDF8]" />} 
          />
          <StatCard 
            label={t('dashboard.cash')} 
            value={formatINR(dashboard.stats.cash.value)} 
            trend={dashboard.stats.cash.trend} 
            sparklineData={dashboard.stats.cash.data}
            icon={<Activity className="text-[#7E8A99]" />} 
          />
        </div>
      </div>

      {/* Priorities & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Priorities */}
        <div className="rounded-2xl bg-[#1B2028] border border-[#323A46] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#323A46] pb-3">
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"></span>
              {t('dashboard.todayPriorities')}
            </h2>
            <span className="text-xs font-semibold text-[#7E8A99]">
              {dashboard.priorities.filter(p => p.completed).length} / {dashboard.priorities.length} done
            </span>
          </div>

          <div className="space-y-3">
            {dashboard.priorities.map(priority => (
              <div 
                key={priority.id} 
                className={`flex items-start p-4 rounded-xl border transition-all duration-200 ${
                  priority.completed 
                    ? 'bg-[#11141A] border-[#323A46]/50 opacity-50' 
                    : 'bg-[#11141A] border-[#323A46] shadow-sm hover:border-[#7E8A99]'
                }`}
              >
                <button 
                  onClick={() => handleCompletePriority(priority.id)}
                  disabled={completingPriority === priority.id || priority.completed}
                  className={`mt-0.5 mr-3.5 rounded-lg p-1.5 border transition-colors flex-shrink-0 ${
                    priority.completed 
                      ? 'bg-[#10B981] border-[#10B981] text-white' 
                      : 'border-[#323A46] text-transparent hover:border-[#10B981] hover:bg-[#10B981]/10'
                  }`}
                  aria-label="Toggle priority complete"
                >
                  <Check size={14} />
                </button>
                <div className={`flex-1 min-w-0 ${priority.completed ? 'line-through text-[#7E8A99]' : ''}`}>
                  <h3 className="font-heading font-bold text-sm text-[#DFE6EF] truncate">{priority.title}</h3>
                  <p className="text-xs text-[#A4B0BE] mt-0.5 leading-relaxed">{priority.description}</p>
                </div>
              </div>
            ))}
            {dashboard.priorities.length === 0 && (
              <p className="text-[#7E8A99] text-sm py-4">{t('dashboard.noPriorities')}</p>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="rounded-2xl bg-[#1B2028] border border-[#323A46] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#323A46] pb-3">
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              {t('dashboard.aiInsights')}
            </h2>
            <Link to="/advisor" className="text-xs font-bold text-[#38BDF8] hover:text-[#DFE6EF] uppercase tracking-wider">
              {t('common.viewAll') || 'View All'} &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {dashboard.insights.map((insight, idx) => (
              <InsightCard 
                key={idx}
                title={insight.recommendation}
                description={insight.why}
                actionLabel={insight.nextStep.label}
                actionRoute={insight.nextStep.route}
                type={insight.type}
                priority={insight.priority}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="rounded-2xl bg-[#1B2028] border border-[#323A46] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#323A46] pb-3">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF]">{t('dashboard.cashFlowChart')}</h2>
            <p className="text-xs text-[#7E8A99]">6-Month Net Inflow vs Outflow Simulation</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#10B981]"></span> Inflow</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#EF4444]"></span> Outflow</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dashboard.cashFlowChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#7E8A99" tickLine={false} />
              <YAxis stroke="#7E8A99" tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#323A46" />
              <Tooltip 
                formatter={(value: number) => formatINR(value)} 
                contentStyle={{ backgroundColor: '#11141A', borderRadius: '12px', border: '1px solid #323A46', color: '#DFE6EF' }} 
              />
              <Area type="monotone" dataKey="inflow" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInflow)" />
              <Area type="monotone" dataKey="outflow" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOutflow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Market Pulse & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl bg-[#1B2028] border border-[#323A46] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF] flex items-center mb-4">
              <MapPin className="mr-2 text-[#38BDF8]" size={20} /> {t('dashboard.localMarketPulse')}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[#323A46] pb-2.5">
                <span className="text-xs text-[#7E8A99]">{t('dashboard.competitorCount')}</span>
                <span className="font-bold text-[#DFE6EF]">{dashboard.marketPulse.competitors}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#323A46] pb-2.5">
                <span className="text-xs text-[#7E8A99]">{t('dashboard.demandGrowth')}</span>
                <span className="font-bold text-[#10B981]">+{dashboard.marketPulse.avgDemandGrowth}%</span>
              </div>
              <div className="flex justify-between items-center pb-2.5">
                <span className="text-xs text-[#7E8A99]">{t('dashboard.topCategory')}</span>
                <span className="font-bold text-[#DFE6EF]">{dashboard.marketPulse.topCategory}</span>
              </div>
            </div>
          </div>
          <Link to="/hyperlocal" className="mt-4 text-[#38BDF8] hover:text-[#DFE6EF] font-bold text-xs uppercase tracking-wider flex items-center justify-center p-3 rounded-xl border border-[#323A46] hover:bg-[#323A46]/30 transition-colors">
            {t('dashboard.viewHyperlocal')} &rarr;
          </Link>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-[#1B2028] border border-[#323A46] p-6 shadow-xl overflow-hidden">
          <h2 className="text-lg font-heading font-bold text-[#DFE6EF] mb-4">{t('dashboard.businessOpportunities')}</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x no-scrollbar">
            {dashboard.opportunities.map((opp, idx) => (
              <div key={idx} className="min-w-[280px] sm:min-w-[320px] p-5 rounded-xl border border-[#323A46] bg-[#11141A] snap-center flex-shrink-0 flex flex-col justify-between hover:border-[#7E8A99] transition-all">
                <div>
                  <h3 className="font-heading font-bold text-[#DFE6EF] mb-1.5 text-sm sm:text-base">{opp.title}</h3>
                  <p className="text-xs text-[#A4B0BE] leading-relaxed mb-4">{opp.description}</p>
                </div>
                <div className="text-[11px] font-bold px-2.5 py-1 bg-[#1B2028] text-[#38BDF8] border border-[#323A46] rounded-lg inline-block self-start shadow-xs">
                  {t('dashboard.estimatedImpact')}: {opp.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
