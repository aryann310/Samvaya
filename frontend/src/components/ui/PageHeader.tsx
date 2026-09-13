import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-glass-border">
      <div className="flex flex-col relative">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-primary to-lime-600"></span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 ml-4 font-medium">{subtitle}</p>
        )}
      </div>
      
      {action && (
        <button 
          onClick={action.onClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs shadow-xs transition-colors self-start md:self-auto"
          aria-label={action.label}
        >
          {action.icon && <span aria-hidden="true">{action.icon}</span>}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
