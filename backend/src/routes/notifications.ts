import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  listNotifications,
  markAsRead,
  deleteNotification,
  unreadCount,
  getNotificationPrefs,
  putNotificationPrefs,
} from '../controllers/notificationController';

const router = Router();

const listSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).optional(),
    size: z.coerce.number().min(1).max(100).optional(),
    onlyUnread: z.coerce.boolean().optional(),
  })
});

const idSchema = z.object({ params: z.object({ id: z.string().regex(/^[0-9]+$/) }) });

const prefsSchema = z.object({
  body: z.object({
    emailOn: z.boolean().optional(),
    smsOn: z.boolean().optional(),
    pushOn: z.boolean().optional(),
    quietStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    quietEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  })
});

router.get('/', authenticate, validate(listSchema), listNotifications);
router.put('/:id/read', authenticate, validate(idSchema), markAsRead);
router.delete('/:id', authenticate, validate(idSchema), deleteNotification);
router.get('/unread-count', authenticate, unreadCount);
router.get('/prefs', authenticate, getNotificationPrefs);
router.put('/prefs', authenticate, validate(prefsSchema), putNotificationPrefs);

export default router;
