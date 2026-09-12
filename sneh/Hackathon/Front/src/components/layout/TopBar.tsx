import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Search } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';

import ThemeToggle from '../ui/ThemeToggle';

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { t } = useTranslation();
  const { business } = useBusiness();

  const userInitial = business?.owner?.name 
    ? business.owner.name.trim().charAt(0).toUpperCase() 
    : 'R';

  return (
    <header className="bg-[#0B0C0F]/90 backdrop-blur-md border-b border-[#323A46] h-16 flex items-center justify-between px-4 lg:px-6 shadow-md flex-shrink-0 sticky top-0 z-20 gap-4" aria-label="Application Header">
      {/* Mobile Left */}
      <div className="flex items-center gap-3 lg:hidden flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-[#7E8A99] hover:text-[#DFE6EF] hover:bg-[#1B2028] transition-colors"
          aria-label={t('topbar.menuBtnLabel') || 'Open Menu'}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <img 
            src="/logo-icon.png" 
            alt="Samvaya Logo" 
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="font-heading text-xl font-bold text-[#DFE6EF]">
            Samvaya
          </span>
        </div>
      </div>

      {/* Desktop Left (Search & Location Indicator) */}
      <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl min-w-0">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#7E8A99]" />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#323A46] bg-[#11141A] text-[#DFE6EF] text-sm placeholder:text-[#7E8A99]/70 focus:outline-none focus:border-[#7E8A99] focus:ring-1 focus:ring-[#7E8A99] transition-all shadow-inner"
            placeholder={t('common.search') || 'Search insights, inventory, schemes...'}
            aria-label="Search"
          />
        </div>

        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B2028] border border-[#323A46] text-xs font-semibold text-[#DFE6EF] flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
          <span>Modhera, Gujarat</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 flex-shrink-0 ml-auto">
        {/* Black to White Theme Mode Toggle */}
        <ThemeToggle />

        <button
          className="relative p-2.5 rounded-xl border border-[#323A46] bg-[#11141A] text-[#7E8A99] hover:text-[#DFE6EF] hover:bg-[#1B2028] transition-colors focus:outline-none shadow-sm"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"></span>
        </button>
        
        {/* Desktop Avatar Profile Badge */}
        <div 
          className="hidden sm:flex items-center gap-3 pl-3 border-l border-[#323A46] flex-shrink-0"
          title={business?.owner?.name || 'Rameshbhai Patel'}
        >
          <div className="h-9 w-9 rounded-xl bg-[#323A46] border border-[#7E8A99]/40 text-[#DFE6EF] flex items-center justify-center font-heading font-bold text-sm shadow-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="hidden md:flex flex-col text-left leading-tight max-w-[130px] overflow-hidden">
            <span className="text-xs font-semibold text-[#DFE6EF] truncate block">
              {business?.owner?.name || 'Rameshbhai Patel'}
            </span>
            <span className="text-[11px] text-[#7E8A99] truncate block">
              {business?.name || 'Patel General Store'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
