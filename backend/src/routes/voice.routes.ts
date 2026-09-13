import { Router } from 'express';
import { getVoiceToken } from '../controllers/voice.controller.js';

const router = Router();

router.get('/token', getVoiceToken);

export default router;
