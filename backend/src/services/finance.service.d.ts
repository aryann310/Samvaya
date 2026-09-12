export declare class FinanceService {
    static getFinancialSummary(businessId: string): {
        totalRevenue: number;
        totalExpenses: number;
        totalProfit: number;
        avgProfitMargin: number;
        revenueTrend: number;
        debtToIncome: number;
        financingReadinessScore: number;
        monthlyData: any;
        revenueByCategory: {
            category: string;
            amount: number;
        }[];
        expenseByCategory: {
            category: string;
            amount: number;
        }[];
    };
    static calculateLoanAffordability(params: {
        principal: number;
        rate: number;
        years: number;
    }): {
        emi: number;
        totalInterest: number;
        totalAmount: number;
        schedule: import("../models/index.js").AmortizationEntry[];
        dti: number;
        isAffordable: boolean;
    };
}
//# sourceMappingURL=finance.service.d.ts.map