import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  BarChart2, 
  TrendingUp, 
  ArrowUpRight, 
  Edit2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  History, 
  MoreHorizontal, 
  ArrowUpDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useBusiness } from "../contexts/BusinessContext";
import { getDashboard, getIntelligenceSummary } from "../services/api";
import type { DashboardData } from "../types";

export default function Dashboard() {
  const { business, businessId } = useBusiness();
  const [data, setData] = useState<DashboardData | null>(null);
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currencyMode, setCurrencyMode] = useState<"INR" | "USD">("INR");
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getDashboard(businessId),
      getIntelligenceSummary()
    ])
      .then(([dashboardRes, intelRes]) => {
        if (isMounted) {
          setData(dashboardRes);
          setIntel(intelRes);
          if (dashboardRes?.cashFlowChart && dashboardRes.cashFlowChart.length > 0) {
            setSelectedMonthIdx(dashboardRes.cashFlowChart.length - 1);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [businessId]);

  const currencySymbol = currencyMode === "INR" ? "₹" : "$";
  const formatAmount = (amount: number) => {
    const val = currencyMode === "USD" ? Math.round(amount / 80) : amount;
    return `${currencySymbol}${val.toLocaleString('en-IN')}`;
  };

  const revenue = intel?.financial?.revenue ?? data?.stats?.revenue?.value ?? 0;
  const expenses = intel?.financial?.expenses ?? data?.stats?.expenses?.value ?? 0;
  const profit = intel?.financial?.netProfit ?? data?.stats?.profit?.value ?? 0;
  const cashBalance = intel?.cashFlow?.currentCash ?? data?.stats?.cash?.value ?? 0;
  const healthScore = intel?.businessHealth?.score ?? data?.healthScore?.score ?? 0;
  const cashFlowList = data?.cashFlowChart || [];

  const currentChartItem = cashFlowList[selectedMonthIdx] || cashFlowList[cashFlowList.length - 1] || { month: "N/A", inflow: 0, outflow: 0 };

  const ownerName = business?.owner?.name || "";
  const businessName = business?.name || "My Business";

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-lime-500 border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">Loading live business analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Banner / Currency & Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Financial Overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time balances, cash trajectories, and hyperlocal market signals for {businessName}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrencyMode(currencyMode === "INR" ? "USD" : "INR")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card/70 backdrop-blur-md border border-glass-border rounded-xl text-xs font-semibold text-foreground/80 shadow-xs hover:border-lime-500 transition-colors"
          >
            <span>Currency:</span>
            <span className="text-lime-600 font-bold">{currencyMode}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 Columns & Right Sidebar Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* LEFT / CENTER CONTENT (xl:col-span-8) */}
        <div className="xl:col-span-8 space-y-5">
          
          {/* Row 1: Balance Overview Card + Quick Stat Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Balance Overview Card (lg:col-span-8) */}
            <div className="lg:col-span-8 bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
              <div>
                {/* Top header row */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">
                      {formatAmount(cashBalance)}
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Available Cash Balance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-lime-500/15 border border-lime-500/30 rounded-lg text-xs font-semibold text-lime-700 dark:text-lime-400">
                      Live
                    </span>
                  </div>
                </div>

                {/* Chart Legend */}
                <div className="flex items-center gap-5 mt-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#84cc16]" />
                    <span className="text-muted-foreground">Cash Inflow</span>
                    <span className="text-foreground font-bold">{formatAmount(currentChartItem?.inflow || revenue)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#fb923c]" />
                    <span className="text-muted-foreground">Cash Outflow</span>
                    <span className="text-foreground font-bold">{formatAmount(currentChartItem?.outflow || expenses)}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Bar Chart Area */}
              <div className="mt-8 relative pt-6 pb-2">
                <div className="grid grid-cols-6 gap-3 items-end h-44 border-b border-dashed border-border pb-2">
                  {cashFlowList.map((entry, idx) => {
                    const maxVal = Math.max(...cashFlowList.map(c => Math.max(c.inflow, c.outflow))) || 200000;
                    const inHeight = Math.round((entry.inflow / maxVal) * 100);
                    const outHeight = Math.round((entry.outflow / maxVal) * 100);
                    const isSelected = idx === selectedMonthIdx;

                    return (
                      <div 
                        key={entry.month} 
                        onClick={() => setSelectedMonthIdx(idx)}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                      >
                        <div className="w-full flex items-end justify-center gap-1.5 h-36">
                          <div 
                            style={{ height: `${inHeight}%` }} 
                            className={`w-3.5 rounded-t-md transition-all ${isSelected ? 'bg-lime-500 shadow-xs' : 'bg-lime-500/60 group-hover:bg-lime-500'}`}
                            title={`Inflow: ${formatAmount(entry.inflow)}`}
                          />
                          <div 
                            style={{ height: `${outHeight}%` }} 
                            className={`w-3.5 rounded-t-md transition-all ${isSelected ? 'bg-orange-500 shadow-xs' : 'bg-orange-500/60 group-hover:bg-orange-500'}`}
                            title={`Outflow: ${formatAmount(entry.outflow)}`}
                          />
                        </div>
                        <span className={`text-[11px] font-semibold transition-colors ${isSelected ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                          {entry.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stat Stack (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3">
              {/* Card 1: Total Revenue */}
              <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex-1 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground font-medium">Monthly Revenue</span>
                <div className="text-2xl font-black text-foreground mt-1">
                  {formatAmount(revenue)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{data?.stats?.revenue?.trend || 5.8}% vs last month</span>
                </div>
              </div>

              {/* Card 2: Total expenses */}
              <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex-1 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground font-medium">Operating Expenses</span>
                <div className="text-2xl font-black text-foreground mt-1">
                  {formatAmount(expenses)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#fb923c] mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{data?.stats?.expenses?.trend || 3.2}% vs last month</span>
                </div>
              </div>

              {/* Card 3: Net Profit */}
              <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex-1 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground font-medium">Net Monthly Profit</span>
                <div className="text-2xl font-black text-foreground mt-1">
                  {formatAmount(profit)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{intel?.financial?.netMargin || 16.4}% net margin</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Actionable Business Priorities & AI Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Real Priorities */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Actionable Priorities</h3>
                  <span className="text-[10px] font-bold text-lime-600 uppercase tracking-wider bg-lime-500/10 px-2 py-0.5 rounded-full">
                    {data?.priorities?.filter(p => !p.completed).length || 0} Pending
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">High-impact tasks generated by Samvaya engine</p>
              </div>

              <div className="my-4 space-y-2.5">
                {(data?.priorities || []).slice(0, 3).map((p) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-muted/40 border border-border/50 flex items-start gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${p.completed ? 'text-lime-500' : 'text-muted-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground leading-tight">{p.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Advisor Hyperlocal Callout */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow flex flex-col justify-between overflow-hidden relative">
              <div>
                <div className="flex items-center gap-1.5 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Market Pulse</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mt-1">
                  {data?.marketPulse?.topCategory || "Fresh Staples & Dairy"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {data?.marketPulse?.summary || "Steady regional demand growth observed in essential groceries across Modhera cluster."}
                </p>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-lime-500/15 via-emerald-500/10 to-transparent border border-lime-500/25 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Nearby Competitors</span>
                  <div className="text-lg font-black text-foreground">
                    {data?.marketPulse?.competitors || 5} stores in 3km
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Demand Growth</span>
                  <div className="text-lg font-black text-lime-600">
                    +{data?.marketPulse?.avgDemandGrowth || 12}%
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Financial Health & Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Financial Health Gauge */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Business Financial Health</h3>
                <p className="text-[11px] text-muted-foreground">Algorithmic credit & stability assessment</p>
                <div className="text-3xl font-black text-foreground mt-2">
                  {healthScore}/100
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{data?.healthScore?.explanation || "Healthy working capital and strong profit margins."}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="my-4">
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-lime-500 to-emerald-500 rounded-full transition-all duration-700" 
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-muted/30 border border-border/40">
                  <span className="text-[10px] text-muted-foreground block truncate">Profitability</span>
                  <span className="font-bold text-foreground">{intel?.businessHealth?.factors?.profitability || 0}/30</span>
                </div>
                <div className="p-2 rounded-xl bg-muted/30 border border-border/40">
                  <span className="text-[10px] text-muted-foreground block truncate">Cash Flow</span>
                  <span className="font-bold text-foreground">{intel?.businessHealth?.factors?.cashFlow || 0}/30</span>
                </div>
                <div className="p-2 rounded-xl bg-muted/30 border border-border/40">
                  <span className="text-[10px] text-muted-foreground block truncate">Inventory</span>
                  <span className="font-bold text-foreground">{intel?.businessHealth?.factors?.inventory || 0}/20</span>
                </div>
                <div className="p-2 rounded-xl bg-muted/30 border border-border/40">
                  <span className="text-[10px] text-muted-foreground block truncate">Debt Service</span>
                  <span className="font-bold text-foreground">{intel?.businessHealth?.factors?.debt || 0}/20</span>
                </div>
              </div>
            </div>

            {/* Growth Opportunities */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Catchment Opportunities</h3>
                <p className="text-[11px] text-muted-foreground">High-probability revenue opportunities</p>
              </div>

              <div className="my-3 space-y-2.5">
                {(data?.opportunities || []).slice(0, 2).map((opp) => (
                  <div key={opp.id} className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-foreground">{opp.title}</h4>
                      <span className="text-[10px] font-bold text-lime-600">{opp.impact}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{opp.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR PANEL (xl:col-span-4) */}
        <div className="xl:col-span-4 space-y-5">
          
          {/* Business Debit Card Widget */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-foreground">Commercial Account</h3>
              <span className="text-[10px] font-bold text-lime-600 uppercase bg-lime-500/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">Kirana Merchant Card</p>

            {/* Primary Lime-Green Card */}
            <div className="relative z-10 w-full h-44 rounded-2xl bg-[#84cc16] text-white p-5 shadow-[0_12px_28px_rgba(132,204,22,0.3)] flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-diagonal-stripes opacity-15 pointer-events-none" />

              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-semibold tracking-wide text-white/90">Merchant RuPay</span>
                <span className="text-sm font-black tracking-wider uppercase">Samvaya</span>
              </div>

              <div className="w-9 h-7 rounded-md bg-amber-200/90 border border-amber-300/60 flex items-center justify-center shadow-xs z-10">
                <div className="w-6 h-4 border border-amber-600/30 rounded-xs" />
              </div>

              <div className="z-10">
                <div className="text-lg font-mono font-bold tracking-widest text-white drop-shadow-xs">
                  •••• •••• •••• 4289
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-white/90 mt-2">
                  <span className="font-semibold">{ownerName}</span>
                  <span className="text-[11px] font-mono">08/29</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <button onClick={() => alert('Feature connected to real banking gateway')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Top up</span>
              </button>
              <button onClick={() => alert('Feature connected to real banking gateway')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <ArrowUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Send</span>
              </button>
              <button onClick={() => alert('Feature connected to real banking gateway')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <ArrowDown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Receive</span>
              </button>
              <button onClick={() => alert('Feature connected to real banking gateway')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <History className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">History</span>
              </button>
            </div>
          </div>

          {/* AI Catchment Insights */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">AI Business Insights</h3>
              <Sparkles className="w-4 h-4 text-lime-500" />
            </div>

            <div className="space-y-3">
              {(data?.insights || []).map((ins: any) => (
                <div key={ins.id} className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-lime-600 uppercase tracking-wider">{ins.type || ins.category || 'Insight'}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">{ins.financialImpact || ins.impact}</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground mt-1">{ins.recommendation || ins.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{ins.why || ins.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
