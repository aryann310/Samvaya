import { Router } from 'express';
import * as ctrl from '../controllers/schemes.controller';
const router = Router();
router.get('/', ctrl.getSchemes);
export default router;
