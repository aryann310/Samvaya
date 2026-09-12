export declare class ReportsService {
    static getReport(businessId: string, range?: string): {
        businessName: any;
        period: string;
        generatedAt: string;
        financialSummary: {
            revenue: number;
            expenses: number;
            profit: number;
            profitMargin: number;
            cashBalance: number;
        };
        monthlyTrend: any;
        topInsights: any;
        inventorySummary: {
            totalItems: any;
            lowStockItems: any;
            totalValue: any;
        };
        hyperlocalSummary: {
            competitorCount: any;
            marketPosition: string;
            topOpportunity: string;
        };
    };
}
//# sourceMappingURL=reports.service.d.ts.map