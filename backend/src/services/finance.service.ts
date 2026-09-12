import { DataStore } from './dataStore.js';
import { calculateEMI, generateAmortizationSchedule } from '../utils/emi.js';

export class FinanceService {
  static getFinancialSummary(businessId: string) {
    let totalRev = 0, totalExp = 0, totalProfit = 0;
    const revCategoryMap: Record<string, number> = {};
    const expCategoryMap: Record<string, number> = {};

    const monthlyData = DataStore.financials.map((f: any) => {
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

    return {
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      totalProfit: totalProfit,
      avgProfitMargin: totalRev ? Number(((totalProfit / totalRev) * 100).toFixed(2)) : 0,
      revenueTrend: 5.4,
      debtToIncome: 14.2,
      financingReadinessScore: 78,
      monthlyData,
      revenueByCategory,
      expenseByCategory
    };
  }
  static calculateLoanAffordability(params: { principal: number, rate: number, years: number }) {
    const emi = calculateEMI(params.principal, params.rate, params.years);
    const schedule = generateAmortizationSchedule(params.principal, params.rate, params.years);
    const totalAmount = emi * params.years * 12;
    const totalInterest = totalAmount - params.principal;
    
    // simple DTI based on avg profit
    const avgProfit = this.getFinancialSummary('').totalProfit / 12;
    const dti = (emi / avgProfit) * 100;
    
    return { emi, totalInterest, totalAmount, schedule, dti, isAffordable: dti < 40 };
  }
}
