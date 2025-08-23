import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { webhooksProcessedTotal, smsDispatchTotal } from '../metrics';
import { handleStripeWebhook } from '../controllers/paymentController';
import { kycWebhook } from '../controllers/kycWebhookController';
import { sendSMS } from './sms';

export function computeNextRun(attempts: number): Date {
  const delay = env.dlqBaseDelaySeconds * Math.pow(env.dlqBackoffMultiplier, attempts);
  return new Date(Date.now() + delay * 1000);
}

export async function enqueueWebhookDLQ(provider: string, payload: any, reason?: string) {
  if (!env.dlqEnable) return;
  try {
    await prisma.webhookDLQ.create({
      data: { provider, payload: JSON.stringify(payload), reason: reason || null, attempts: 0, nextRunAt: computeNextRun(0) },
    });
  } catch (e: any) {
    logger.error('enqueueWebhookDLQ_failed', { provider, error: String(e?.message || e) });
  }
}

export async function enqueueSmsDLQ(to: string, body: string, meta: any, reason?: string) {
  if (!env.dlqEnable) return;
  try {
    await prisma.smsDLQ.create({
      data: { to, body, meta: meta ? JSON.stringify(meta) : null, reason: reason || null, attempts: 0, nextRunAt: computeNextRun(0) },
    });
  } catch (e: any) {
    logger.error('enqueueSmsDLQ_failed', { error: String(e?.message || e) });
  }
}

export async function replayWebhook(item: any) {
  try {
    if (item.provider === 'stripe') {
      const req: any = { body: JSON.parse(item.payload), headers: {} };
      const res: any = { json: () => ({}), status: () => ({ json: () => ({}) }) };
      await handleStripeWebhook(req, res);
    } else if (item.provider === 'kyc') {
      const req: any = { body: JSON.parse(item.payload), headers: {} };
      const res: any = { json: () => ({}), status: () => ({ json: () => ({}) }) };
      await kycWebhook(req, res);
    } else {
      throw new Error('unknown_provider');
    }
    webhooksProcessedTotal?.inc({ provider: item.provider, outcome: 'replayed' });
    return true;
  } catch (e: any) {
    logger.warn('replayWebhook_failed', { id: item.id, provider: item.provider, error: String(e?.message || e) });
    return false;
  }
}

export async function replaySms(item: any) {
  try {
    const meta = item.meta ? JSON.parse(item.meta) : {};
    await sendSMS({
      userId: meta.userId || 0,
      to: item.to,
      body: item.body,
      type: meta.type || 'generic',
      bookingId: meta.bookingId,
    });
    smsDispatchTotal?.inc({ outcome: 'replayed' });
    return true;
  } catch (e: any) {
    logger.warn('replaySms_failed', { id: item.id, to: item.to, error: String(e?.message || e) });
    return false;
  }
}
