import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import { requireKycFor } from '../middlewares/kyc';
import { paymentsLimiter } from '../middlewares/rateLimit';
import { createClubProCheckout } from '../controllers/paymentController';

const router = Router();

router.post('/club-pro', authenticate, requireRole('provider'), requireKycFor('BOTH'), paymentsLimiter, createClubProCheckout);

export default router;
