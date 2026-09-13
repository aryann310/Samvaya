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
  Settings,
  Users
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
    { name: 'Collaborators', icon: Users, path: '/team' },
  ];

  return (
    <aside className="h-full w-64 bg-card border-r border-border/40 flex flex-col shadow-sm select-none relative overflow-hidden" aria-label="Sidebar Navigation">
      {/* Brand Header */}
      <div className="p-4 border-b border-border/40 flex items-center gap-3 relative z-10 bg-card/60">
        <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/20 shadow-xs flex-shrink-0">
          <img 
            src="/logo-icon.png" 
            alt="Samvaya Logo" 
            className="h-7 w-7 object-contain rounded-lg"
            onError={(e) => {
              // Graceful fallback to SVG/CSS icon if image not found
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-foreground leading-tight">
              Samvaya
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded shadow-xs">
              AI
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium truncate">
            {t('app.tagline') || 'Hyperlocal Business Advisory'}
          </span>
        </div>
      </div>

      {/* Distribution Workspace Badge */}
      <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-between shadow-xs">
        <span className="truncate">Core Dashboard & Business</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 font-bold flex-shrink-0">Platform</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 relative z-10 text-sm">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/15 text-primary font-bold border border-primary/30 shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="p-3 border-t border-border/40 mt-auto bg-card/80 space-y-2.5 relative z-10">
        <div>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-2.5 pt-2 border-t border-border/30">
          <div className="h-8 w-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shadow-xs flex-shrink-0">
            {business?.owner?.name ? business.owner.name.charAt(0) : 'R'}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">
              {business?.name || 'Patel General Store'}
            </p>
            <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {business?.owner?.name || 'Rameshbhai Patel'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
