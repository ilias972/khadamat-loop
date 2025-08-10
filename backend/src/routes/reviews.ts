import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middlewares/auth';
import { requireKycFor } from '../middlewares/kyc';
import { validate } from '../middlewares/validation';
import {
  createReview,
  listProviderReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';

const router = Router();

const createSchema = z.object({
  body: z.object({
    bookingId: z.number().int(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
  }),
});

const providerSchema = z.object({
  params: z.object({ providerId: z.string().regex(/^[0-9]+$/) }),
  query: z.object({
    page: z.string().regex(/^[0-9]+$/).optional(),
    size: z.string().regex(/^[0-9]+$/).optional(),
  }),
});

const idSchema = z.object({ params: z.object({ id: z.string().regex(/^[0-9]+$/) }) });

const updateSchema = z.object({
  params: idSchema.shape.params,
  body: z
    .object({
      rating: z.number().int().min(1).max(5).optional(),
      comment: z.string().max(1000).optional(),
    })
    .refine((data) => data.rating !== undefined || data.comment !== undefined, {
      message: 'At least one field must be provided',
    }),
});

router.post('/', authenticate, requireKycFor('BOTH'), validate(createSchema), createReview);
router.get('/provider/:providerId', validate(providerSchema), listProviderReviews);
router.put('/:id', authenticate, requireKycFor('BOTH'), validate(updateSchema), updateReview);
router.delete('/:id', authenticate, requireKycFor('BOTH'), validate(idSchema), deleteReview);

export default router;
