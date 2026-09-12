import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface InsightCardProps {
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  icon?: React.ReactNode;
  type?: 'revenue' | 'cost' | 'inventory' | 'market' | 'growth';
  priority?: 'high' | 'medium' | 'low';
}

const typeColors = {
  revenue: 'bg-success/20 text-success',
  cost: 'bg-danger/20 text-danger',
  inventory: 'bg-warning/20 text-warning',
  market: 'bg-info/20 text-info',
  growth: 'bg-primary-light/50 text-primary',
};

const priorityColors = {
  high: 'bg-danger',
  medium: 'bg-warning',
  low: 'bg-info',
};

const typeBorderColors = {
  revenue: 'border-l-success',
  cost: 'border-l-danger',
  inventory: 'border-l-warning',
  market: 'border-l-info',
  growth: 'border-l-primary',
};

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  actionLabel,
  actionRoute,
  icon,
  type = 'growth',
  priority,
}) => {
  const { t } = useTranslation();
  return (
    <div className={`p-5 rounded-2xl bg-[#1B2028] border border-[#323A46] border-l-4 ${typeBorderColors[type]} shadow-xl hover:border-[#7E8A99] transition-all duration-200 flex flex-col gap-3.5 animate-scale-in`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3 items-center min-w-0">
          {icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[type]}`}>
              {icon}
            </div>
          )}
          <h3 className="font-heading font-bold text-sm sm:text-base text-[#DFE6EF] leading-snug">{title}</h3>
        </div>
        {priority && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${priority === 'high' ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30' : priority === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30' : 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30'}`}>
            {t(`priority.${priority}`, `${priority} priority`)}
          </span>
        )}
      </div>
      <p className="text-xs sm:text-sm text-[#A4B0BE] leading-relaxed flex-grow">{description}</p>
      <Link 
        to={actionRoute} 
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38BDF8] hover:text-[#DFE6EF] uppercase tracking-wider transition-colors pt-1 self-start group"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default InsightCard;
