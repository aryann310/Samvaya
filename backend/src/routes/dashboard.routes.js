import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller.js';
const router = Router();
router.get('/:businessId', ctrl.getDashboard);
router.patch('/priorities/:id/complete', ctrl.completePriority);
export default router;
//# sourceMappingURL=dashboard.routes.js.map