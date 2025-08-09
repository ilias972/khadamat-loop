import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { upsertPII, getMyPII } from '../controllers/piiController';
import { validate } from '../middlewares/validation';
import { z } from 'zod';

const router = Router();

const piiSchema = z.object({
  legalName: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  currentAddress: z.string().optional(),
  addressCity: z.string().optional(),
  addressRegion: z.string().optional(),
  addressPostal: z.string().optional(),
});

router.put('/', authenticate, validate(z.object({ body: piiSchema })), upsertPII);
router.get('/me', authenticate, getMyPII);

export default router;
