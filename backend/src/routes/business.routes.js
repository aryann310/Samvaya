import { Router } from 'express';
import * as ctrl from '../controllers/business.controller.js';
const router = Router();
router.get('/:id', ctrl.getBusiness);
router.put('/:id', ctrl.updateBusiness);
export default router;
//# sourceMappingURL=business.routes.js.map