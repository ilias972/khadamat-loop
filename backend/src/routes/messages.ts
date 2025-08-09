import express from 'express';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  getConversations,
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount,
} from '../controllers/messageController';
import { uploadSingle } from '../utils/upload';
import { z } from 'zod';

const router = express.Router();

router.use(authenticate);

router.get(
  '/conversations',
  validate(
    z.object({
      query: z.object({
        page: z.string().optional(),
        size: z.string().optional(),
      }),
    })
  ),
  getConversations
);

router.get(
  '/conversation/:userId',
  validate(
    z.object({
      params: z.object({ userId: z.string() }),
      query: z.object({
        page: z.string().optional(),
        size: z.string().optional(),
        beforeId: z.string().optional(),
        bookingId: z.string().optional(),
        markAsRead: z.string().optional(),
      }),
    })
  ),
  getConversation
);

router.post(
  '/',
  uploadSingle,
  validate(
    z.object({
      body: z.object({
        receiverId: z.number(),
        content: z.string().optional(),
        bookingId: z.number().optional(),
      }),
    })
  ),
  sendMessage
);

router.put(
  '/:id/read',
  validate(z.object({ params: z.object({ id: z.string() }) })),
  markAsRead
);

router.get('/unread-count', getUnreadCount);

export default router;

