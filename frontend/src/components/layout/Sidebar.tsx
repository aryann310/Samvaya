import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutGrid, 
  Sparkles,
  Wallet, 
  ArrowLeftRight, 
  TrendingUp, 
  BarChart3,
  Package,
  MapPin,
  Building2,
  BookOpen, 
  Settings,
  ChevronsLeft,
  ChevronsRight,
  X,
  LogOut
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  hasIndicator?: boolean;
  isFeatured?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { to: "/", label: "Dashboard", icon: LayoutGrid },
      { 
        to: "/advisor", 
        label: "AI Copilot", 
        icon: Sparkles, 
        badge: "Active",
        hasIndicator: true,
        isFeatured: true 
      }
    ]
  },
  {
    title: "Financials",
    items: [
      { to: "/finances", label: "Finances & Budget", icon: Wallet },
      { to: "/cashflow", label: "Cash Flow", icon: ArrowLeftRight },
      { to: "/financing", label: "Credit & Financing", icon: TrendingUp },
      { to: "/reports", label: "Reports & Analytics", icon: BarChart3 },
    ]
  },
  {
    title: "Operations",
    items: [
      { to: "/inventory", label: "Inventory", icon: Package },
      { to: "/hyperlocal", label: "Local Market", icon: MapPin },
    ]
  },
  {
    title: "Organization",
    items: [
      { to: "/business", label: "Business Profile", icon: Building2 },
      { to: "/schemes", label: "Govt Schemes", icon: BookOpen },
    ]
  },
  {
    title: "Preferences",
    items: [
      { to: "/settings", label: "Settings", icon: Settings },
    ]
  }
];

export default function Sidebar({ isCollapsed = false, onToggleCollapse, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  return (
    <aside className={cn(
      "h-full flex flex-col bg-card border-r border-glass-border shadow-glass-shadow select-none transition-all duration-300",
      isCollapsed ? "w-16 md:w-20" : "w-64"
    )}>
      {/* Brand Header */}
      <div className={cn("py-5 flex items-center transition-all", isCollapsed ? "px-3 justify-center" : "px-6 justify-between")}>
        <div className="flex items-center gap-2.5">
          <div 
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "ACRU"}
            className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center text-background font-black text-sm tracking-tighter shrink-0 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
          >
            AC
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-foreground leading-none">ACRU</span>
              <span className="text-[10px] font-semibold tracking-wider text-lime-600 uppercase mt-0.5">Samvaya</span>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        {!isCollapsed && onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-1 space-y-3 overflow-y-auto text-sm">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {/* Section Title / Divider */}
            {section.title && (
              isCollapsed ? (
                <div className="border-t border-border/40 my-2 mx-1" />
              ) : (
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-3 pt-2 pb-0.5">
                  {section.title}
                </div>
              )
            )}

            {/* Section Nav Items */}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) => {
                    if (item.isFeatured) {
                      return cn(
                        "flex items-center gap-3 py-2 rounded-xl font-medium transition-all relative group border",
                        isCollapsed ? "justify-center px-2" : "justify-between px-3",
                        isActive 
                          ? "bg-gradient-to-r from-lime-500/25 via-emerald-500/15 to-lime-500/10 border-lime-500/50 text-foreground font-semibold shadow-xs" 
                          : "bg-gradient-to-r from-lime-500/10 via-emerald-500/5 to-transparent border-lime-500/25 text-foreground hover:border-lime-500/45 hover:bg-lime-500/15"
                      );
                    }

                    return cn(
                      "flex items-center gap-3 py-2 rounded-xl font-medium transition-all relative group",
                      isCollapsed ? "justify-center px-2" : "justify-between px-3",
                      isActive 
                        ? "bg-muted text-foreground font-semibold" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    );
                  }}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !item.isFeatured && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-foreground rounded-r-full" />
                      )}
                      {isActive && item.isFeatured && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-lime-500 rounded-r-full shadow-[0_0_8px_rgba(132,204,22,0.8)]" />
                      )}
                      
                      <div className={cn("flex items-center gap-2.5 min-w-0", isCollapsed && "justify-center")}>
                        <Icon className={cn(
                          "w-4 h-4 shrink-0 transition-all",
                          item.isFeatured 
                            ? "text-lime-500 dark:text-lime-400 group-hover:scale-110" 
                            : isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {!isCollapsed && (
                          <span className={cn(
                            "truncate text-xs",
                            item.isFeatured ? "font-semibold text-foreground" : ""
                          )}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {/* Featured Copilot Badge */}
                      {!isCollapsed && item.isFeatured && (
                        <span className="flex items-center gap-1.5 bg-lime-500/15 border border-lime-500/30 text-lime-700 dark:text-lime-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                          <span>AI</span>
                        </span>
                      )}

                      {/* Non-featured badge */}
                      {!isCollapsed && !item.isFeatured && item.badge && (
                        <span className="bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout + Collapse Footer */}
      <div className="border-t border-glass-border">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full px-4 py-2.5 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/5 flex items-center transition-colors focus:outline-none",
            isCollapsed ? "justify-center" : "gap-2"
          )}
          title="Sign out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              onClose?.();
            } else {
              onToggleCollapse?.();
            }
          }}
          className={cn(
            "w-full px-4 py-2.5 border-t border-glass-border/50 text-xs text-muted-foreground hover:text-foreground flex items-center transition-colors focus:outline-none",
            isCollapsed ? "justify-center" : "gap-2"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="w-4 h-4 shrink-0" />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
