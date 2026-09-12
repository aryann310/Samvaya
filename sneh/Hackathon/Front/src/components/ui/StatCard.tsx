import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { SkeletonCard } from './SkeletonLoader';

export interface StatCardProps {
  label: string;
  value: string;
  trend: number;
  sparklineData: number[];
  icon: React.ReactNode;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  sparklineData,
  icon,
  loading = false,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <SkeletonCard />;
  }

  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-success' : 'text-danger';
  
  const chartData = sparklineData.map((val, index) => ({ value: val, index }));
  const strokeColor = isPositive ? 'var(--color-success, #10b981)' : 'var(--color-danger, #ef4444)';
  const fillColor = isPositive ? 'var(--color-success, #10b981)' : 'var(--color-danger, #ef4444)';

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#1B2028] border border-[#323A46] p-5 flex flex-col justify-between shadow-xl hover:border-[#7E8A99] transition-all duration-300 animate-fade-in">
      {/* Subtle hover gradient accent */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#323A46]/40 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-[#11141A] text-[#DFE6EF] border border-[#323A46] flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#7E8A99]">{label}</span>
      </div>
      
      <div className="text-2xl lg:text-3xl font-black font-heading text-[#DFE6EF] tracking-tight my-2 relative z-10">
        {value}
      </div>

      <div className="flex items-end justify-between relative z-10">
        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span>{Math.abs(trend)}%</span>
          <span className="sr-only">
            {isPositive ? t('trend.up', 'Trending up') : t('trend.down', 'Trending down')}
          </span>
        </div>
        
        <div className="w-32 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={strokeColor} 
                fill={fillColor} 
                fillOpacity={0.2}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
