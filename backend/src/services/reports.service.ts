import { DataStore } from './dataStore.js';
import { FinanceService } from './finance.service.js';
import { InventoryService } from './inventory.service.js';
import { HyperlocalService } from './hyperlocal.service.js';

export class ReportsService {
  static getReport(businessId: string, range?: string) {
    const inv = InventoryService.getAll(businessId);
    const finSummary = FinanceService.getFinancialSummary(businessId);
    const totalInvValue = inv.reduce((sum: number, item: any) => sum + ((item.unitCost || 0) * (item.quantity || 0)), 0);

    return {
      businessName: DataStore.business?.name || "Patel General Store",
      period: range || "Last 6 Months (Jan - Jun 2024)",
      generatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      financialSummary: {
        revenue: finSummary.totalRevenue,
        expenses: finSummary.totalExpenses,
        profit: finSummary.totalProfit,
        profitMargin: finSummary.avgProfitMargin,
        cashBalance: 85000
      },
      monthlyTrend: finSummary.monthlyData.map((m: any) => ({
        month: m.month,
        revenue: m.revenue,
        expenses: m.expenses,
        profit: m.profit
      })),
      topInsights: DataStore.insights || [],
      inventorySummary: {
        totalItems: inv.length,
        lowStockItems: inv.filter((i: any) => i.status === 'low_stock').length,
        totalValue: totalInvValue
      },
      hyperlocalSummary: {
        competitorCount: (DataStore.competitors || []).length || 5,
        marketPosition: "Market Leader in Village Staples (38% Share)",
        topOpportunity: "Expand fresh dairy counter to capture 18% local unsatisfied demand"
      }
    };
  }
}
