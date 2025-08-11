import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middlewares/auth';
import { requireKycFor } from '../middlewares/kyc';
import { validate } from '../middlewares/validation';
import {
  listServices,
  listPopularServices,
  listServicesByCategory,
  createService,
  updateService,
  deleteService,
  getServiceCatalog,
  suggestServices,
} from '../controllers/serviceController';

const router = Router();

const listSchema = z.object({
  query: z.object({
    page: z.string().regex(/^[0-9]+$/).optional(),
    size: z.string().regex(/^[0-9]+$/).optional(),
    q: z.string().optional(),
    category: z.string().optional(),
  }),
});

const idSchema = z.object({
  params: z.object({ id: z.string().regex(/^[0-9]+$/) }),
});

const serviceBody = z.object({
  name: z.string().min(1).max(100),
  nameAr: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  descriptionAr: z.string().max(1000).optional(),
  category: z.string().min(1),
  icon: z.string().optional(),
  basePrice: z.number().int().min(0).optional(),
  isPopular: z.boolean().optional(),
});

const createSchema = z.object({ body: serviceBody });
const updateSchema = z.object({ params: idSchema.shape.params, body: serviceBody.partial() });

const catalogSchema = z.object({
  query: z.object({
    groupBy: z.string().optional(),
    locale: z.enum(['fr', 'ar']).optional(),
  }),
});

const suggestSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    limit: z.string().regex(/^[0-9]+$/).optional(),
    locale: z.enum(['fr', 'ar']).optional(),
  }),
});

router.get('/', validate(listSchema), listServices);
router.get('/popular', listPopularServices);
router.get('/category/:cat', validate(z.object({ params: z.object({ cat: z.string() }) })), listServicesByCategory);
router.get('/catalog', validate(catalogSchema), getServiceCatalog);
router.get('/suggest', validate(suggestSchema), suggestServices);
router.post('/', authenticate, requireRole('provider'), requireKycFor('BOTH'), validate(createSchema), createService);
router.put('/:id', authenticate, requireKycFor('BOTH'), validate(updateSchema), updateService);
router.delete('/:id', authenticate, requireKycFor('BOTH'), validate(idSchema), deleteService);

export default router;
