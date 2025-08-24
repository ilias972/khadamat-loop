import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../lib/prisma';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { env } from '../config/env';
import { ERROR_MESSAGES } from '../i18n/errors';
import { Sentry } from '../config/sentry';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  let status = err?.status || 500;
  let code = err?.code as string | undefined;
  if (err instanceof ZodError) {
    status = 400;
    code = 'VALIDATION_ERROR';
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        status = 409;
        code = 'SERVER_ERROR';
        break;
      case 'P2025':
        status = 404;
        code = 'NOT_FOUND';
        break;
      default:
        status = 400;
        code = 'SERVER_ERROR';
    }
  }

  code = code || 'SERVER_ERROR';
  const message = err.message || (ERROR_MESSAGES[code] || ERROR_MESSAGES.SERVER_ERROR)[env.i18nDefaultLang];

  logger.error(message, { id: req.id, status, stack: err?.stack });
  if (Sentry) {
    Sentry.captureException(err);
  }
  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  });
}
