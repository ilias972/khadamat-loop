import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { logAction } from '../middlewares/audit';

export const upsertPII = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const userId = Number(user.id);
    const { legalName, dateOfBirth, currentAddress, addressCity, addressRegion, addressPostal } = req.body as any;
    const pii = await prisma.userPII.upsert({
      where: { userId },
      create: {
        userId,
        legalName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        currentAddress,
        addressCity,
        addressRegion,
        addressPostal,
      },
      update: {
        legalName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        currentAddress,
        addressCity,
        addressRegion,
        addressPostal,
      },
    });
    await logAction({ userId, action: 'PII_UPSERT', resource: 'userPII', resourceId: pii.id, newValues: pii, ip: req.ip, ua: req.headers['user-agent'] });
    return res.json({ success: true, data: pii });
  } catch (e) {
    next(e);
  }
};

export const getMyPII = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const userId = Number(user.id);
    const pii = await prisma.userPII.findUnique({ where: { userId } });
    return res.json({ success: true, data: pii });
  } catch (e) {
    next(e);
  }
};
