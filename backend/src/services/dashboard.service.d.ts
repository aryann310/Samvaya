export declare class DashboardService {
    static getDashboard(businessId: string): {
        healthScore: {
            score: number;
            explanation: string;
            factors: {
                name: string;
                score: number;
                weight: number;
            }[];
        };
        stats: {
            revenue: {
                value: any;
                trend: number;
                data: any;
            };
            expenses: {
                value: any;
                trend: number;
                data: any;
            };
            profit: {
                value: any;
                trend: number;
                data: any;
            };
            cash: {
                value: any;
                trend: number;
                data: any[];
            };
        };
        insights: any;
        priorities: any;
        marketPulse: {
            competitors: any;
            avgDemandGrowth: number;
            topCategory: string;
            summary: string;
        };
        cashFlowChart: any;
        opportunities: {
            id: string;
            title: string;
            description: string;
            impact: string;
            category: string;
        }[];
    };
}
//# sourceMappingURL=dashboard.service.d.ts.map