import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AIAdvisor from "./pages/AIAdvisor";
import Finances from "./pages/Finances";
import Hyperlocal from "./pages/Hyperlocal";
import Team from "./pages/Team";
import Business from "./pages/Business";
import CashFlow from "./pages/CashFlow";
import Inventory from "./pages/Inventory";
import Financing from "./pages/Financing";
import Schemes from "./pages/Schemes";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { BusinessProvider } from "./contexts/BusinessContext";

// Active Module: Core Dashboard & Business Management
// Assigned Member: Member 1 (Project Lead / Core Platform)

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BusinessProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="advisor" element={<AIAdvisor />} />
              <Route path="business" element={<Business />} />
              <Route path="hyperlocal" element={<Hyperlocal />} />
              <Route path="finances" element={<Finances />} />
              <Route path="cashflow" element={<CashFlow />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="financing" element={<Financing />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="team" element={<Team />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BusinessProvider>
    </ThemeProvider>
  );
}

export default App;
