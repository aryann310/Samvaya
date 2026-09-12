import { useState } from "react";
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
  ChevronRight
} from "lucide-react";

export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState<string>("Wed");
  const [currencyMode, setCurrencyMode] = useState<"USD" | "INR">("USD");

  const currencySymbol = currencyMode === "USD" ? "$" : "₹";
  const multiplier = currencyMode === "USD" ? 1 : 80;

  const formatAmount = (amount: number) => {
    const val = amount * multiplier;
    return `${currencySymbol}${val.toLocaleString()}`;
  };

  // Stacked chart data
  const days = [
    { day: "Sun", savings: 120, income: 450, expenses: 310, total: 880 },
    { day: "Mon", savings: 190, income: 520, expenses: 280, total: 990 },
    { day: "Tue", savings: 150, income: 490, expenses: 390, total: 1030 },
    { day: "Wed", savings: 240, income: 700, expenses: 460, total: 1400, isCurrent: true },
    { day: "Thu", savings: 180, income: 550, expenses: 340, total: 1070 },
    { day: "Fri", savings: 210, income: 630, expenses: 400, total: 1240 },
    { day: "Sat", savings: 160, income: 480, expenses: 320, total: 960 },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner / Currency & Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Financial Overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time balances, cash trajectories, and hyperlocal market signals.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrencyMode(currencyMode === "USD" ? "INR" : "USD")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card/70 backdrop-blur-md border border-glass-border rounded-xl text-xs font-semibold text-foreground/80 shadow-xs hover:border-lime-500 transition-colors"
          >
            <span>Currency:</span>
            <span className="text-lime-600 font-bold">{currencyMode}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 Columns & Right Sidebar Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* ========================================================================= */}
        {/* LEFT / CENTER CONTENT (xl:col-span-8) */}
        {/* ========================================================================= */}
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
                      {formatAmount(12450)}
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Balance overview</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert('Coming soon!')} className="flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-glass-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors">
                      <span>7d</span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <div className="flex items-center bg-muted p-0.5 rounded-lg border border-glass-border">
                      <button onClick={() => alert('Coming soon!')} className="p-1 rounded text-foreground/80 bg-card/70 backdrop-blur-md shadow-xs">
                        <BarChart2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => alert('Coming soon!')} className="p-1 rounded text-muted-foreground hover:text-foreground/80">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chart Legend */}
                <div className="flex items-center gap-5 mt-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#facc15]" />
                    <span className="text-muted-foreground">Savings</span>
                    <span className="text-foreground font-bold">{formatAmount(240)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#84cc16]" />
                    <span className="text-muted-foreground">Income</span>
                    <span className="text-foreground font-bold">{formatAmount(700)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#fb923c]" />
                    <span className="text-muted-foreground">Expenses</span>
                    <span className="text-foreground font-bold">{formatAmount(460)}</span>
                  </div>
                </div>
              </div>

              {/* Stacked Bar Chart Area */}
              <div className="mt-8 relative pt-12 pb-2">
                {/* Active Day Floating Tooltip (Shown above Wednesday) */}
                <div className="absolute top-0 left-[48%] -translate-x-1/2 bg-card/70 backdrop-blur-md/95 backdrop-blur-md rounded-2xl p-3 border border-glass-border shadow-[0_6px_20px_rgba(0,0,0,0.08)] z-10 w-44 text-xs animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">Wednesday, 7 Jan 2025</div>
                  <div className="space-y-1 font-medium">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-xs bg-[#facc15]" />
                        <span className="text-muted-foreground">Savings</span>
                      </div>
                      <span className="font-bold text-foreground">{formatAmount(240)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-xs bg-[#84cc16]" />
                        <span className="text-muted-foreground">Income</span>
                      </div>
                      <span className="font-bold text-foreground">{formatAmount(700)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-xs bg-[#fb923c]" />
                        <span className="text-muted-foreground">Expenses</span>
                      </div>
                      <span className="font-bold text-foreground">{formatAmount(460)}</span>
                    </div>
                  </div>
                </div>

                {/* Y-Axis guide lines */}
                <div className="absolute inset-x-0 bottom-8 flex flex-col justify-between h-40 pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-border w-full flex items-center justify-between text-[10px] text-muted-foreground/60">
                    <span>30</span>
                  </div>
                  <div className="border-b border-dashed border-border w-full flex items-center justify-between text-[10px] text-muted-foreground/60">
                    <span>20</span>
                  </div>
                  <div className="border-b border-dashed border-border w-full flex items-center justify-between text-[10px] text-muted-foreground/60">
                    <span>10</span>
                  </div>
                  <div className="border-b border-border w-full flex items-center justify-between text-[10px] text-muted-foreground/60">
                    <span>0</span>
                  </div>
                </div>

                {/* Bar Columns */}
                <div className="grid grid-cols-7 gap-3 h-44 items-end px-4">
                  {days.map((item) => {
                    const isSelected = item.day === selectedDay;
                    return (
                      <div 
                        key={item.day}
                        onClick={() => setSelectedDay(item.day)}
                        className="flex flex-col items-center gap-2 cursor-pointer group h-full justify-end"
                      >
                        {/* Column Track */}
                        <div className="w-10 rounded-2xl bg-background overflow-hidden flex flex-col justify-end p-1 transition-all duration-300 group-hover:bg-muted/80">
                          {isSelected ? (
                            /* Highlighted Multi-Segment Bar for Wednesday */
                            <div className="w-full flex flex-col gap-0.5">
                              {/* Top Yellow Segment */}
                              <div className="h-6 w-full rounded-md bg-[#facc15] shadow-xs" />
                              {/* Middle Lime Textured Segment */}
                              <div className="h-20 w-full rounded-md bg-[#84cc16] bg-diagonal-stripes shadow-xs" />
                              {/* Bottom Orange Segment */}
                              <div className="h-10 w-full rounded-md bg-[#fb923c] shadow-xs" />
                            </div>
                          ) : (
                            /* Muted Neutral Bars */
                            <div className="w-full flex flex-col gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              <div className="h-3 w-full rounded-md bg-border" />
                              <div 
                                className="w-full rounded-md bg-border/80" 
                                style={{ height: `${Math.min(100, Math.max(24, (item.income / 8)))}px` }}
                              />
                            </div>
                          )}
                        </div>
                        {/* Day Label */}
                        <span className={`text-[11px] font-semibold transition-colors ${isSelected ? "text-foreground font-bold" : "text-muted-foreground group-hover:text-muted-foreground"}`}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stat Stack (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3">
              {/* Card 1: Total income */}
              <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex-1 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground font-medium">Total income</span>
                <div className="text-2xl font-black text-foreground mt-1">
                  {formatAmount(15000)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>5.1% from last month</span>
                </div>
              </div>

              {/* Card 2: Total expenses */}
              <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex-1 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground font-medium">Total expenses</span>
                <div className="text-2xl font-black text-foreground mt-1">
                  {formatAmount(6700)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#fb923c] mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>15.5% from last month</span>
                </div>
              </div>

              {/* Card 3: Saved balance */}
              <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex-1 flex flex-col justify-center">
                <span className="text-xs text-muted-foreground font-medium">Saved balance</span>
                <div className="text-2xl font-black text-foreground mt-1">
                  {formatAmount(8300)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>20.7% from last month</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Monthly Spending Limit + Quick Tips Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Monthly spending limit Card */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Monthly spending limit</h3>
                  <button onClick={() => alert('Coming soon!')} className="text-muted-foreground hover:text-foreground/80 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Recipient accounts & working capital</p>
              </div>

              {/* Segmented Lime Progress Bar */}
              <div className="my-5">
                <div className="h-6 w-full rounded-xl bg-background overflow-hidden flex items-center p-1">
                  <div className="h-full w-[86%] rounded-lg bg-[#84cc16] bg-diagonal-stripes flex items-center justify-end pr-2 transition-all duration-500 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-card/70 backdrop-blur-md animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-foreground mt-2">
                  <span>{formatAmount(8600)}</span>
                  <span className="text-muted-foreground font-normal">{formatAmount(10000)}</span>
                </div>
              </div>
            </div>

            {/* Quick Tips / AI Advisor Banner */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow flex items-center justify-between overflow-hidden relative group cursor-pointer">
              <div className="flex-1 pr-4 z-10">
                <h3 className="text-sm font-bold text-foreground leading-snug">
                  Optimize your budget with these quick tips
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                  Start preparing for the 2025 tax season by saving 10–15% for MSME deductions.
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-foreground group-hover:text-lime-600 transition-colors">
                  <span>Read more</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 3D Geometric Blocks Graphic (Right) */}
              <div className="w-24 h-24 relative flex items-end justify-end">
                <div className="grid grid-cols-3 gap-1.5 rotate-[-12deg] group-hover:scale-105 transition-transform">
                  <div className="w-5 h-5 rounded-md bg-[#84cc16] bg-diagonal-stripes" />
                  <div className="w-5 h-5 rounded-md bg-lime-300" />
                  <div className="w-5 h-5 rounded-md bg-[#84cc16]" />
                  <div className="w-5 h-5 rounded-md bg-lime-200" />
                  <div className="w-5 h-5 rounded-md bg-[#84cc16] bg-diagonal-stripes" />
                  <div className="w-5 h-5 rounded-md bg-lime-400" />
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Bottom 3 Columns (Cost Analysis, Financial Health, Goal Tracker) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Cost Analysis */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Cost analysis</h3>
                  <button onClick={() => alert('Coming soon!')} className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded-lg border border-glass-border">
                    <span>January</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">Spending overview</p>
                <div className="text-2xl font-black text-foreground mt-2">
                  {formatAmount(8450)}
                </div>
              </div>

              {/* Segmented Horizontal Bar */}
              <div className="my-3">
                <div className="h-3 w-full rounded-full bg-muted/80 overflow-hidden flex gap-0.5">
                  <div className="w-[18%] bg-[#fb923c] rounded-l-full" />
                  <div className="w-[7%] bg-[#facc15]" />
                  <div className="w-[6%] bg-lime-400" />
                  <div className="w-[9%] bg-[#84cc16]" />
                  <div className="w-[10%] bg-emerald-500" />
                  <div className="w-[17%] bg-lime-600" />
                  <div className="w-[33%] bg-border rounded-r-full" />
                </div>
              </div>

              {/* Category Breakdown List */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-[#fb923c]" />
                    <span className="text-muted-foreground">Housing</span>
                  </div>
                  <span className="font-bold text-foreground">18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-[#facc15]" />
                    <span className="text-muted-foreground">Debt payments</span>
                  </div>
                  <span className="font-bold text-foreground">7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-lime-400" />
                    <span className="text-muted-foreground">Food</span>
                  </div>
                  <span className="font-bold text-foreground">6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-[#84cc16]" />
                    <span className="text-muted-foreground">Transportation</span>
                  </div>
                  <span className="font-bold text-foreground">9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-emerald-500" />
                    <span className="text-muted-foreground">Healthcare</span>
                  </div>
                  <span className="font-bold text-foreground">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-lime-600" />
                    <span className="text-muted-foreground">Investments</span>
                  </div>
                  <span className="font-bold text-foreground">17%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-gray-300" />
                    <span className="text-muted-foreground">Other</span>
                  </div>
                  <span className="font-bold text-foreground">33%</span>
                </div>
              </div>
            </div>

            {/* Card 2: Financial Health (Gauge) */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Financial health</h3>
                  <button onClick={() => alert('Coming soon!')} className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded-lg border border-glass-border">
                    <span>30d</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">Current status</p>
                <div className="text-2xl font-black text-foreground mt-2">
                  {formatAmount(15780)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>17.5% from last month</span>
                </div>
              </div>

              {/* Radial Half-Circle Donut Gauge */}
              <div className="relative flex flex-col items-center justify-center my-4">
                <svg className="w-36 h-20 overflow-visible" viewBox="0 0 100 50">
                  {/* Background Track */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Filled Lime Segment (75%) */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 78 22"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="125"
                    strokeDashoffset="0"
                  />
                </svg>
                {/* Center Percentage */}
                <div className="absolute bottom-0 text-center">
                  <span className="text-2xl font-black text-foreground">75%</span>
                  <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">Of monthly income saved</p>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                Based on aggregated transaction metrics over the past 30 days
              </p>
            </div>

            {/* Card 3: Goal Tracker */}
            <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Goal tracker</h3>
                  <button onClick={() => alert('Coming soon!')} className="flex items-center gap-1 text-xs font-semibold text-foreground hover:text-foreground">
                    <Plus className="w-3 h-3" />
                    <span>Add goals</span>
                  </button>
                </div>
              </div>

              {/* Goal List */}
              <div className="space-y-3.5 my-2">
                {/* This year Section */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">This year</span>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-sm font-bold shadow-xs">
                      💰
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">Reserve</span>
                        <span className="text-muted-foreground font-medium">{formatAmount(7000)} / {formatAmount(10000)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/80 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#84cc16] rounded-full w-[70%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Left to save 4 months</span>
                    </div>
                  </div>
                </div>

                {/* Long term Section */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Long term</span>
                  
                  {/* Travel */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 text-sm shadow-xs">
                      🧳
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">Travel</span>
                        <span className="text-muted-foreground font-medium">{formatAmount(2500)} / {formatAmount(4000)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/80 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#fb923c] rounded-full w-[62%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Left to save 3 months</span>
                    </div>
                  </div>

                  {/* Car */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-muted/80 flex items-center justify-center text-foreground/80 text-sm shadow-xs">
                      🚗
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">Car</span>
                        <span className="text-muted-foreground font-medium">{formatAmount(1600)} / {formatAmount(20000)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/80 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#fb923c] rounded-full w-[8%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Left to save 3 years 6 months</span>
                    </div>
                  </div>

                  {/* Real estate */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-lime-50 flex items-center justify-center text-lime-700 text-sm shadow-xs">
                      🏢
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">Real estate</span>
                        <span className="text-muted-foreground font-medium">{formatAmount(8300)} / {formatAmount(70000)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/80 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#84cc16] rounded-full w-[12%]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Left to save 5 years 8 months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT SIDEBAR PANEL (xl:col-span-4) */}
        {/* ========================================================================= */}
        <div className="xl:col-span-4 space-y-5">
          
          {/* My Card Widget */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-foreground">My card</h3>
              <button onClick={() => alert('Coming soon!')} className="flex items-center gap-1 text-xs font-semibold text-foreground hover:text-foreground">
                <Plus className="w-3.5 h-3.5" />
                <span>Add card</span>
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">Quick actions</p>

            {/* Debit Card Graphic with Secondary Card behind */}
            <div className="relative pt-2 pb-4">
              {/* Secondary Card (Behind) */}
              <div className="absolute top-0 right-1 w-[88%] h-44 rounded-2xl bg-muted/80 border border-glass-border p-4 transform translate-y-0 shadow-xs z-0 opacity-70 flex justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Credit card</span>
                <span className="text-[10px] font-mono text-muted-foreground">•••• 4210</span>
              </div>

              {/* Primary Lime-Green Card */}
              <div className="relative z-10 w-full h-44 rounded-2xl bg-[#84cc16] text-white p-5 shadow-[0_12px_28px_rgba(132,204,22,0.3)] flex flex-col justify-between overflow-hidden">
                {/* Background decorative waves */}
                <div className="absolute inset-0 bg-diagonal-stripes opacity-15 pointer-events-none" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-semibold tracking-wide text-white/90">Debit card</span>
                  <span className="text-sm font-black tracking-wider uppercase">VISA</span>
                </div>

                {/* EMV Chip */}
                <div className="w-9 h-7 rounded-md bg-amber-200/90 border border-amber-300/60 flex items-center justify-center shadow-xs z-10">
                  <div className="w-6 h-4 border border-amber-600/30 rounded-xs" />
                </div>

                <div className="z-10">
                  <div className="text-lg font-mono font-bold tracking-widest text-white drop-shadow-xs">
                    •••• •••• •••• 7890
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-white/90 mt-2">
                    <span className="font-semibold">Michael Johnson</span>
                    <span className="text-[11px] font-mono">03/30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Row of 5 square buttons) */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              <button onClick={() => alert('Coming soon!')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Top up</span>
              </button>
              <button onClick={() => alert('Coming soon!')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <ArrowUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Send</span>
              </button>
              <button onClick={() => alert('Coming soon!')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <ArrowDown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Request</span>
              </button>
              <button onClick={() => alert('Coming soon!')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <History className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">History</span>
              </button>
              <button onClick={() => alert('Coming soon!')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-muted border border-glass-border hover:bg-muted/80 text-foreground/80 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-card/70 backdrop-blur-md border border-border flex items-center justify-center text-foreground shadow-2xs">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">More</span>
              </button>
            </div>
          </div>

          {/* Quick Payment (Avatars Row) */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Quick payment</h3>
              <button onClick={() => alert('Coming soon!')} className="text-muted-foreground hover:text-muted-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
              {[
                { name: "Davis", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
                { name: "Elli", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" },
                { name: "Leo", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" },
                { name: "Amanda", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80" },
                { name: "Ann", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80" },
                { name: "Sin", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=80" },
              ].map((user) => (
                <div key={user.name} className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-lime-500 transition-all shadow-xs">
                    <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {user.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Transaction history</h3>
              <button onClick={() => alert('Coming soon!')} className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded-lg border border-glass-border">
                <span>7d</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground py-2 border-b border-glass-border">
              <div className="flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" />
                <span>Name</span>
              </div>
              <span>Amount</span>
            </div>

            {/* List */}
            <div className="space-y-3 mt-3">
              {[
                { 
                  name: "Dividend payout", 
                  date: "25 Feb 2025", 
                  amount: 1100, 
                  isPositive: true, 
                  status: "Completed", 
                  icon: "🏦", 
                  bg: "bg-emerald-50 text-emerald-600" 
                },
                { 
                  name: "Corporate subscriptions", 
                  date: "25 Feb 2025", 
                  amount: 6400, 
                  isPositive: false, 
                  status: "Declined", 
                  icon: "☁️", 
                  bg: "bg-blue-50 text-blue-600" 
                },
                { 
                  name: "Investment in ETF", 
                  date: "21 Feb 2025", 
                  amount: 900, 
                  isPositive: false, 
                  status: "Completed", 
                  icon: "📊", 
                  bg: "bg-muted/80 text-foreground" 
                },
                { 
                  name: "Consulting services", 
                  date: "20 Feb 2025", 
                  amount: 2100, 
                  isPositive: false, 
                  status: "Completed", 
                  icon: "💼", 
                  bg: "bg-amber-50 text-amber-700" 
                },
                { 
                  name: "Equipment purchase", 
                  date: "20 Feb 2025", 
                  amount: 1700, 
                  isPositive: false, 
                  status: "Completed", 
                  icon: "📦", 
                  bg: "bg-stone-100 text-stone-700" 
                },
                { 
                  name: "Elli Harper", 
                  date: "15 Feb 2025", 
                  amount: 600, 
                  isPositive: true, 
                  status: "Completed", 
                  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" 
                },
                { 
                  name: "Davis Rowen", 
                  date: "15 Feb 2025", 
                  amount: 800, 
                  isPositive: true, 
                  status: "Completed", 
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" 
                },
              ].map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    {tx.img ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={tx.img} alt={tx.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${tx.bg}`}>
                        {tx.icon}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-lime-600 transition-colors">
                        {tx.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold ${tx.isPositive ? "text-foreground" : "text-foreground"}`}>
                      {tx.isPositive ? `+${formatAmount(tx.amount)}` : `-${formatAmount(tx.amount)}`}
                    </span>
                    <p className={`text-[10px] font-semibold ${tx.status === "Declined" ? "text-rose-500" : "text-muted-foreground"}`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
