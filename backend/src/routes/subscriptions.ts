import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import { requireKycFor } from '../middlewares/kyc';
import { createClubProSubscription, listMySubscriptions } from '../controllers/subscriptionController';

const router = Router();

router.post('/club-pro', authenticate, requireRole('provider'), requireKycFor('BOTH'), createClubProSubscription);
router.get('/', authenticate, listMySubscriptions);

export default router;
