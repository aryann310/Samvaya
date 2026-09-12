import { Router } from 'express';
import * as ctrl from '../controllers/schemes.controller.js';
const router = Router();
router.get('/', ctrl.getSchemes);
export default router;
//# sourceMappingURL=schemes.routes.js.map