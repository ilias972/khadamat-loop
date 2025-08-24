import { Request, Response } from 'express';
import { prisma, dbAvailable } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { hashDocNumber, last4 } from '../utils/kycCrypto';
import { encryptWithActiveKey } from '../config/keyring';
import { logAction } from '../middlewares/audit';
import { stripe } from '../config/stripe';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { webhooksProcessedTotal } from '../metrics';
import { enqueueWebhookDLQ } from '../services/dlq';

// A monter avec express.raw() AVANT json (comme Stripe payments)
export const kycWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event: any;
  let rawPayload: any;
  try {
    rawPayload = JSON.parse(req.body.toString('utf8'));
    event = stripe.webhooks.constructEvent(req.body, sig as string, env.stripeIdentityWebhookSecret);
  } catch (err: any) {
    logger.error('kyc webhook signature invalid', { error: err.message });
    return res.status(400).json({
      success: false,
      error: { code: 'WEBHOOK_SIGNATURE_INVALID', message: 'Invalid signature', timestamp: new Date().toISOString() },
    });
  }
  const type = event?.type;
  const sess = event?.data?.object;
  const userId = Number(sess?.metadata?.userId);
  if (!userId || !type)
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'bad_request', timestamp: new Date().toISOString() },
    });

  if (!dbAvailable) {
    logger.warn('SKIP idempotence (db disabled)');
    try {
      if (type.endsWith('.verified')) {
        const documentType = sess?.last_verification_report?.document?.type || sess?.type || 'id_card';
        const docNumber: string | null = null;
        const data: any = { reportId: sess?.last_verification_report?.id };
        const updates: any = { status: 'VERIFIED', documentType, verifiedAt: new Date(), data };
        if (docNumber) {
          updates.docNumberHash = hashDocNumber(userId, docNumber);
          updates.docNumberLast4 = last4(docNumber);
          if ((process.env.KYC_STORE_RAW ?? 'false').toLowerCase() === 'true') {
            const { keyId, encDoc, encDocTag, encDocNonce } = encryptWithActiveKey(docNumber);
            await prisma.kycVault.upsert({
              where: { userId },
              create: { userId, encDoc, encDocTag, encDocNonce, keyId },
              update: { encDoc, encDocTag, encDocNonce, keyId },
            });
          }
        }
        await prisma.verification.upsert({
          where: { externalId: sess.id },
          update: updates,
          create: { userId, provider: 'stripe', externalId: sess.id, ...updates },
        });
        await logAction({ userId, action: 'KYC_VERIFIED', resource: 'verification', resourceId: userId });
      } else if (type.endsWith('.requires_input') || type.endsWith('.canceled')) {
        await prisma.verification.updateMany({
          where: { externalId: sess.id },
          data: { status: 'REJECTED' },
        });
        await logAction({ userId, action: 'KYC_REJECTED', resource: 'verification', resourceId: userId });
      }
      webhooksProcessedTotal?.inc({ provider: 'stripe_identity', outcome: 'ok' });
    } catch (e: any) {
      webhooksProcessedTotal?.inc({ provider: 'stripe_identity', outcome: 'fail' });
      await enqueueWebhookDLQ('stripe_identity', rawPayload || event, String(e?.message || e)).catch(() => {});
    }
    return res.json({ received: true });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.webhookEvent.create({ data: { provider: 'stripe_identity', eventId: event.id, status: 'RECEIVED' } });

      if (type.endsWith('.verified')) {
        const documentType = sess?.last_verification_report?.document?.type || sess?.type || 'id_card';
        const docNumber: string | null = null;
        const data: any = { reportId: sess?.last_verification_report?.id };
        const updates: any = { status: 'VERIFIED', documentType, verifiedAt: new Date(), data };
        if (docNumber) {
          updates.docNumberHash = hashDocNumber(userId, docNumber);
          updates.docNumberLast4 = last4(docNumber);
          if ((process.env.KYC_STORE_RAW ?? 'false').toLowerCase() === 'true') {
            const { keyId, encDoc, encDocTag, encDocNonce } = encryptWithActiveKey(docNumber);
            await tx.kycVault.upsert({
              where: { userId },
              create: { userId, encDoc, encDocTag, encDocNonce, keyId },
              update: { encDoc, encDocTag, encDocNonce, keyId },
            });
          }
        }
        await tx.verification.upsert({
          where: { externalId: sess.id },
          update: updates,
          create: { userId, provider: 'stripe', externalId: sess.id, ...updates },
        });
        await tx.auditLog.create({
          data: { userId, action: 'KYC_VERIFIED', resource: 'verification', resourceId: userId },
        });
      } else if (type.endsWith('.requires_input') || type.endsWith('.canceled')) {
        await tx.verification.updateMany({
          where: { externalId: sess.id },
          data: { status: 'REJECTED' },
        });
        await tx.auditLog.create({
          data: { userId, action: 'KYC_REJECTED', resource: 'verification', resourceId: userId },
        });
      }

      await tx.webhookEvent.update({
        where: { provider_eventId: { provider: 'stripe_identity', eventId: event.id } },
        data: { status: 'PROCESSED', processedAt: new Date() },
      });
    });
    webhooksProcessedTotal?.inc({ provider: 'stripe_identity', outcome: 'ok' });
    return res.json({ received: true });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      logger.warn('kyc webhook duplicate', { eventId: event.id });
      webhooksProcessedTotal?.inc({ provider: 'stripe_identity', outcome: 'replayed' });
      return res.json({ received: true });
    }
    await prisma.webhookEvent
      .upsert({
        where: { provider_eventId: { provider: 'stripe_identity', eventId: event.id } },
        create: { provider: 'stripe_identity', eventId: event.id, status: 'FAILED', processedAt: new Date() },
        update: { status: 'FAILED', processedAt: new Date() },
      })
      .catch(() => {});
    webhooksProcessedTotal?.inc({ provider: 'stripe_identity', outcome: 'fail' });
    await enqueueWebhookDLQ('stripe_identity', rawPayload || event, String(e?.message || e)).catch(() => {});
    return res.json({ received: true });
  }
};
