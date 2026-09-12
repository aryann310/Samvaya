import { HyperlocalService } from '../services/hyperlocal.service.js';
export const getHyperlocal = (req, res) => {
    const data = HyperlocalService.getHyperlocalData(req.params.businessId);
    res.json({ success: true, data });
};
//# sourceMappingURL=hyperlocal.controller.js.map