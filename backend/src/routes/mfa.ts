import { Router } from 'express';
import { z } from 'zod';
import { startSetup, verifySetup, disableMfa } from '../controllers/mfaController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { mfaLimiter } from '../middlewares/rateLimit';

const router = Router();

const verifySchema = z.object({
  body: z.object({ code: z.string() })
});

const disableSchema = z.object({
  body: z.object({
    password: z.string(),
    code: z.string().optional(),
    recoveryCode: z.string().optional(),
  }).refine((d) => d.code || d.recoveryCode, {
    message: 'code or recoveryCode required',
  }),
});

router.post('/setup/start', authenticate, mfaLimiter, startSetup);
router.post('/setup/verify', authenticate, mfaLimiter, validate(verifySchema), verifySetup);
router.post('/disable', authenticate, mfaLimiter, validate(disableSchema), disableMfa);

export default router;
