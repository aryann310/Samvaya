import { Router } from 'express';
import * as ctrl from '../controllers/hyperlocal.controller.js';
const router = Router();
router.get('/:businessId', ctrl.getHyperlocal);
export default router;
//# sourceMappingURL=hyperlocal.routes.js.map