import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Bot, 
  Wallet, 
  LineChart, 
  Package, 
  MapPin, 
  CreditCard, 
  Briefcase, 
  FileText, 
  Building2, 
  Settings
} from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useBusiness } from '../../contexts/BusinessContext';

export default function Sidebar() {
  const { t } = useTranslation();
  const { business } = useBusiness();

  const navItems = [
    { name: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: t('nav.advisor') || 'AI Advisor', icon: Bot, path: '/advisor' },
    { name: t('nav.finances') || 'Finances', icon: Wallet, path: '/finances' },
    { name: t('nav.cashflow') || 'Cash Flow', icon: LineChart, path: '/cashflow' },
    { name: t('nav.inventory') || 'Inventory', icon: Package, path: '/inventory' },
    { name: t('nav.hyperlocal') || 'Hyperlocal Market', icon: MapPin, path: '/hyperlocal' },
    { name: t('nav.financing') || 'Financing', icon: CreditCard, path: '/financing' },
    { name: t('nav.schemes') || 'Government Schemes', icon: Briefcase, path: '/schemes' },
    { name: t('nav.reports') || 'Reports', icon: FileText, path: '/reports' },
    { name: t('nav.business') || 'My Business', icon: Building2, path: '/business' },
    { name: t('nav.settings') || 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="h-full w-full bg-[#0B0C0F] text-[#DFE6EF] border-r border-[#323A46] flex flex-col shadow-2xl select-none relative overflow-hidden" aria-label="Sidebar Navigation">
      {/* Ambient subtle glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#323A46]/30 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-16 left-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl pointer-events-none -ml-8" />

      {/* Brand Header */}
      <div className="p-5 border-b border-[#323A46] flex items-center gap-3 relative z-10 bg-[#11141A]/60">
        <div className="p-1.5 rounded-xl bg-gradient-to-tr from-[#323A46] via-[#1B2028] to-[#7E8A99]/40 border border-[#7E8A99]/30 shadow-md flex-shrink-0">
          <img 
            src="/logo-icon.png" 
            alt="Samvaya Logo" 
            className="h-8 w-8 object-contain rounded-lg"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-heading text-lg font-black tracking-tight text-[#DFE6EF] leading-tight">
              Samvaya
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-[#323A46] text-[#DFE6EF] border border-[#7E8A99]/40 px-1.5 py-0.5 rounded shadow-xs">
              AI
            </span>
          </div>
          <span className="text-[11px] text-[#7E8A99] font-medium truncate">
            {t('app.tagline') || 'Hyperlocal Business Advisory'}
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 relative z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-[#1B2028] text-[#DFE6EF] font-bold border border-[#7E8A99]/50 shadow-md'
                  : 'text-[#7E8A99] hover:bg-[#1B2028]/60 hover:text-[#DFE6EF] font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#38BDF8]' : 'text-[#7E8A99]'}`} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-[#323A46] mt-auto bg-[#11141A] space-y-3 relative z-10">
        <div>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-[#323A46]/70">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#323A46] to-[#7E8A99]/30 border border-[#7E8A99]/40 flex items-center justify-center text-[#DFE6EF] font-heading font-bold text-sm shadow-sm flex-shrink-0">
            {business?.owner?.name ? business.owner.name.charAt(0) : 'R'}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-sm font-semibold text-[#DFE6EF] truncate">
              {business?.name || 'Patel General Store'}
            </p>
            <p className="text-xs text-[#7E8A99] truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
              {business?.owner?.name || 'Rameshbhai Patel'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
