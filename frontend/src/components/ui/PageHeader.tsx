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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-slide-in-right pb-4 border-b border-[#323A46]">
      <div className="flex flex-col relative">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-6 rounded-full bg-gradient-to-b from-[#38BDF8] to-[#7E8A99]"></span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#DFE6EF]">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#7E8A99] mt-1.5 ml-4.5 font-medium">{subtitle}</p>
        )}
      </div>
      
      {action && (
        <button 
          onClick={action.onClick}
          className="btn-primary flex items-center gap-2 self-start md:self-auto font-semibold shadow-md"
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
