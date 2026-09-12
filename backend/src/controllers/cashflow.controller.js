import { CashFlowService } from '../services/cashflow.service.js';
export const getCashFlow = (req, res) => {
    const data = CashFlowService.getCashFlow(req.params.businessId);
    res.json({ success: true, data });
};
//# sourceMappingURL=cashflow.controller.js.map