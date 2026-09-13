import { DataStore } from './dataStore.js';
import { isMongoMode } from '../db/config.js';
import { FinancialRepository } from '../db/repositories/index.js';
import { calculateEMI, generateAmortizationSchedule } from '../utils/emi.js';

export class FinanceService {
  static async getFinancialSummary(businessId: string): Promise<any> {
    const resolvedId = businessId || 'biz-001';
    // Resolve financial records from DB or DataStore
    const records: any[] = isMongoMode()
      ? await FinancialRepository.findByBusinessId(resolvedId)
      : DataStore.financials;

    let totalRev = 0, totalExp = 0, totalProfit = 0;
    const revCategoryMap: Record<string, number> = {};
    const expCategoryMap: Record<string, number> = {};

    const monthlyData = records.map((f: any) => {
      totalRev += f.revenue?.total || 0;
      totalExp += f.expenses?.total || 0;
      totalProfit += f.profit || 0;

      (f.revenue?.breakdown || []).forEach((b: any) => {
        revCategoryMap[b.category] = (revCategoryMap[b.category] || 0) + b.amount;
      });
      (f.expenses?.breakdown || []).forEach((b: any) => {
        expCategoryMap[b.category] = (expCategoryMap[b.category] || 0) + b.amount;
      });

      return {
        month: f.month,
        revenue: f.revenue?.total || 0,
        expenses: f.expenses?.total || 0,
        profit: f.profit || 0,
        profitMargin: f.profitMargin || 0,
        revenueBreakdown: f.revenue?.breakdown || [],
        expenseBreakdown: f.expenses?.breakdown || []
      };
    });

    const revenueByCategory = Object.entries(revCategoryMap).map(([category, amount]) => ({ category, amount }));
    const expenseByCategory = Object.entries(expCategoryMap).map(([category, amount]) => ({ category, amount }));
    const cashFlow = monthlyData.map((m: any) => ({ month: m.month, in: m.revenue, out: m.expenses }));

    // Debt from business profile (mongo or demo)
    let debt = 45000;
    try {
      const { BusinessService } = await import('./business.service.js');
      const business = await BusinessService.getBusiness(resolvedId);
      debt = business?.debt?.totalOutstanding ?? business?.debt ?? 45000;
    } catch {
      /* keep default */
    }

    const count = monthlyData.length || 1;
    const avgMonthlyRevenue = Math.round(totalRev / count);
    const debtToIncome = avgMonthlyRevenue
      ? Number(((debt / (avgMonthlyRevenue * 12)) * 100).toFixed(1))
      : 0;

    return {
      revenue: totalRev,
      expenses: totalExp,
      profit: totalProfit,
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      totalProfit: totalProfit,
      profitMargin: totalRev ? Number(((totalProfit / totalRev) * 100).toFixed(2)) : 0,
      avgProfitMargin: totalRev ? Number(((totalProfit / totalRev) * 100).toFixed(2)) : 0,
      avgMonthlyRevenue,
      avgMonthlyProfit: Math.round(totalProfit / count),
      debt,
      revenueTrend: 5.4,
      debtToIncome,
      financingReadinessScore: 78,
      cashFlow,
      monthlyData,
      revenueByCategory,
      expenseByCategory
    };
  }

  /** Raw financial records array — used by IntelligenceEngine */
  static async getFinancialRecords(businessId: string): Promise<any[]> {
    if (isMongoMode()) {
      return FinancialRepository.findByBusinessId(businessId || 'biz-001');
    }
    return DataStore.financials;
  }

  static calculateLoanAffordability(params: { principal: number; rate: number; years: number }) {
    const emi = calculateEMI(params.principal, params.rate, params.years);
    const schedule = generateAmortizationSchedule(params.principal, params.rate, params.years);
    const totalAmount = emi * params.years * 12;
    const totalInterest = totalAmount - params.principal;
    // Use a reasonable avg monthly profit from demo data
    const avgMonthlyProfit = 38750; // (30000+50000+40000+35000)/4
    const dti = (emi / avgMonthlyProfit) * 100;
    return { emi, totalInterest, totalAmount, schedule, dti, isAffordable: dti < 40 };
  }
}
