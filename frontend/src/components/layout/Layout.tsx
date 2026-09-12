import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  Plus 
} from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#f4f5f8] flex text-gray-900 font-sans">
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
        <header className="sticky top-0 z-30 bg-[#f4f5f8]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-white rounded-xl transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Quick search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-lime-500/30 focus:border-lime-500 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-lime-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Settings */}
            <NavLink 
              to="/settings"
              className="w-9 h-9 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
            </NavLink>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 bg-white border border-gray-200/80 py-1 px-2.5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer hover:border-gray-300 transition-all">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-lime-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initial
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 leading-tight">Michael Johnson</span>
                <span className="text-[10px] text-gray-400 font-medium leading-none">m.johnson@finex.com</span>
              </div>
            </div>

            {/* Add Widget / Record Button */}
            <button className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium text-xs py-2 px-3.5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>Add widget</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 pb-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
