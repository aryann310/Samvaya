import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import MobileDrawer from './MobileDrawer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isFullHeightPage = location.pathname === '/advisor';

  return (
    <div className="flex h-screen bg-[#0B0C0F] font-body text-[#DFE6EF] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[260px] h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden relative bg-[#0B0C0F]">
        <TopBar onMenuClick={() => setIsMobileDrawerOpen(true)} />
        
        <main className={`flex-1 min-w-0 bg-[#0B0C0F] ${isFullHeightPage ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          {isFullHeightPage ? (
            <div className="flex-1 h-full w-full overflow-hidden bg-[#0B0C0F]">
              {children}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 page-enter min-w-0 bg-[#0B0C0F]">
              {children}
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
          <BottomNav onMoreClick={() => setIsMobileDrawerOpen(true)} />
        </div>
      </div>

      <MobileDrawer 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
      />
    </div>
  );
}
