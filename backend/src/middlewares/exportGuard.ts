import { Request, Response, NextFunction } from 'express';

const allow = (process.env.KYC_EXPORT_IP_ALLOWLIST || '').split(',').map(s => s.trim()).filter(Boolean);
export function ipAllowlist(req: Request, res: Response, next: NextFunction) {
  if (!allow.length) return next();
  const ip = req.ip || req.connection.remoteAddress || '';
  if (allow.includes(ip)) return next();
  return res.status(403).json({ success: false, error: { code: 'IP_NOT_ALLOWED', message: 'IP not allowed', timestamp: new Date().toISOString() }});
}
