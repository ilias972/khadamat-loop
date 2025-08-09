import { Router } from 'express';
import { createKycSession, getKycStatus } from '../controllers/kycController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/session', authenticate, createKycSession);
router.get('/status', authenticate, getKycStatus);

export default router;
