export declare class CashFlowService {
    static getCashFlow(businessId: string): {
        entries: any;
        forecast: {
            projectedBalance: any;
            month: string;
            projectedInflow: number;
            projectedOutflow: number;
            projectedNetFlow: number;
        }[];
        alerts: {
            id: string;
            type: "info";
            month: string;
            message: string;
        }[];
        currentBalance: any;
    };
}
//# sourceMappingURL=cashflow.service.d.ts.map