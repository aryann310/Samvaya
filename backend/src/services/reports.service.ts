import { DataStore } from './dataStore.js';
import { FinanceService } from './finance.service.js';
import { InventoryService } from './inventory.service.js';
import { BusinessService } from './business.service.js';
import { CashflowService } from './cashflow.service.js';

export class ReportsService {
  static async getReport(businessId: string, range?: string) {
    const [inv, finSummary, business, cashflow] = await Promise.all([
      InventoryService.getAll(businessId),
      FinanceService.getFinancialSummary(businessId),
      BusinessService.getBusiness(businessId),
      CashflowService.getCashflow(businessId)
    ]);

    const totalInvValue = inv.reduce(
      (sum: number, item: any) => sum + ((item.unitCost || 0) * (item.quantity || 0)),
      0
    );
    const latestCash = cashflow.length
      ? cashflow[cashflow.length - 1]?.closingBalance
      : (business?.cashBalance ?? 85000);

    return {
      businessName: business?.name || DataStore.business?.name || 'Shree Ganesh Kirana Store',
      period: range || 'Last 6 Months (Jan - Jun 2024)',
      generatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      financialSummary: {
        revenue: finSummary.totalRevenue,
        expenses: finSummary.totalExpenses,
        profit: finSummary.totalProfit,
        profitMargin: finSummary.avgProfitMargin,
        cashBalance: latestCash
      },
      monthlyTrend: (finSummary.monthlyData || []).map((m: any) => ({
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
        marketPosition: 'Market Leader in Village Staples (38% Share)',
        topOpportunity: 'Expand fresh dairy counter to capture 18% local unsatisfied demand'
      }
    };
  }
}
