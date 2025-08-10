import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Données invalides',
        details: err.issues?.map((i) => ({ path: i.path, message: i.message })),
        timestamp: new Date().toISOString(),
      },
    });
  }

  let status = err?.status || 500;
  let message = err?.message || 'Internal Server Error';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        status = 409;
        message = 'Unique constraint failed';
        break;
      case 'P2025':
        status = 404;
        message = 'Record not found';
        break;
      default:
        status = 400;
        message = 'Database error';
    }
  }

  res.status(status).json({
    success: false,
    error: {
      code: status,
      message,
      timestamp: new Date().toISOString(),
    },
  });
}
