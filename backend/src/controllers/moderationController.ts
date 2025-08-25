import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { logAction } from '../middlewares/audit';

export async function listReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const status = (req.query.status as string) || 'active';
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 100);
    const skip = (page - 1) * size;
    const where: any = {};
    if (status === 'deleted') where.deletedAt = { not: null };
    else if (status === 'active') where.deletedAt = null;
    const [items, total] = await Promise.all([
      prisma.review.findMany({ where, skip, take: size, orderBy: { createdAt: 'desc' } }),
      prisma.review.count({ where }),
    ]);
    res.json({ success: true, data: { items, page, size, total } });
  } catch (err) {
    next(err);
  }
}

export async function deleteReviewAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const reason = (req.body.reason as string) || null;
    await prisma.review.update({ where: { id }, data: { deletedAt: new Date() } });
    await prisma.moderationAction.create({ data: { adminId: Number(req.user!.id), targetType: 'REVIEW', targetId: id, action: 'DELETE', reason } });
    await logAction({ userId: Number(req.user!.id), action: 'ADMIN_MODERATION', resource: 'review', resourceId: id, newValues: { action: 'DELETE', reason }, ip: req.ip, ua: req.headers['user-agent'] });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function restoreReviewAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.review.update({ where: { id }, data: { deletedAt: null } });
    await prisma.moderationAction.create({ data: { adminId: Number(req.user!.id), targetType: 'REVIEW', targetId: id, action: 'RESTORE' } });
    await logAction({ userId: Number(req.user!.id), action: 'ADMIN_MODERATION', resource: 'review', resourceId: id, newValues: { action: 'RESTORE' }, ip: req.ip, ua: req.headers['user-agent'] });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 100);
    const skip = (page - 1) * size;
    const where: any = {};
    const [items, total] = await Promise.all([
      prisma.message.findMany({ where, skip, take: size, orderBy: { createdAt: 'desc' } }),
      prisma.message.count({ where }),
    ]);
    res.json({ success: true, data: { items, page, size, total } });
  } catch (err) {
    next(err);
  }
}

export async function hideMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const reason = (req.body.reason as string) || null;
    await prisma.message.update({ where: { id }, data: { isHidden: true } });
    await prisma.moderationAction.create({ data: { adminId: Number(req.user!.id), targetType: 'MESSAGE', targetId: id, action: 'HIDE', reason } });
    await logAction({ userId: Number(req.user!.id), action: 'ADMIN_MODERATION', resource: 'message', resourceId: id, newValues: { action: 'HIDE', reason }, ip: req.ip, ua: req.headers['user-agent'] });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
