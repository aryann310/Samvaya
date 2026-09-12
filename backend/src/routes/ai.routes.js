import { Router } from 'express';
import * as ctrl from '../controllers/ai.controller.js';
const router = Router();
router.get('/insights/:businessId', ctrl.getInsights);
router.post('/advisor', ctrl.getAdvisorResponse);
export default router;
//# sourceMappingURL=ai.routes.js.map