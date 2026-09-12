import { BusinessService } from '../services/business.service.js';
export const getBusiness = (req, res) => {
    const data = BusinessService.getBusiness(req.params.id);
    if (!data)
        return res.status(404).json({ success: false, error: 'Business not found' });
    res.json({ success: true, data });
};
export const updateBusiness = (req, res) => {
    const data = BusinessService.updateBusiness(req.params.id, req.body);
    res.json({ success: true, data });
};
//# sourceMappingURL=business.controller.js.map