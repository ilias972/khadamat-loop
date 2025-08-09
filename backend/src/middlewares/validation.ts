import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err) {
      const details = err instanceof ZodError ? err.errors : [];
      res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Validation error',
          details,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
}
