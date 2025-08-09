import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { listNotifications, markAsRead, deleteNotification, unreadCount } from '../controllers/notificationController';

const router = Router();

const listSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).optional(),
    size: z.coerce.number().min(1).max(100).optional(),
    onlyUnread: z.coerce.boolean().optional(),
  })
});

const idSchema = z.object({ params: z.object({ id: z.string().regex(/^[0-9]+$/) }) });

router.get('/', authenticate, validate(listSchema), listNotifications);
router.put('/:id/read', authenticate, validate(idSchema), markAsRead);
router.delete('/:id', authenticate, validate(idSchema), deleteNotification);
router.get('/unread-count', authenticate, unreadCount);

export default router;
