import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationDropdown from "./NotificationDropdown";
import ToastContainer from "./ToastContainer";
import VoiceCopilot from "../voice/VoiceCopilot";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useState } from "react";
import { 
  Menu, 
  Search, 
  Settings as SettingsIcon 
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useBusiness } from "../../contexts/BusinessContext";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { business } = useBusiness();

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans transition-colors duration-300 relative">
      {/* On-screen Top-Right Corner Toast Notifications */}
      <ToastContainer />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 md:static md:z-auto shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggleCollapse={() => setIsCollapsed(prev => !prev)}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-glass-border px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Menu Trigger (Desktop collapse toggle & Mobile drawer toggle) */}
            <button 
              className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(prev => !prev);
                } else {
                  setIsCollapsed(prev => !prev);
                }
              }}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Quick search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/70 backdrop-blur-sm pl-10 pr-4 py-2 text-xs rounded-xl border border-glass-border shadow-glass-shadow focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
              />
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            
            <ThemeToggle />

            {/* Notification Bell Dropdown */}
            <NotificationDropdown />

            {/* Settings */}
            <NavLink 
              to="/settings"
              className="w-9 h-9 rounded-xl bg-card/70 backdrop-blur-md border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-glass-shadow transition-colors"
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </NavLink>

            {/* User Profile Pill */}
            <NavLink 
              to="/business"
              className="flex items-center gap-2.5 bg-card/70 backdrop-blur-md border border-glass-border py-1 px-2.5 rounded-xl shadow-glass-shadow cursor-pointer hover:bg-muted/50 transition-all"
              title="Business Profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-lime-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="hidden sm:flex flex-col text-left max-w-[140px]">
                <span className="text-xs font-bold text-foreground leading-tight truncate">
                  {business?.owner?.name || "Arvindbhai Patel"}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium leading-none truncate mt-0.5">
                  {business?.name || "Shree Ganesh Kirana Store"}
                </span>
              </div>
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 pb-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
      
      <VoiceCopilot />
    </div>
  );
}
