import { Router } from 'express';
import businessRoutes from './business.routes';
import dashboardRoutes from './dashboard.routes';
import financeRoutes from './finance.routes';
import cashflowRoutes from './cashflow.routes';
import inventoryRoutes from './inventory.routes';
import hyperlocalRoutes from './hyperlocal.routes';
import aiRoutes from './ai.routes';
import financingRoutes from './financing.routes';
import schemesRoutes from './schemes.routes';
import reportsRoutes from './reports.routes';

const router = Router();

router.use('/business', businessRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/finance', financeRoutes);
router.use('/cashflow', cashflowRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/hyperlocal', hyperlocalRoutes);
router.use('/ai', aiRoutes);
router.use('/financing', financingRoutes);
router.use('/schemes', schemesRoutes);
router.use('/reports', reportsRoutes);

export default router;
