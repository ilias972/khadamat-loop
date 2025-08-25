import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

const hits = new Map<string, { count: number; ts: number }>();
let limiter: any = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  const windowMs = env.rateGlobalWindowMin * 60 * 1000;
  const key = req.ip || '';
  const data = hits.get(key) || { count: 0, ts: now };
  if (now - data.ts > windowMs) {
    data.count = 0;
    data.ts = now;
  }
  data.count++;
  hits.set(key, data);
  if (data.count > env.rateGlobalMax) {
    return res.status(429).json({
      success: false,
      error: { code: 429, message: 'Too many requests', timestamp: new Date().toISOString() },
    });
  }
  next();
};

import('express-rate-limit')
  .then(({ default: rateLimit }) => {
    limiter = rateLimit({
      windowMs: env.rateGlobalWindowMin * 60 * 1000,
      max: env.rateGlobalMax,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req: Request, res: Response) => {
        res.status(429).json({
          success: false,
          error: { code: 429, message: 'Too many requests', timestamp: new Date().toISOString() },
        });
      },
    });
  })
  .catch(() => {
    console.warn('express-rate-limit not available, using simple limiter');
  });

export function rateGlobal(req: Request, res: Response, next: NextFunction) {
  const skip = ['/payments/webhook', '/kyc/webhook'];
  if (skip.includes(req.path)) return next();
  return limiter(req, res, next);
}
