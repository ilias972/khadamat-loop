import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  logger.info('request', { id: req.id, method: req.method, url: req.originalUrl });
  next();
}
