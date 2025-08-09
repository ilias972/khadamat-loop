import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  listProviders,
  getProvider,
  createProvider,
  updateProvider,
  listCategories,
} from '../controllers/providerController';

const router = Router();

const listSchema = z.object({
  query: z.object({
    page: z.string().regex(/^[0-9]+$/).optional(),
    size: z.string().regex(/^[0-9]+$/).optional(),
    q: z.string().optional(),
    category: z.string().optional(),
    sort: z.enum(['rating', 'recent']).optional(),
  }),
});

const idSchema = z.object({
  params: z.object({ id: z.string().regex(/^[0-9]+$/) }),
});

const providerBody = z.object({
  bio: z.string().min(1).max(500).optional(),
  specialties: z.string().optional(),
  experience: z.number().int().min(0).optional(),
  hourlyRate: z.number().int().min(0).optional(),
  isOnline: z.boolean().optional(),
});

const createSchema = z.object({ body: providerBody });
const updateSchema = z.object({ params: idSchema.shape.params, body: providerBody });

router.get('/', validate(listSchema), listProviders);
router.get('/categories', listCategories);
router.get('/:id', validate(idSchema), getProvider);
router.post('/', authenticate, requireRole('provider'), validate(createSchema), createProvider);
router.put('/:id', authenticate, validate(updateSchema), updateProvider);

export default router;
