import { DataStore } from './dataStore';
import { calculateHealthScore } from '../utils/healthScore';

export class DashboardService {
  static getDashboard(businessId: string) {
    const financials = DataStore.financials;
    const recent = financials.slice(-2);
    
    const margin = recent[recent.length - 1]?.profitMargin || 19.44;
    const health = calculateHealthScore(margin, 4, 15, 'medium', 3);
    
    const latestRev = recent[recent.length - 1]?.revenue?.total || 180000;
    const prevRev = recent[0]?.revenue?.total || 170000;
    const revTrend = prevRev ? Math.round(((latestRev - prevRev) / prevRev) * 100) : 5;

    const latestExp = recent[recent.length - 1]?.expenses?.total || 145000;
    const prevExp = recent[0]?.expenses?.total || 140000;
    const expTrend = prevExp ? Math.round(((latestExp - prevExp) / prevExp) * 100) : 3;

    const latestProfit = recent[recent.length - 1]?.profit || 35000;
    const prevProfit = recent[0]?.profit || 30000;
    const profitTrend = prevProfit ? Math.round(((latestProfit - prevProfit) / prevProfit) * 100) : 16;

    const cashFlowEntries = DataStore.cashflow || [];
    const latestCash = cashFlowEntries[cashFlowEntries.length - 1]?.closingBalance || 85000;

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
        revenue: { value: latestRev, trend: revTrend, data: financials.map((f: any) => f.revenue?.total || 0) },
        expenses: { value: latestExp, trend: expTrend, data: financials.map((f: any) => f.expenses?.total || 0) },
        profit: { value: latestProfit, trend: profitTrend, data: financials.map((f: any) => f.profit || 0) },
        cash: { value: latestCash, trend: 8, data: [65000, 70000, 78000, latestCash] }
      },
      insights: DataStore.insights || [],
      priorities: DataStore.priorities || [],
      marketPulse: {
        competitors: (DataStore.competitors || []).length || 5,
        avgDemandGrowth: 12,
        topCategory: 'Dairy & Fresh Staples',
        summary: 'Steady demand growth in staples with moderate competitor density in Modhera.'
      },
      cashFlowChart: cashFlowEntries.map((c: any) => ({
        month: c.month,
        inflow: c.inflows?.total || 0,
        outflow: c.outflows?.total || 0
      })),
      opportunities: [
        {
          id: 'opp-1',
          title: 'Diwali Festive Stocking',
          description: 'High seasonal surge expected in cooking oils, premium sweets, and gift snacks.',
          impact: '+₹15,000 extra profit',
          category: 'Seasonal Demand'
        },
        {
          id: 'opp-2',
          title: 'Dairy Chiller Addition',
          description: 'Local demand for fresh milk pouches & butter rising by 18% month-over-month.',
          impact: '+₹8,500/month',
          category: 'Product Expansion'
        },
        {
          id: 'opp-3',
          title: 'Wholesale Mandi Bulk Order',
          description: 'Combine grain orders with Mehsana market to save 6% on procurement costs.',
          impact: 'Save ₹4,200/month',
          category: 'Procurement Savings'
        }
      ]
    };
  }
}
