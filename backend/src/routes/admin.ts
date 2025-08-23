import { Router } from 'express';
import { deleteReview, disableUser, listAuditLogs } from '../controllers/adminController';
import { listReviews, deleteReviewAdmin, restoreReviewAdmin, listMessages, hideMessage } from '../controllers/moderationController';

const router = Router();

router.delete('/reviews/:id', deleteReview);
router.get('/reviews', listReviews);
router.post('/reviews/:id/delete', deleteReviewAdmin);
router.post('/reviews/:id/restore', restoreReviewAdmin);
router.get('/messages', listMessages);
router.post('/messages/:id/hide', hideMessage);
router.put('/users/:id/disable', disableUser);
router.get('/audit', listAuditLogs);

export default router;
