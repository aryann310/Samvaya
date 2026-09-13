import { Router } from 'express';
import * as ctrl from '../controllers/hyperlocal.controller.js';
const router = Router();
router.get('/summary', ctrl.getHyperlocal);
router.get('/:businessId', ctrl.getHyperlocal);
export default router;
