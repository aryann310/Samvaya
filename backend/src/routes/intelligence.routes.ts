import express from 'express';
import { getIntelligenceSummary } from '../controllers/intelligence.controller.js';

const router = express.Router();

router.get('/summary', getIntelligenceSummary);

export default router;
