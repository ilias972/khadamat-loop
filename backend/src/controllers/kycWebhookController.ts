import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashDocNumber, last4 } from '../utils/kycCrypto';
import { encryptWithActiveKey } from '../config/keyring';
import { logAction } from '../middlewares/audit';

const prisma = new PrismaClient();

// A monter avec express.raw() AVANT json (comme Stripe payments)
export const kycWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body as any; // en prod: vérifier la signature du provider
    const type = event?.type;
    const sess = event?.data?.object;
    const userId = Number(sess?.metadata?.userId);
    if (!userId || !type) return res.status(400).end();

    if (type.endsWith('.verified')) {
      const documentType = sess?.last_verification_report?.document?.type || sess?.type || 'id_card';
      const docNumber: string | null = null; // mettre la vraie source si dispo
      const data: any = { reportId: sess?.last_verification_report?.id };

      const updates: any = {
        status: 'VERIFIED', documentType, verifiedAt: new Date(), data
      };

      if (docNumber) {
        updates.docNumberHash = hashDocNumber(userId, docNumber);
        updates.docNumberLast4 = last4(docNumber);

        if ((process.env.KYC_STORE_RAW ?? 'false').toLowerCase() === 'true') {
          const { keyId, encDoc, encDocTag, encDocNonce } = encryptWithActiveKey(docNumber);
          await prisma.kycVault.upsert({
            where: { userId },
            create: { userId, encDoc, encDocTag, encDocNonce, keyId },
            update: { encDoc, encDocTag, encDocNonce, keyId }
          });
        }
      }

      await prisma.verification.upsert({
        where: { externalId: sess.id },
        update: updates,
        create: { userId, provider: 'stripe', externalId: sess.id, ...updates }
      });

      await logAction({ userId, action: 'KYC_VERIFIED', resource: 'verification', resourceId: userId });
      return res.json({ received: true });
    }

    if (type.endsWith('.requires_input') || type.endsWith('.canceled')) {
      await prisma.verification.updateMany({
        where: { externalId: sess.id }, data: { status: 'REJECTED' }
      });
      await logAction({ userId, action: 'KYC_REJECTED', resource: 'verification', resourceId: userId });
      return res.json({ received: true });
    }

    return res.json({ received: true });
  } catch (e) {
    return res.status(400).json({ error: 'webhook_error' });
  }
};
