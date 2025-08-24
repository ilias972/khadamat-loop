import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import { logger } from '../config/logger';
import { computeNextRun, replayWebhook, replaySms } from '../services/dlq';
import { dlqWebhooksBacklog, dlqSmsBacklog } from '../metrics';

export function startDlqRunner() {
  if (env.dlqEnable !== true) {
    logger.info('DLQ_DISABLED');
    return;
  }
  const run = async () => {
    try {
      const now = new Date();
      const [webhooks, sms] = await Promise.all([
        prisma.webhookDLQ.findMany({ where: { nextRunAt: { lte: now } }, take: env.dlqBatchSize }),
        prisma.smsDLQ.findMany({ where: { nextRunAt: { lte: now } }, take: env.dlqBatchSize }),
      ]);
      dlqWebhooksBacklog?.set(await prisma.webhookDLQ.count().catch(() => 0));
      dlqSmsBacklog?.set(await prisma.smsDLQ.count().catch(() => 0));

      for (const item of webhooks) {
        const ok = await replayWebhook(item);
        if (ok) {
          await prisma.webhookDLQ.delete({ where: { id: item.id } });
        } else {
          const attempts = item.attempts + 1;
          const data: any = { attempts, nextRunAt: computeNextRun(attempts) };
          await prisma.webhookDLQ.update({ where: { id: item.id }, data });
          if (attempts >= env.dlqMaxAttempts) {
            logger.error('DLQ_WEBHOOK_DEADLETTER', { id: item.id, provider: item.provider });
          }
        }
      }

      for (const item of sms) {
        const ok = await replaySms(item);
        if (ok) {
          await prisma.smsDLQ.delete({ where: { id: item.id } });
        } else {
          const attempts = item.attempts + 1;
          const data: any = { attempts, nextRunAt: computeNextRun(attempts) };
          await prisma.smsDLQ.update({ where: { id: item.id }, data });
          if (attempts >= env.dlqMaxAttempts) {
            logger.error('DLQ_SMS_DEADLETTER', { id: item.id, to: item.to });
          }
        }
      }
    } catch (e: any) {
      logger.error('DLQ_RUN_ERROR', { error: String(e?.message || e) });
    }
  };
  run().catch(() => {});
  setInterval(() => run().catch(() => {}), env.dlqPollIntervalMs);
}
