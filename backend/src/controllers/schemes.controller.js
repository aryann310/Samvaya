import { SchemesService } from '../services/schemes.service.js';
export const getSchemes = (req, res) => {
    const data = SchemesService.getSchemes(req.query);
    res.json({ success: true, data });
};
//# sourceMappingURL=schemes.controller.js.map