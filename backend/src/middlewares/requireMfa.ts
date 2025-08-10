import { Request, Response, NextFunction } from 'express';

export function requireMfa(req: Request, res: Response, next: NextFunction) {
  const enforce = process.env.STAGE === 'prod' || process.env.MFA_ENFORCE === 'true';
  if (!enforce) return next();

  const roles = (process.env.MFA_ENFORCE_ROLES || 'ADMIN')
    .split(',')
    .map((r) => r.trim().toUpperCase())
    .filter(Boolean);
  const userRole = req.user?.role?.toUpperCase();
  if (!userRole || !roles.includes(userRole)) return next();

  if (req.user?.mfa) return next();

  return res.status(403).json({
    success: false,
    error: {
      code: 'MFA_REQUIRED',
      message: 'Multi-factor authentication required',
      timestamp: new Date().toISOString(),
    },
  });
}

