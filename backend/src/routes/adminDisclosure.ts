import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import { requireMfa } from '../middlewares/requireMfa';
import { ipAllowlist } from '../middlewares/exportGuard';
import rateLimit from 'express-rate-limit';
import { createDisclosure, approveDisclosure } from '../controllers/disclosureController';
import { exportUserEvidence } from '../controllers/legalExportController';

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: Number(process.env.KYC_EXPORT_RATE_LIMIT?.split(':')[0] || 5) });

router.use(authenticate, requireRole('admin'), requireMfa, ipAllowlist, limiter);

router.post('/disclosures', createDisclosure);
router.put('/disclosures/:id/approve', approveDisclosure);
router.get('/export/:userId', exportUserEvidence); // ?requestId=<id>

export default router;
