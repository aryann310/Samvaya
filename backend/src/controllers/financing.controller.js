import { FinancingService } from '../services/financing.service.js';
export const getFinancing = (req, res) => {
    const data = FinancingService.getFinancingData(req.params.businessId);
    res.json({ success: true, data });
};
export const applyLoan = (req, res) => {
    res.json({ success: true, data: { status: 'applied', productId: req.params.productId } });
};
//# sourceMappingURL=financing.controller.js.map