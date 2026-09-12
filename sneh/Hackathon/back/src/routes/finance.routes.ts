import { Router } from 'express';
import * as ctrl from '../controllers/finance.controller';
const router = Router();
router.get('/:businessId', ctrl.getFinancialSummary);
router.post('/loan-affordability', ctrl.calculateLoanAffordability);
export default router;
