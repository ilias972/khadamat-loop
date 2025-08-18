import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function listNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const page = Number(req.query.page ?? 1);
    const size = Math.min(Number(req.query.size ?? 20), 100);
    const onlyUnread = req.query.onlyUnread === 'true';
    const where: any = { userId };
    if (onlyUnread) where.isRead = false;
    const [items, total] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page-1)*size, take: size }),
      prisma.notification.count({ where })
    ]);
    res.json({ success: true, data: { items, page, size, total } });
  } catch (err) { next(err); }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) return next({ status: 404, message: 'Notification not found' });
    if (notif.userId !== userId) return next({ status: 403, message: 'Forbidden' });
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function deleteNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) return next({ status: 404, message: 'Notification not found' });
    if (notif.userId !== userId) return next({ status: 403, message: 'Forbidden' });
    await prisma.notification.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function unreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const unreadTotal = await prisma.notification.count({ where: { userId, isRead: false } });
    res.json({ success: true, data: { unreadTotal } });
  } catch (err) { next(err); }
}
