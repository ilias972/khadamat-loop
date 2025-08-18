import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { decryptWithKeyId } from '../config/keyring';

export const exportUserEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    const userId = Number(req.params.userId);
    const requestId = Number(req.query.requestId);
    const dr = await prisma.disclosureRequest.findUnique({ where: { id: requestId } });
    if (!dr || dr.status !== 'APPROVED' || dr.targetUserId !== userId) {
      return res.status(403).json({ success: false, error: { code: 'DISCLOSURE_NOT_APPROVED', message: 'Approval required', timestamp: new Date().toISOString() }});
    }
    if (dr.expiresAt && dr.expiresAt < new Date()) {
      return res.status(410).json({ success: false, error: { code: 'DISCLOSURE_EXPIRED', message: 'Expired approval', timestamp: new Date().toISOString() }});
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const pii = await prisma.userPII.findUnique({ where: { userId } });
    const ver = await prisma.verification.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const vault = await prisma.kycVault.findUnique({ where: { userId } });

    let docNumber: string | null = null;
    if (vault?.encDoc && vault.encDocTag && vault.encDocNonce && vault.keyId) {
      docNumber = decryptWithKeyId(vault.keyId, vault.encDoc, vault.encDocTag, vault.encDocNonce);
    }

    const evidence = {
      user: { id: user?.id, email: user?.email, phone: user?.phone, role: user?.role, createdAt: user?.createdAt },
      pii,
      verification: { ...ver, data: undefined },
      document: { number: docNumber, last4: ver?.docNumberLast4, type: ver?.documentType }
    };

    res.json({ success: true, data: evidence });
  } catch (e) {
    next(e);
  }
};
