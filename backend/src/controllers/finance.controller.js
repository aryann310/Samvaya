import { FinanceService } from '../services/finance.service.js';
export const getFinancialSummary = (req, res) => {
    const data = FinanceService.getFinancialSummary(req.params.businessId);
    res.json({ success: true, data });
};
export const calculateLoanAffordability = (req, res) => {
    const principal = Number(req.body.principal || req.body.loanAmount || 100000);
    const rate = Number(req.body.rate || req.body.interestRate || 10.5);
    const years = Number(req.body.years || (req.body.tenureMonths ? req.body.tenureMonths / 12 : 3));
    const data = FinanceService.calculateLoanAffordability({ principal, rate, years });
    // Add camelCase aliases for frontend compatibility
    const responseData = {
        ...data,
        totalPayment: data.totalAmount,
        affordable: data.isAffordable,
        dtiRatio: data.dti,
        amortizationSchedule: data.schedule,
    };
    res.json({ success: true, data: responseData });
};
//# sourceMappingURL=finance.controller.js.map