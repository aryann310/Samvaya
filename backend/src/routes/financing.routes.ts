import { Router } from 'express';
import * as ctrl from '../controllers/financing.controller.js';
const router = Router();
router.get('/:businessId', ctrl.getFinancing);
router.post('/apply/:productId', ctrl.applyLoan);
export default router;
