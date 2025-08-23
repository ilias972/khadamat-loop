import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import { requireKycFor } from '../middlewares/kyc';
import { validate } from '../middlewares/validation';
import { z } from 'zod';
import {
  createClubProSubscription,
  listMySubscriptions,
  getMySubscriptionStatus,
  updateAutoRenew,
} from '../controllers/subscriptionController';

const router = Router();

router.post('/club-pro', authenticate, requireRole('provider'), requireKycFor('BOTH'), createClubProSubscription);
router.get('/', authenticate, listMySubscriptions);
router.get('/me', authenticate, requireRole('provider'), getMySubscriptionStatus);

const autoRenewSchema = z.object({ body: z.object({ autoRenew: z.boolean() }) });
router.put('/auto-renew', authenticate, requireRole('provider'), validate(autoRenewSchema), updateAutoRenew);

export default router;
