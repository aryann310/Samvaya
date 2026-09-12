import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Bot, Wallet, MapPin, Menu } from 'lucide-react';

interface BottomNavProps {
  onMoreClick: () => void;
}

export default function BottomNav({ onMoreClick }: BottomNavProps) {
  const { t } = useTranslation();

  const tabs = [
    { name: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: t('nav.advisor') || 'AI Advisor', icon: Bot, path: '/advisor' },
    { name: t('nav.finances') || 'Finances', icon: Wallet, path: '/finances' },
    { name: t('nav.hyperlocal') || 'Market', icon: MapPin, path: '/hyperlocal' },
  ];

  return (
    <nav className="bg-[#0B0C0F] border-t border-[#323A46] pb-safe flex justify-around shadow-2xl" aria-label={t('bottomNav.ariaLabel')}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full py-2 space-y-1 transition-all ${
              isActive ? 'text-[#38BDF8] font-bold' : 'text-[#7E8A99] hover:text-[#DFE6EF]'
            }`
          }
        >
          <tab.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{tab.name}</span>
        </NavLink>
      ))}
      <button
        onClick={onMoreClick}
        className="flex flex-col items-center justify-center w-full py-2 space-y-1 text-[#7E8A99] hover:text-[#DFE6EF] transition-colors"
        aria-label={t('bottomNav.moreLabel')}
      >
        <Menu className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t('nav.more')}</span>
      </button>
    </nav>
  );
}
