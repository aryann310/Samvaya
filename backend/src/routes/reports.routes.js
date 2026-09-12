import { Router } from 'express';
import * as ctrl from '../controllers/reports.controller.js';
const router = Router();
router.get('/:businessId', ctrl.getReport);
export default router;
//# sourceMappingURL=reports.routes.js.map