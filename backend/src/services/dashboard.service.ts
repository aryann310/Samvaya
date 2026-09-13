import { DataStore } from './dataStore.js';
import { FinanceService } from './finance.service.js';
import { CashflowService } from './cashflow.service.js';
import { calculateHealthScore } from '../utils/healthScore.js';

export class DashboardService {
  static async getDashboard(businessId: string): Promise<any> {
    // Fetch from DB or DataStore depending on mode
    const [financialSummary, cashflowSummary] = await Promise.all([
      FinanceService.getFinancialSummary(businessId),
      CashflowService.getCashflowSummary(businessId)
    ]);

    const monthlyData = financialSummary.monthlyData || [];
    const recent = monthlyData.slice(-2);

    const margin = recent[recent.length - 1]?.profitMargin || 19.44;
    const health = calculateHealthScore(margin, 4, 15, 'medium', 3);

    const latestRev = recent[recent.length - 1]?.revenue || 180000;
    const prevRev = recent[0]?.revenue || 170000;
    const revTrend = prevRev ? Math.round(((latestRev - prevRev) / prevRev) * 100) : 5;

    const latestExp = recent[recent.length - 1]?.expenses || 145000;
    const prevExp = recent[0]?.expenses || 140000;
    const expTrend = prevExp ? Math.round(((latestExp - prevExp) / prevExp) * 100) : 3;

    const latestProfit = recent[recent.length - 1]?.profit || 35000;
    const prevProfit = recent[0]?.profit || 30000;
    const profitTrend = prevProfit ? Math.round(((latestProfit - prevProfit) / prevProfit) * 100) : 16;

    // Cash from cashflow summary entries
    const cashEntries = cashflowSummary.entries || [];
    const latestCash = cashEntries.length
      ? cashEntries[cashEntries.length - 1]?.closingBalance
      : 85000;

    // Prefer summary monthly series (works in both demo and mongodb modes)
    const allFinancials = monthlyData.length ? monthlyData : [];

    return {
      healthScore: {
        score: health.score,
        explanation: health.explanation,
        factors: [
          { name: 'Profit Margin', score: 80, weight: 0.25 },
          { name: 'Cash Runway', score: 70, weight: 0.20 },
          { name: 'Debt to Income', score: 80, weight: 0.20 },
          { name: 'Inventory Turnover', score: 60, weight: 0.15 },
          { name: 'Revenue Growth', score: 80, weight: 0.20 }
        ]
      },
      stats: {
        revenue: { value: latestRev, trend: revTrend, data: allFinancials.map((f: any) => f.revenue ?? 0) },
        expenses: { value: latestExp, trend: expTrend, data: allFinancials.map((f: any) => f.expenses ?? 0) },
        profit: { value: latestProfit, trend: profitTrend, data: allFinancials.map((f: any) => f.profit || 0) },
        cash: { value: latestCash, trend: 8, data: cashEntries.map((e: any) => e.closingBalance || 0) }
      },
      insights: DataStore.insights || [],
      priorities: DataStore.priorities || [],
      marketPulse: {
        competitors: 5,
        avgDemandGrowth: 12,
        topCategory: 'Dairy & Fresh Staples',
        summary: 'Steady demand growth in staples with moderate competitor density in Modhera.'
      },
      cashFlowChart: cashEntries.map((e: any) => {
        let label = e.month;
        try {
          const d = new Date(e.month.includes('-') ? e.month + '-01' : e.month);
          if (!isNaN(d.getTime())) {
            label = d.toLocaleString('en-US', { month: 'short' });
          }
        } catch (_) {}
        return { month: label, rawMonth: e.month, inflow: e.inflow || 0, outflow: e.outflow || 0 };
      }),
      opportunities: [
        { id: 'opp-1', title: 'Diwali Festive Stocking', description: 'High seasonal surge expected in cooking oils, premium sweets, and gift snacks.', impact: '+₹15,000 extra profit', category: 'Seasonal Demand' },
        { id: 'opp-2', title: 'Dairy Chiller Addition', description: 'Local demand for fresh milk pouches & butter rising by 18% month-over-month.', impact: '+₹8,500/month', category: 'Product Expansion' },
        { id: 'opp-3', title: 'Wholesale Mandi Bulk Order', description: 'Combine grain orders with Mehsana market to save 6% on procurement costs.', impact: 'Save ₹4,200/month', category: 'Procurement Savings' }
      ]
    };
  }
}
