import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoadingScreen from './components/ui/LoadingScreen';
import { BusinessProvider } from './contexts/BusinessContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Business = lazy(() => import('./pages/Business'));
const AIAdvisor = lazy(() => import('./pages/AIAdvisor'));
const Hyperlocal = lazy(() => import('./pages/Hyperlocal'));
const Finances = lazy(() => import('./pages/Finances'));
const CashFlow = lazy(() => import('./pages/CashFlow'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Financing = lazy(() => import('./pages/Financing'));
const Schemes = lazy(() => import('./pages/Schemes'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <ThemeProvider>
      <BusinessProvider>
        <AppLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/business" element={<Business />} />
              <Route path="/advisor" element={<AIAdvisor />} />
              <Route path="/hyperlocal" element={<Hyperlocal />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/cashflow" element={<CashFlow />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/financing" element={<Financing />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BusinessProvider>
    </ThemeProvider>
  );
}

export default App;
