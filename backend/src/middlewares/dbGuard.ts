import { Request, Response, NextFunction } from 'express';
import { dbAvailable } from '../lib/prisma';

export function dbGuard(_req: Request, res: Response, next: NextFunction) {
  if (!dbAvailable) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'DB_OFFLINE',
        message: 'Base indisponible (mode offline)',
        timestamp: new Date().toISOString(),
      },
    });
  }
  return next();
}
