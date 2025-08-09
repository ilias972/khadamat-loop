import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  listFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favoriteController';

const router = Router();

const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^[0-9]+$/).optional(),
    size: z.string().regex(/^[0-9]+$/).optional(),
  }),
});

const providerSchema = z.object({
  params: z.object({ providerId: z.string().regex(/^[0-9]+$/) }),
});

const createSchema = z.object({
  body: z.object({ providerId: z.number().int() }),
});

router.get('/', authenticate, validate(paginationSchema), listFavorites);
router.post('/', authenticate, validate(createSchema), addFavorite);
router.delete('/:providerId', authenticate, validate(providerSchema), removeFavorite);
router.get('/check/:providerId', authenticate, validate(providerSchema), checkFavorite);

export default router;
