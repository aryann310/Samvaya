import { Router } from 'express';
import { DigiLockerController } from '../controllers/digilocker.controller.js';

const router = Router();

// 1. POST /api/v2/digilocker/initiate - Start consent request
router.post('/initiate', DigiLockerController.initiate);

// 1b. GET /api/v2/digilocker/mock-consent - Local sandbox consent simulator
router.get('/mock-consent', DigiLockerController.mockConsent);

// 2. GET /api/v2/digilocker/callback - OAuth redirect handler (Web 302 or Mobile App Scheme)
router.get('/callback', DigiLockerController.callback);

// 3. GET /api/v2/digilocker/documents/:requestId - Server-to-server verified document retrieval
router.get('/documents/:requestId', DigiLockerController.getDocuments);

// 4. POST /api/v2/digilocker/revoke - OAuth token revocation
router.post('/revoke', DigiLockerController.revoke);

// 5. GET /api/v2/digilocker/status/:requestId - Query status of a specific verification request
router.get('/status/:requestId', DigiLockerController.getStatus);

// 6. GET /api/v2/digilocker/user/:userId - List verified documents for a business/user
router.get('/user/:userId', DigiLockerController.getUserVerifications);

export default router;
