import { Request, Response, NextFunction } from 'express';

export function cacheControl(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  if (req.method === 'GET' && /^\/api\/(providers|services|search)/.test(path)) {
    res.setHeader('Cache-Control', 'private, max-age=60');
  } else if (req.method !== 'GET' || /^\/api\/(auth|payments|kyc)/.test(path)) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
}
