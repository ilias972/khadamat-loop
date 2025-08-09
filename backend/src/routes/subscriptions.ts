import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import { createClubProSubscription, listMySubscriptions } from '../controllers/subscriptionController';

const router = Router();

router.post('/club-pro', authenticate, requireRole('provider'), createClubProSubscription);
router.get('/', authenticate, listMySubscriptions);

export default router;
