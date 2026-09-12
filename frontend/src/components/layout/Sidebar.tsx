import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutGrid, 
  User, 
  ArrowLeftRight, 
  ChevronDown, 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  BookOpen, 
  Headphones, 
  Zap, 
  X, 
  ChevronsLeft,
  MapPin,
  Users
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function Sidebar() {
  const [showProCard, setShowProCard] = useState(true);
  const [transactionsOpen, setTransactionsOpen] = useState(true);
  const location = useLocation();

  const isTransactionsActive = ["/finances", "/cashflow", "/reports"].includes(location.pathname);

  return (
    <aside className="h-full w-64 flex flex-col bg-white border-r border-gray-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none">
      {/* Brand Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gray-950 flex items-center justify-center text-white font-black text-sm tracking-tighter">
            AC
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gray-900">ACRU</span>
            <span className="text-[10px] font-semibold tracking-wider text-lime-600 uppercase -mt-1">Samvaya</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto text-sm">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <LayoutGrid className="w-5 h-5 text-gray-700" />
              <span>Dashboard</span>
            </>
          )}
        </NavLink>

        {/* Accounts / Business */}
        <NavLink
          to="/business"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <User className="w-5 h-5 text-gray-500" />
              <span>Accounts</span>
            </>
          )}
        </NavLink>

        {/* Transactions with Sub-menu */}
        <div>
          <button
            onClick={() => setTransactionsOpen(!transactionsOpen)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              isTransactionsActive && "text-gray-900 font-semibold"
            )}
          >
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-5 h-5 text-gray-500" />
              <span>Transactions</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", transactionsOpen && "rotate-180")} />
          </button>

          {transactionsOpen && (
            <div className="ml-6 pl-4 border-l border-gray-200/80 my-1 space-y-1">
              <NavLink
                to="/finances"
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "text-gray-950 font-semibold" : "text-gray-500 hover:text-gray-900"
                  )
                }
              >
                <span>History</span>
                <span className="bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">19</span>
              </NavLink>
              <NavLink
                to="/cashflow"
                className={({ isActive }) =>
                  cn(
                    "block py-1.5 px-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "text-gray-950 font-semibold" : "text-gray-500 hover:text-gray-900"
                  )
                }
              >
                Integration
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  cn(
                    "block py-1.5 px-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "text-gray-950 font-semibold" : "text-gray-500 hover:text-gray-900"
                  )
                }
              >
                Reports
              </NavLink>
            </div>
          )}
        </div>

        {/* Cash flow */}
        <NavLink
          to="/cashflow"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <Wallet className="w-5 h-5 text-gray-500" />
              <span>Cash flow</span>
            </>
          )}
        </NavLink>

        {/* Budget */}
        <NavLink
          to="/finances"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <PiggyBank className="w-5 h-5 text-gray-500" />
              <span>Budget</span>
            </>
          )}
        </NavLink>

        {/* Investments / Financing */}
        <NavLink
          to="/financing"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <span>Investments</span>
            </>
          )}
        </NavLink>

        {/* Learning Center / Schemes */}
        <NavLink
          to="/schemes"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <BookOpen className="w-5 h-5 text-gray-500" />
              <span>Learning center</span>
            </>
          )}
        </NavLink>

        {/* Hyperlocal Market */}
        <NavLink
          to="/hyperlocal"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>Local Market</span>
            </>
          )}
        </NavLink>

        {/* Team */}
        <NavLink
          to="/team"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <Users className="w-5 h-5 text-gray-500" />
              <span>Collaborators</span>
            </>
          )}
        </NavLink>

        {/* Support / AI Advisor */}
        <NavLink
          to="/advisor"
          className={({ isActive }) =>
            cn(
              "flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all relative",
              isActive 
                ? "bg-gray-100/80 text-gray-900 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gray-900 rounded-r-full" />
              )}
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-gray-500" />
                <span>Support & AI</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            </>
          )}
        </NavLink>
      </nav>

      {/* Upgrade to Pro / AI Advisory Banner */}
      {showProCard && (
        <div className="p-3 mx-3 mb-3 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] relative">
          <button 
            onClick={() => setShowProCard(false)}
            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white mb-2">
            <Zap className="w-3.5 h-3.5 text-lime-400 fill-lime-400" />
          </div>
          <h4 className="text-sm font-bold text-gray-900">Upgrade to Pro!</h4>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
            Full financial insights with analytics and graphs.
          </p>
          <NavLink
            to="/advisor"
            className="mt-3 block w-full text-center py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Upgrade now
          </NavLink>
        </div>
      )}

      {/* Collapse sidebar footer */}
      <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 hover:text-gray-700 flex items-center gap-2 cursor-pointer transition-colors">
        <ChevronsLeft className="w-4 h-4" />
        <span>Collapse sidebar</span>
      </div>
    </aside>
  );
}
