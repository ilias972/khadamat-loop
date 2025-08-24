import { Router } from 'express';
import { getAuditSummary } from '../controllers/auditSummaryController';
import { getAuditPostfix } from '../controllers/auditPostfixController';

const router = Router();
router.get('/summary', getAuditSummary);
router.get('/postfix', getAuditPostfix);
export default router;
