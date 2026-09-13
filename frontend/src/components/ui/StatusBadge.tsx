import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertTriangle, XCircle, Info, Circle } from 'lucide-react';

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label: string;
  size?: 'sm' | 'md';
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  },
  warning: {
    icon: AlertTriangle,
    colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  },
  danger: {
    icon: XCircle,
    colorClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
  },
  info: {
    icon: Info,
    colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  },
  neutral: {
    icon: Circle,
    colorClass: 'bg-muted text-muted-foreground border border-border',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const { t } = useTranslation();
  const config = statusConfig[status] || statusConfig.neutral;
  const Icon = config.icon;
  
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.colorClass} ${sizeClasses}`}
      role="status"
      aria-label={t(`status.${status}`, `${status} status: ${label}`)}
    >
      <Icon className={iconSize} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

export default StatusBadge;
