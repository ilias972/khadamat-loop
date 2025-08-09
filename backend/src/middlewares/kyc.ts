import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

export function requireKycFor(role: 'PROVIDER'|'CLIENT'|'BOTH' = 'PROVIDER') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const wanted = (process.env.KYC_REQUIRED_FOR || 'PROVIDER') as 'PROVIDER' | 'CLIENT' | 'BOTH';
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success:false, error:{ code:'UNAUTH', message:'Auth required', timestamp:new Date().toISOString() }});
    }
    const must = wanted === 'BOTH' || (user.role?.toUpperCase() === wanted);
    if (!must) return next();

    const v = await prisma.verification.findFirst({ where:{ userId: Number(user.id) }, orderBy:{ createdAt:'desc' } });
    if (!v || v.status !== 'VERIFIED') {
      return res.status(403).json({ success:false, error:{ code:'KYC_REQUIRED', message:'Vérification d’identité requise', timestamp:new Date().toISOString() }});
    }
    next();
  };
}
