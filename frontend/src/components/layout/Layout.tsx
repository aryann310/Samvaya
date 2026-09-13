import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useState } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../auth/AuthModal";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 md:static md:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-glass-border px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/70 backdrop-blur-sm pl-10 pr-4 py-2 text-xs rounded-xl border border-glass-border shadow-glass-shadow focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
              />
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-xl bg-card/70 backdrop-blur-md border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-glass-shadow transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
            </button>

            {/* Settings */}
            <NavLink 
              to="/settings"
              className="w-9 h-9 rounded-xl bg-card/70 backdrop-blur-md border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-glass-shadow transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
            </NavLink>

            {/* User Profile / Auth Action */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 bg-card/70 backdrop-blur-md border border-glass-border py-1 px-2.5 rounded-xl shadow-glass-shadow hover:bg-muted/50 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-bold text-foreground leading-tight flex items-center gap-1">
                      {user.name}
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium leading-none truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-xl p-2 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-3 py-2 border-b border-border/60 mb-1">
                        <p className="text-xs font-bold text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                          {user.role}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>JWT Authenticated</span>
                      </div>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground font-medium text-xs py-2 px-3.5 rounded-xl shadow-glass-shadow hover:bg-primary/90 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 pb-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Authentication Modal */}
      <AuthModal />
    </div>
  );
}

