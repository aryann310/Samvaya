import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  MapPin, 
  PieChart, 
  TrendingUp, 
  Package, 
  Landmark, 
  FileText,
  BarChart3,
  Settings
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Business", href: "/business", icon: Briefcase },
  { name: "AI Advisor", href: "/advisor", icon: MessageSquare },
  { name: "Hyperlocal Market", href: "/hyperlocal", icon: MapPin },
  { name: "Finances", href: "/finances", icon: PieChart },
  { name: "Cash Flow", href: "/cashflow", icon: TrendingUp },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Financing", href: "/financing", icon: Landmark },
  { name: "Gov Schemes", href: "/schemes", icon: FileText },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="h-full w-64 flex flex-col bg-white border-r border-gray-100 shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="text-lg font-bold text-text">AdvisoryAI</span>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-text"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-gray-600 hover:bg-gray-50 hover:text-text"
            )
          }
        >
          <Settings className="w-5 h-5" />
          Profile/Settings
        </NavLink>
      </div>
    </aside>
  );
}
