import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDisclosure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    if (String(process.env.ADMIN_TOTP_REQUIRED || 'true') === 'true') {
      // TODO: vérifier le TOTP admin (si 2FA actif chez toi)
    }
    const { targetUserId, justification } = req.body;
    const expiresAt = new Date(Date.now() + 24 * 3600 * 1000);
    const r = await prisma.disclosureRequest.create({
      data: { targetUserId: Number(targetUserId), justification, requestedBy: admin.id, expiresAt }
    });
    res.json({ success: true, data: r });
  } catch (e) {
    next(e);
  }
};

export const approveDisclosure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    const id = Number(req.params.id);
    const r = await prisma.disclosureRequest.findUnique({ where: { id } });
    if (!r) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Request not found', timestamp: new Date().toISOString() }});
    if (r.requestedBy === admin.id) {
      return res.status(403).json({ success: false, error: { code: 'TWO_PERSON_RULE', message: 'Different admin required', timestamp: new Date().toISOString() }});
    }
    if (r.status !== 'PENDING') {
      return res.status(400).json({ success: false, error: { code: 'INVALID_STATE', message: 'Not pending', timestamp: new Date().toISOString() }});
    }
    const updated = await prisma.disclosureRequest.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy: admin.id, approvedAt: new Date() }
    });
    res.json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
};
