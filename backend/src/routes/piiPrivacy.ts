import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { exportPII, deletePII } from '../controllers/piiPrivacyController';

const router = Router();

router.get('/export', authenticate, exportPII);
router.delete('/me', authenticate, deletePII);

export default router;
