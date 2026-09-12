import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, formatINR } from '../hooks/useApi';
import { useBusiness } from '../contexts/BusinessContext';
import { getHyperlocal } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard, SkeletonTable } from '../components/ui/SkeletonLoader';
import InsightCard from '../components/ui/InsightCard';
import DataTable from '../components/ui/DataTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, Store } from 'lucide-react';

export default function Hyperlocal() {
  const { t } = useTranslation();
  const { businessId, loading: ctxLoading } = useBusiness();
  const { data: hyperlocalData, loading: dataLoading } = useApi(
    () => getHyperlocal(businessId!),
    [businessId]
  );

  const isLoading = ctxLoading || dataLoading || !hyperlocalData;

  if (isLoading) {
    return (
      <div className="page-enter p-6 space-y-6">
        <PageHeader title={t('hyperlocal.title')} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonTable />
      </div>
    );
  }

  const columns = [
    { key: 'item', label: t('hyperlocal.item') },
    { 
      key: 'yourPrice',
      label: t('hyperlocal.yourPrice'), 
      render: (val: number) => <span className="font-semibold text-[#DFE6EF]">{formatINR(val)}</span>
    },
    { 
      key: 'localAverage',
      label: t('hyperlocal.localAvg'), 
      render: (val: number) => <span className="text-[#7E8A99]">{formatINR(val)}</span>
    },
    { 
      key: 'difference',
      label: t('hyperlocal.difference'), 
      render: (val: number) => (
        <span className={`font-bold ${val < 0 ? 'text-[#10B981]' : val > 0 ? 'text-[#EF4444]' : 'text-[#7E8A99]'}`}>
          {val > 0 ? '+' : ''}{formatINR(val)}
        </span>
      )
    }
  ];

  return (
    <div className="page-enter p-4 md:p-6 space-y-6 bg-[#0B0C0F] text-[#DFE6EF] min-h-screen">
      <PageHeader title={t('hyperlocal.title')} subtitle={t('hyperlocal.subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Radial Radar Map */}
        <div className="lg:col-span-2 bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-[#DFE6EF] flex items-center">
              <MapPin className="mr-2 text-[#38BDF8]" /> {t('hyperlocal.mapTitle') || 'Nearby Market Ecosystem'}
            </h2>
            <span className="text-xs text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2.5 py-1 rounded-full font-semibold">
              Live Radar &bull; 2.5 km Radius
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[340px] relative bg-[#11141A] rounded-2xl overflow-hidden border border-[#323A46]">
            {/* Center Node (Your Store) */}
            <div className="absolute z-10 w-16 h-16 bg-[#38BDF8] rounded-full shadow-[0_0_25px_rgba(56,189,248,0.6)] flex items-center justify-center border-4 border-[#1B2028]">
              <Store className="text-[#0B0C0F]" size={26} />
            </div>
            
            {/* Concentric Radar Rings */}
            <div className="absolute w-44 h-44 rounded-full border border-[#38BDF8]/20"></div>
            <div className="absolute w-72 h-72 rounded-full border border-[#38BDF8]/25 border-dashed"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full border border-[#323A46]/60"></div>
            
            {/* Crosshair grid lines */}
            <div className="absolute w-full h-[1px] bg-[#323A46]/40 pointer-events-none"></div>
            <div className="absolute h-full w-[1px] bg-[#323A46]/40 pointer-events-none"></div>

            {/* Competitor Nodes */}
            {hyperlocalData.competitors.map((comp: any, idx: number) => {
              const angle = (idx / hyperlocalData.competitors.length) * Math.PI * 2;
              const distNum = typeof comp.distance === 'number' ? comp.distance : (parseFloat(comp.distance) || 0.5);
              const radius = Math.min(Math.max(distNum * 120, 75), 165);
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div 
                  key={idx}
                  className="absolute group flex flex-col items-center"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div className="w-9 h-9 bg-[#F59E0B] rounded-full shadow-[0_0_12px_rgba(245,158,11,0.4)] border-2 border-[#1B2028] flex items-center justify-center z-10 cursor-pointer hover:scale-125 transition-transform">
                    <Store className="text-[#0B0C0F]" size={15} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 absolute top-10 bg-[#1B2028] shadow-2xl p-2.5 rounded-xl text-xs whitespace-nowrap z-20 pointer-events-none transition-opacity border border-[#323A46]">
                    <p className="font-bold text-[#DFE6EF]">{comp.name}</p>
                    <p className="text-[#7E8A99]">{comp.distance} km away</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center space-x-6 text-xs font-semibold">
            <div className="flex items-center text-[#DFE6EF]"><div className="w-3 h-3 bg-[#38BDF8] rounded-full mr-2 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div> {t('hyperlocal.yourStore') || 'Your Store'}</div>
            <div className="flex items-center text-[#DFE6EF]"><div className="w-3 h-3 bg-[#F59E0B] rounded-full mr-2 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> {t('hyperlocal.nearbyCompetitors') || 'Competitors'}</div>
          </div>
        </div>

        {/* Nearby Competitors List */}
        <div className="lg:col-span-1 bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl flex flex-col h-[420px] lg:h-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#323A46] mb-4">
            <h2 className="text-lg font-heading font-bold text-[#DFE6EF]">{t('hyperlocal.nearbyCompetitors') || 'Nearby Competitors'}</h2>
            <span className="text-xs text-[#7E8A99] font-mono">{hyperlocalData.competitors.length} Found</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {hyperlocalData.competitors.map((comp: any, idx: number) => (
              <div key={idx} className="p-3.5 border border-[#323A46] bg-[#11141A] rounded-xl hover:border-[#38BDF8]/40 transition-all">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-bold text-sm text-[#DFE6EF]">{comp.name}</h3>
                  <span className="text-[11px] bg-[#1B2028] border border-[#323A46] px-2 py-0.5 rounded-full text-[#38BDF8] font-semibold">{comp.distance} km</span>
                </div>
                <div className="flex justify-between text-xs mt-2 pt-2 border-t border-[#323A46]/60">
                  <span className="text-[#7E8A99]">{t('hyperlocal.estRevenue') || 'Est. Revenue'}</span>
                  <span className="font-bold text-[#DFE6EF]">{formatINR(comp.estimatedMonthlyRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Local Demand Chart */}
        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-[#DFE6EF] flex items-center">
              <TrendingUp className="mr-2 text-[#38BDF8]" /> {t('hyperlocal.localDemand') || 'Local Demand by Category'}
            </h2>
            <span className="text-xs text-[#7E8A99] bg-[#11141A] px-2.5 py-1 rounded-full border border-[#323A46]">Index 0-100</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={hyperlocalData.demand} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#323A46" />
                <XAxis type="number" stroke="#7E8A99" tick={{ fill: '#7E8A99' }} />
                <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 12, fill: '#7E8A99' }} stroke="#7E8A99" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#11141A', borderColor: '#323A46', borderRadius: '0.75rem', color: '#DFE6EF' }}
                  itemStyle={{ color: '#DFE6EF' }}
                />
                <Bar dataKey="demand" name={t('hyperlocal.localDemand') || 'Demand Index'} fill="#38BDF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="bg-[#1B2028] border border-[#323A46] p-6 rounded-2xl shadow-xl flex flex-col min-h-[400px]">
          <h2 className="text-xl font-heading font-bold text-[#DFE6EF] mb-4">{t('hyperlocal.pricingComparison')}</h2>
          <div className="flex-1 w-full overflow-x-auto">
            <DataTable 
              columns={columns} 
              data={hyperlocalData.pricing} 
            />
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-[#DFE6EF] px-1">{t('hyperlocal.opportunities')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hyperlocalData.opportunities.map((opp: any, idx: number) => (
            <InsightCard 
              key={idx}
              title={opp.title}
              description={opp.description}
              type="market"
              actionLabel={t('common.viewDetails') || 'View Details'}
              actionRoute="/hyperlocal"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
