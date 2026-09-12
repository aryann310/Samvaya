import { Router } from 'express';
import * as ctrl from '../controllers/cashflow.controller.js';
const router = Router();
router.get('/:businessId', ctrl.getCashFlow);
export default router;
//# sourceMappingURL=cashflow.routes.js.map