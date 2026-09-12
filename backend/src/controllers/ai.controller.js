import { AIService } from '../services/ai.service.js';
export const getInsights = (req, res) => {
    const data = AIService.getInsights(req.params.businessId);
    res.json({ success: true, data });
};
export const getAdvisorResponse = (req, res) => {
    const { message, lang = 'en' } = req.body;
    const data = AIService.getAdvisorResponse(message, req.body.businessId, lang);
    res.json({ success: true, data });
};
//# sourceMappingURL=ai.controller.js.map