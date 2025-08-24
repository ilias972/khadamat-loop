import { Router } from 'express';
import { getAuditSummary } from '../controllers/auditSummaryController';

const router = Router();
router.get('/summary', getAuditSummary);
export default router;
