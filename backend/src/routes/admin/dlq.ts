import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../config/logger';
import { replayWebhook, replaySms, computeNextRun } from '../../services/dlq';

const router = Router();

function pagination(q: any) {
  const page = Math.max(1, parseInt(q.page as string, 10) || 1);
  const size = Math.min(100, parseInt(q.size as string, 10) || 20);
  return { skip: (page - 1) * size, take: size, page, size };
}

router.get('/webhooks', async (req, res) => {
  const { skip, take, page, size } = pagination(req.query);
  const items = await prisma.webhookDLQ.findMany({ orderBy: { nextRunAt: 'asc' }, skip, take });
  res.json({ success: true, data: { items, page, size } });
});

router.post('/webhooks/:id/replay', async (req: any, res) => {
  const id = parseInt(req.params.id, 10);
  const item = await prisma.webhookDLQ.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
  const start = Date.now();
  const ok = await replayWebhook(item);
  if (ok) {
    await prisma.webhookDLQ.delete({ where: { id } });
  } else {
    const attempts = item.attempts + 1;
    await prisma.webhookDLQ.update({ where: { id }, data: { attempts, nextRunAt: computeNextRun(attempts) } });
  }
  logger.info('admin_webhook_dlq_replay', { requestId: req.id, userId: req.user?.id, ip: req.ip, id, result: ok ? 'ok' : 'fail', duration: Date.now() - start });
  res.json({ success: ok, data: { replayed: ok } });
});

router.get('/sms', async (req, res) => {
  const { skip, take, page, size } = pagination(req.query);
  const items = await prisma.smsDLQ.findMany({ orderBy: { nextRunAt: 'asc' }, skip, take });
  res.json({ success: true, data: { items, page, size } });
});

router.post('/sms/:id/replay', async (req: any, res) => {
  const id = parseInt(req.params.id, 10);
  const item = await prisma.smsDLQ.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
  const start = Date.now();
  const ok = await replaySms(item);
  if (ok) {
    await prisma.smsDLQ.delete({ where: { id } });
  } else {
    const attempts = item.attempts + 1;
    await prisma.smsDLQ.update({ where: { id }, data: { attempts, nextRunAt: computeNextRun(attempts) } });
  }
  logger.info('admin_sms_dlq_replay', { requestId: req.id, userId: req.user?.id, ip: req.ip, id, result: ok ? 'ok' : 'fail', duration: Date.now() - start });
  res.json({ success: ok, data: { replayed: ok } });
});

router.get('/stats', async (_req, res) => {
  const [w, s] = await Promise.all([
    prisma.webhookDLQ.count(),
    prisma.smsDLQ.count(),
  ]);
  res.json({ success: true, data: { webhooksBacklog: w, smsBacklog: s } });
});

export default router;
