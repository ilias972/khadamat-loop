import { Router } from 'express';
import { deleteReview, disableUser, listAuditLogs } from '../controllers/adminController';

const router = Router();

router.delete('/reviews/:id', deleteReview);
router.put('/users/:id/disable', disableUser);
router.get('/audit', listAuditLogs);

export default router;
