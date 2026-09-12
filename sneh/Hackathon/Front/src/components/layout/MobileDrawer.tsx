import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LineChart, 
  Package, 
  CreditCard, 
  Briefcase, 
  FileText, 
  Building2, 
  Settings,
  X 
} from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav.cashflow') || 'Cash Flow', icon: LineChart, path: '/cashflow' },
    { name: t('nav.inventory') || 'Inventory', icon: Package, path: '/inventory' },
    { name: t('nav.financing') || 'Financing', icon: CreditCard, path: '/financing' },
    { name: t('nav.schemes') || 'Government Schemes', icon: Briefcase, path: '/schemes' },
    { name: t('nav.reports') || 'Reports', icon: FileText, path: '/reports' },
    { name: t('nav.business') || 'My Business', icon: Building2, path: '/business' },
    { name: t('nav.settings') || 'Settings', icon: Settings, path: '/settings' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-charcoal/50 animate-fade-in" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-[#0B0C0F] border-l border-[#323A46] shadow-2xl flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label={t('mobileDrawer.ariaLabel')}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#323A46] bg-[#11141A]">
          <span className="font-heading font-bold text-lg text-[#DFE6EF]">{t('nav.more')}</span>
          <button 
            onClick={onClose}
            className="p-2 text-[#7E8A99] hover:text-[#DFE6EF] hover:bg-[#1B2028] rounded-xl transition-colors"
            aria-label={t('mobileDrawer.closeLabel')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#1B2028] text-[#DFE6EF] font-bold border border-[#7E8A99]/50'
                    : 'text-[#7E8A99] hover:bg-[#1B2028]/60 hover:text-[#DFE6EF] font-medium'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#323A46] bg-[#11141A] mt-auto">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
