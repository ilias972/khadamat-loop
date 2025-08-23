import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { notifyUser } from '../utils/notify';
import { sendMessageEmail } from '../services/emailEvents';
import { assertParticipant } from '../utils/ownership';
import path from 'node:path';
import { logAction } from '../middlewares/audit';

export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = parseInt((req.query.size as string) || '20', 10);

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        isHidden: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    const map = new Map<number, { peerId: number; lastMessage: any; unreadCount: number }>();
    for (const msg of messages) {
      const peerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!map.has(peerId)) {
        map.set(peerId, { peerId, lastMessage: msg, unreadCount: 0 });
      }
      if (msg.receiverId === userId && !msg.isRead) {
        const entry = map.get(peerId)!;
        entry.unreadCount += 1;
      }
    }

    const items = Array.from(map.values());
    const total = items.length;
    const start = (page - 1) * size;
    const paginated = items.slice(start, start + size);

    res.json({ success: true, data: { items: paginated, page, size, total } });
  } catch (err) {
    next(err);
  }
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const otherId = parseInt(req.params.userId, 10);
    assertParticipant(userId, userId, otherId);

    const beforeId = req.query.beforeId ? parseInt(req.query.beforeId as string, 10) : undefined;
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = parseInt((req.query.size as string) || '20', 10);
    const bookingId = req.query.bookingId ? parseInt(req.query.bookingId as string, 10) : undefined;
    const markAsRead = req.query.markAsRead === 'true';

    const where: any = {
      OR: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
      isHidden: false,
    };
    if (beforeId) where.id = { lt: beforeId };
    if (bookingId) where.bookingId = bookingId;

    const [total, messages] = await Promise.all([
      prisma.message.count({ where }),
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: beforeId ? 0 : (page - 1) * size,
        take: size,
      }),
    ]);

    if (markAsRead) {
      const ids = messages.filter((m) => m.receiverId === userId && !m.isRead).map((m) => m.id);
      if (ids.length > 0) {
        await prisma.message.updateMany({ where: { id: { in: ids } }, data: { isRead: true } });
        messages.forEach((m) => {
          if (ids.includes(m.id)) m.isRead = true;
        });
      }
    }

    messages.reverse();

    res.json({ success: true, data: { items: messages, page, size, total } });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const senderId = parseInt(req.user?.id || '', 10);
    const { receiverId, content, bookingId } = req.body;

    if (!content && !req.file) {
      return next({ status: 400, message: 'Message must have content or file' });
    }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) return next({ status: 404, message: 'Receiver not found' });

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [msgCount, attachCount, storage] = await Promise.all([
      prisma.message.count({ where: { senderId, createdAt: { gte: since } } }),
      prisma.message.count({
        where: {
          senderId,
          createdAt: { gte: since },
          fileUrl: { not: null },
        },
      }),
      prisma.message.aggregate({
        _sum: { fileSize: true },
        where: { senderId, fileUrl: { not: null } },
      }),
    ]);

    const MSG_MAX_PER_DAY = parseInt(process.env.MSG_MAX_PER_DAY || '200', 10);
    const ATTACH_MAX_PER_DAY = parseInt(process.env.ATTACH_MAX_PER_DAY || '50', 10);
    const USER_MAX_STORAGE =
      parseInt(process.env.USER_MAX_STORAGE_MB || '200', 10) * 1024 * 1024;

    if (msgCount >= MSG_MAX_PER_DAY) {
      await logAction({
        userId: senderId,
        action: 'QUOTA_MSG',
        resource: 'message',
        ip: req.ip,
        ua: req.headers['user-agent'],
      });
      return next({ status: 429, message: 'Daily message limit exceeded' });
    }

    if (req.file) {
      if (attachCount >= ATTACH_MAX_PER_DAY) {
        await logAction({
          userId: senderId,
          action: 'QUOTA_ATTACH',
          resource: 'message',
          ip: req.ip,
          ua: req.headers['user-agent'],
        });
        return next({
          status: 429,
          message: 'Daily attachment limit exceeded',
        });
      }
      const totalSize = (storage._sum.fileSize || 0) + req.file.size;
      if (totalSize > USER_MAX_STORAGE) {
        await logAction({
          userId: senderId,
          action: 'QUOTA_STORAGE',
          resource: 'message',
          ip: req.ip,
          ua: req.headers['user-agent'],
        });
        return next({ status: 429, message: 'Storage quota exceeded' });
      }
    }

    if (bookingId) {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) return next({ status: 404, message: 'Booking not found' });
      assertParticipant(senderId, booking.clientId, booking.providerId);
      assertParticipant(receiverId, booking.clientId, booking.providerId);
    }

    const data: any = {
      senderId,
      receiverId,
      content: content || '',
      isSystem: false,
      isRead: false,
    };
    if (bookingId) data.bookingId = bookingId;
    if (req.file) {
      const filePath =
        req.file.path || path.join(req.file.destination, req.file.filename);
      data.fileUrl = filePath;
      data.fileType = req.file.mimetype || '';
      data.fileSize = req.file.size;
    }

    const message = await prisma.message.create({ data });

    notifyUser(receiverId, 'MESSAGE_RECEIVED', 'Nouveau message', '...');
    sendMessageEmail(receiverId).catch(() => {});

    const response: any = { message };
    if (message.fileUrl) {
      response.file = {
        fileUrl: message.fileUrl,
        fileType: message.fileType,
        fileSize: message.fileSize,
      };
    }

    res.status(201).json({ success: true, data: response });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);

    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) return next({ status: 404, message: 'Message not found' });
    if (message.receiverId !== userId) return next({ status: 403, message: 'Forbidden' });

    const updated = await prisma.message.update({ where: { id }, data: { isRead: true } });

    res.json({ success: true, data: { message: updated } });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const unreadTotal = await prisma.message.count({ where: { receiverId: userId, isRead: false, isHidden: false } });
    res.json({ success: true, data: { unreadTotal } });
  } catch (err) {
    next(err);
  }
}

