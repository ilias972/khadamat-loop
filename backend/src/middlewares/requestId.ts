import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { Sentry } from '../config/sentry';

declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
  }
}

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = (req.headers['x-request-id'] as string) || randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  if (Sentry) {
    Sentry.getCurrentHub().configureScope((scope: any) => {
      scope.setTag('requestId', id);
    });
  }
  next();
}
