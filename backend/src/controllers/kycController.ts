import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { createKycSessionFor } from '../services/kyc';
import { logAction } from '../middlewares/audit';

export const createKycSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const userId = Number(user.id);
    const last = await prisma.verification.findFirst({
      where: { userId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
    if (last?.externalId) {
      return res.json({ success: true, data: { externalId: last.externalId } });
    }
    const sess = await createKycSessionFor(userId);
    await prisma.verification.create({
      data: { userId, provider: 'stripe', externalId: sess.id, status: 'PENDING' },
    });
    await logAction({ userId, action: 'KYC_SESSION_CREATE', resource: 'verification', resourceId: userId, ip: req.ip, ua: req.headers['user-agent'] });
    return res.json({ success: true, data: { externalId: sess.id } });
  } catch (e) {
    next(e);
  }
};

export const getKycStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const userId = Number(user.id);
    const v = await prisma.verification.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: v ?? null });
  } catch (e) {
    next(e);
  }
};
