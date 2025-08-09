import express from 'express';
import rateLimit from 'express-rate-limit';
import { smsWebhook } from '../controllers/smsController';

const router = express.Router();
router.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({ windowMs: 60 * 1000, limit: 60 });
router.use(limiter);

router.post('/webhook', smsWebhook);
router.get('/webhook', smsWebhook);

export default router;
