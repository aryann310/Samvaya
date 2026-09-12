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
    colorClass: 'bg-success/20 text-success',
  },
  warning: {
    icon: AlertTriangle,
    colorClass: 'bg-warning/20 text-warning',
  },
  danger: {
    icon: XCircle,
    colorClass: 'bg-danger/20 text-danger',
  },
  info: {
    icon: Info,
    colorClass: 'bg-info/20 text-info',
  },
  neutral: {
    icon: Circle,
    colorClass: 'bg-border/50 text-body-text',
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
