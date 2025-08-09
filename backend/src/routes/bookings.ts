import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  createBooking,
  confirmBooking,
  proposeDay,
  acceptReschedule,
  rejectBooking,
  cancelBooking,
  listBookings,
  getBooking,
} from '../controllers/bookingController';

const router = Router();

const idSchema = z.object({ params: z.object({ id: z.string().regex(/^[0-9]+$/) }) });

const createSchema = z.object({
  body: z.object({
    serviceId: z.number(),
    title: z.string().min(3),
    description: z.string().min(10),
    scheduledDay: z.string(),
    price: z.number().int().min(0).optional(),
  }),
});

const proposeSchema = z.object({
  params: idSchema.shape.params,
  body: z.object({ proposedDay: z.string() }),
});

const listSchema = z.object({
  query: z.object({
    page: z.string().regex(/^[0-9]+$/).optional(),
    size: z.string().regex(/^[0-9]+$/).optional(),
    status: z.enum(['PENDING','CONFIRMED','RESCHEDULE_PROPOSED','CANCELLED','REJECTED','COMPLETED']).optional(),
    day: z.string().optional(),
  }),
});

router.post('/', authenticate, requireRole('client', 'admin'), validate(createSchema), createBooking);
router.put('/:id/confirm', authenticate, requireRole('provider'), validate(idSchema), confirmBooking);
router.put('/:id/propose-day', authenticate, requireRole('provider'), validate(proposeSchema), proposeDay);
router.put('/:id/accept-reschedule', authenticate, requireRole('client'), validate(idSchema), acceptReschedule);
router.put('/:id/reject', authenticate, requireRole('provider'), validate(idSchema), rejectBooking);
router.put('/:id/cancel', authenticate, requireRole('client'), validate(idSchema), cancelBooking);
router.get('/', authenticate, validate(listSchema), listBookings);
router.get('/:id', authenticate, validate(idSchema), getBooking);

export default router;
