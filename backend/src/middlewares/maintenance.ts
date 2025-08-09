import { Request, Response, NextFunction } from 'express';
export function maintenanceGuard(req: Request, res: Response, next: NextFunction) {
  const enabled = String(process.env.MAINTENANCE_MODE || 'false').toLowerCase() === 'true';
  if (!enabled) return next();
  const allowAdmin = String(process.env.MAINTENANCE_ALLOW_ADMIN || 'true').toLowerCase() === 'true';
  const user: any = (req as any).user;
  if (allowAdmin && user?.role === 'ADMIN') return next();
  return res.status(503).json({
    success: false,
    error: {
      code: 'MAINTENANCE',
      message: 'Maintenance en cours',
      timestamp: new Date().toISOString()
    }
  });
}
