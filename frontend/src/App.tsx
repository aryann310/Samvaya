import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Login from "./pages/Login";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { BusinessProvider } from "./contexts/BusinessContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Route guard: redirects to /login if not authenticated
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Full-screen loading while verifying session
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-foreground flex items-center justify-center text-background font-black text-sm animate-pulse">
            AC
          </div>
          <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Redirect authenticated users away from login
function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/business" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public: Login */}
            <Route path="/login" element={
              <GuestOnly>
                <Login />
              </GuestOnly>
            } />

            {/* Protected: All app routes */}
            <Route path="/" element={
              <RequireAuth>
                <BusinessProvider>
                  <Layout />
                </BusinessProvider>
              </RequireAuth>
            }>
              <Route index element={<Navigate to="/business" replace />} />
              <Route path="business" element={<Business />} />
              <Route path="team" element={<Team />} />
              <Route path="advisor" element={<AIAdvisor />} />
              <Route path="hyperlocal" element={<Hyperlocal />} />
              <Route path="finances" element={<Finances />} />
              <Route path="cashflow" element={<CashFlow />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="financing" element={<Financing />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
