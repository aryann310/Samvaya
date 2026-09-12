import { useEffect, useState } from "react";
import { getFinancesData } from "../api";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Finances() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getFinancesData().then(setData).catch(console.error);
  }, []);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-lime-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Finances & Budgeting</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Cash flow management, profit margins, and operating expenses.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-card/70 backdrop-blur-md border border-glass-border rounded-xl text-xs font-semibold text-foreground/80 shadow-xs hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow">
          <span className="text-xs text-muted-foreground font-medium">Total Revenue</span>
          <div className="text-2xl font-black text-foreground mt-1">
            {formatCurrency(data.revenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow">
          <span className="text-xs text-muted-foreground font-medium">Total Expenses</span>
          <div className="text-2xl font-black text-foreground mt-1">
            {formatCurrency(data.expenses)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#fb923c] mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-3.5% vs budget target</span>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow">
          <span className="text-xs text-muted-foreground font-medium">Net Profit Margin</span>
          <div className="text-2xl font-black text-foreground mt-1">
            {data.profitMargin}%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-lime-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Top 10% in agri-MSME</span>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-5 border border-glass-border shadow-glass-shadow">
          <span className="text-xs text-muted-foreground font-medium">Outstanding Credit / Debt</span>
          <div className="text-2xl font-black text-foreground mt-1">
            {formatCurrency(data.debt)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Low debt-to-income ratio (0.18)
          </div>
        </div>
      </div>

      {/* Cash Flow Chart Card */}
      <div className="bg-card/70 backdrop-blur-md rounded-3xl p-6 border border-glass-border shadow-glass-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Monthly Cash Inflow vs Outflow</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Historical comparison of operating receipts against disbursement</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 text-xs font-medium mr-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#84cc16]" />
                <span className="text-muted-foreground">Money In</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#fb923c]" />
                <span className="text-muted-foreground">Money Out</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.cashFlow}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                tickFormatter={(val) => `₹${val/1000}k`} 
              />
              <Tooltip 
                cursor={{ fill: '#f4f5f8' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid #f3f4f6', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              />
              <Bar dataKey="in" name="Money In" fill="#84cc16" radius={[8, 8, 0, 0]} maxBarSize={36} />
              <Bar dataKey="out" name="Money Out" fill="#fb923c" radius={[8, 8, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
