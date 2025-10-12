import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { Sentry } from '../config/sentry';
import { logger } from '../config/logger';

const audit = (logger.child ? logger.child({ source: 'audit' }) : logger) as any;

export function auditLogger(req: Request, res: Response, next: NextFunction) {
  const started = process.hrtime.bigint();
  res.on('finish', () => {
    const diff = Number(process.hrtime.bigint() - started) / 1_000_000;
    const ipHeader = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
    const ip = ipHeader.split(',')[0]?.trim() || '';
    const payload = {
      ip,
      userAgent: (req.headers['user-agent'] as string) || '',
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(diff * 100) / 100,
      requestId: req.id,
    };
    audit.info(payload, 'request_audit');
    if (env.sentryDsn && Sentry && typeof Sentry.captureEvent === 'function') {
      Sentry.captureEvent({
        message: 'request_audit',
        level: 'info',
        extra: payload,
      });
    }
  });
  next();
}

export { audit as auditLog }; 
