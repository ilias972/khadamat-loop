import { Request, Response, NextFunction } from 'express';
import { Prisma, prisma } from '../lib/prisma';
import { logAction } from '../middlewares/audit';
import { getCacheStatus } from '../utils/cache';
import { pingClamAV } from '../services/antivirus';
import { env } from '../config/env';
import { getJobsStatus } from '../jobs/scheduler';

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.review.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!existing) return next({ status: 404, message: 'Review not found' });

    const providerId = existing.booking.providerId;

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id } });
      const agg = await tx.review.aggregate({
        where: { booking: { providerId } },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.provider.update({
        where: { userId: providerId },
        data: {
          rating: Number((agg._avg.rating || 0).toFixed(1)),
          reviewCount: agg._count.rating,
        },
      });
    });

    await logAction({
      userId: parseInt(req.user?.id || '0', 10),
      action: 'DELETE_REVIEW',
      resource: 'review',
      resourceId: id,
      oldValues: { rating: existing.rating, comment: existing.comment },
      ip: req.ip,
      ua: req.headers['user-agent'],
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function disableUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return next({ status: 404, message: 'User not found' });

    await prisma.user.update({ where: { id }, data: { isDisabled: true } });

    await logAction({
      userId: parseInt(req.user?.id || '0', 10),
      action: 'DISABLE_USER',
      resource: 'user',
      resourceId: id,
      oldValues: { isDisabled: existing.isDisabled },
      newValues: { isDisabled: true },
      ip: req.ip,
      ua: req.headers['user-agent'],
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function listAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 100);
    const skip = (page - 1) * size;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({ skip, take: size, orderBy: { createdAt: 'desc' } }),
      prisma.auditLog.count(),
    ]);

    res.json({ success: true, data: { items, page, size, total } });
  } catch (err) {
    next(err);
  }
}

export async function getWebhookStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '1', 10), 50);
    const stripe = await prisma.webhookEvent.findFirst({
      where: { provider: 'stripe' },
      orderBy: { processedAt: 'desc' },
    });
    const kyc = await prisma.webhookEvent.findFirst({
      where: { provider: 'kyc' },
      orderBy: { processedAt: 'desc' },
    });
    const mapEvent = (e: any) => {
      if (!e) return null;
      const latency = e.processedAt && e.createdAt ? e.processedAt.getTime() - e.createdAt.getTime() : null;
      return {
        provider: e.provider,
        id: e.eventId,
        type: e.type,
        createdAt: e.createdAt,
        outcome: e.status ?? null,
        latencyMs: latency,
        retryCount: (e.retryCount ?? 0) as number,
      };
    };
    let recent: any[] = [];
    if (limit > 0) {
      const events = await prisma.webhookEvent.findMany({
        orderBy: { processedAt: 'desc' },
        take: limit,
        select: { provider: true, eventId: true, type: true, createdAt: true, processedAt: true, status: true },
      });
      recent = events.map(mapEvent);
    }
    res.json({
      success: true,
      data: {
        stripeCheckout: mapEvent(stripe),
        stripeIdentity: mapEvent(kyc),
        recent,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getSnapshot(_req: Request, res: Response, next: NextFunction) {
  try {
    const cacheInfo = getCacheStatus();
    const avEnabled = process.env.UPLOAD_ANTIVIRUS === 'true';
    const avReachable = avEnabled ? await pingClamAV() : false;
    const dbConnected = await prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
    const [webhooksBacklog, smsBacklog] = await Promise.all([
      prisma.webhookDLQ.count(),
      prisma.smsDLQ.count(),
    ]).catch(() => [0, 0]);
    const dlqStats = { webhooksBacklog, smsBacklog };
    const latestWebhooks = await prisma.webhookEvent.findMany({
      orderBy: { processedAt: 'desc' },
      take: 5,
      select: { provider: true, eventId: true, type: true, processedAt: true, outcome: true },
    });
    const health = {
      cache: cacheInfo,
      db: { connected: dbConnected },
      redis: { connected: cacheInfo.driver === 'redis' },
      av: { enabled: avEnabled, reachable: avReachable },
      dlq: { enabled: env.dlqEnable, ...dlqStats },
      jobs: getJobsStatus(),
    };
    res.json({
      success: true,
      data: { health, dlqStats, latestWebhooks, metricsSampleTs: new Date().toISOString() },
    });
  } catch (err) {
    next(err);
  }
}
