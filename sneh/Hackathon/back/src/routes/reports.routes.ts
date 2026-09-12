import { Router } from 'express';
import * as ctrl from '../controllers/reports.controller';
const router = Router();
router.get('/:businessId', ctrl.getReport);
export default router;
