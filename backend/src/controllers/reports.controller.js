import { ReportsService } from '../services/reports.service.js';
export const getReport = (req, res) => {
    const data = ReportsService.getReport(req.params.businessId, req.query.range);
    res.json({ success: true, data });
};
//# sourceMappingURL=reports.controller.js.map