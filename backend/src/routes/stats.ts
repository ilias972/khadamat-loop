import { Router } from 'express';
import { adminStats, providerStats } from '../controllers/statsController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/admin', authenticate, requireRole('admin'), adminStats);
router.get('/provider/:providerUserId', authenticate, providerStats);

export default router;
