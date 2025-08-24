import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../i18n/errors';
import { env } from '../config/env';

export function localizeError(err: any, req: Request, _res: Response, next: NextFunction) {
  const status = err?.status || 500;
  let code = err?.code as string | undefined;
  if (!code) {
    code =
      status === 401
        ? 'UNAUTH'
        : status === 403
        ? 'FORBIDDEN'
        : status === 404
        ? 'NOT_FOUND'
        : status === 409
        ? 'CONFLICT'
        : status === 429
        ? 'RATE_LIMITED'
        : 'SERVER_ERROR';
  }
  const langHeader = req.headers['accept-language'] || '';
  const lang = String(langHeader).toLowerCase().startsWith('ar') ? 'ar' : env.i18nDefaultLang;
  const msgTemplate = ERROR_MESSAGES[code] || ERROR_MESSAGES.SERVER_ERROR;
  err.status = status;
  err.code = code;
  err.message = msgTemplate[lang];
  next(err);
}
