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
    <aside className="h-full w-64 flex flex-col bg-card border-r border-glass-border shadow-glass-shadow select-none">
      {/* Brand Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center text-background font-black text-sm tracking-tighter">
            AC
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-foreground">ACRU</span>
            <span className="text-[10px] font-semibold tracking-wider text-lime-600 uppercase -mt-1">Samvaya</span>
          </div>
        </div>
      </div>

            {/* Distribution Workspace Badge */}
      <div className="mx-4 mb-3 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold flex items-center justify-between shadow-sm">
        <span>AI Advisor & Intelligence</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/20 font-bold">AI Core</span>
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <LayoutGrid className="w-5 h-5 text-foreground/80" />
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <User className="w-5 h-5 text-muted-foreground" />
              <span>Accounts</span>
            </>
          )}
        </NavLink>

        {/* Transactions with Sub-menu */}
        <div>
          <button
            onClick={() => setTransactionsOpen(!transactionsOpen)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              isTransactionsActive && "text-foreground font-semibold"
            )}
          >
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
              <span>Transactions</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", transactionsOpen && "rotate-180")} />
          </button>

          {transactionsOpen && (
            <div className="ml-6 pl-4 border-l border-border my-1 space-y-1">
              <NavLink
                to="/finances"
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                <span>History</span>
                <span className="bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">19</span>
              </NavLink>
              <NavLink
                to="/cashflow"
                className={({ isActive }) =>
                  cn(
                    "block py-1.5 px-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
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
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <Wallet className="w-5 h-5 text-muted-foreground" />
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <PiggyBank className="w-5 h-5 text-muted-foreground" />
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <BookOpen className="w-5 h-5 text-muted-foreground" />
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <MapPin className="w-5 h-5 text-muted-foreground" />
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <Users className="w-5 h-5 text-muted-foreground" />
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
                ? "bg-muted text-foreground font-semibold" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-foreground rounded-r-full" />
              )}
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-muted-foreground" />
                <span>Support & AI</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            </>
          )}
        </NavLink>
      </nav>

      {/* Upgrade to Pro / AI Advisory Banner */}
      {showProCard && (
        <div className="p-3 mx-3 mb-3 bg-card rounded-2xl border border-glass-border shadow-glass-shadow relative">
          <button 
            onClick={() => setShowProCard(false)}
            className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-background mb-2">
            <Zap className="w-3.5 h-3.5 text-lime-400 fill-lime-400" />
          </div>
          <h4 className="text-sm font-bold text-foreground">Upgrade to Pro!</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            Full financial insights with analytics and graphs.
          </p>
          <NavLink
            to="/advisor"
            className="mt-3 block w-full text-center py-2 bg-foreground hover:opacity-90 text-background text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Upgrade now
          </NavLink>
        </div>
      )}

      {/* Collapse sidebar footer */}
      <div className="px-4 py-3 border-t border-glass-border text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer transition-colors">
        <ChevronsLeft className="w-4 h-4" />
        <span>Collapse sidebar</span>
      </div>
    </aside>
  );
}
