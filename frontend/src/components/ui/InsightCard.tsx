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
  revenue: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  cost: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  inventory: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  market: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  growth: 'bg-lime-500/15 text-lime-700 dark:text-lime-400',
};

const typeBorderColors = {
  revenue: 'border-l-emerald-500',
  cost: 'border-l-rose-500',
  inventory: 'border-l-amber-500',
  market: 'border-l-blue-500',
  growth: 'border-l-lime-500',
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
    <div className={`p-5 rounded-3xl bg-card/70 backdrop-blur-md border border-glass-border border-l-4 ${typeBorderColors[type]} shadow-glass-shadow hover:border-primary/40 transition-all duration-200 flex flex-col gap-3.5 animate-scale-in`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3 items-center min-w-0">
          {icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[type]}`}>
              {icon}
            </div>
          )}
          <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">{title}</h3>
        </div>
        {priority && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${priority === 'high' ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20' : priority === 'medium' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'}`}>
            {t(`priority.${priority}`, `${priority} priority`)}
          </span>
        )}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-grow">{description}</p>
      <Link 
        to={actionRoute} 
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline uppercase tracking-wider transition-colors pt-1 self-start group"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default InsightCard;
