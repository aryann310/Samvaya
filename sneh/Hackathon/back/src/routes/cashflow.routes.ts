import { Router } from 'express';
import * as ctrl from '../controllers/cashflow.controller';
const router = Router();
router.get('/:businessId', ctrl.getCashFlow);
export default router;
