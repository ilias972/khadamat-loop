import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      req.body = result.body;
      req.params = result.params;
      req.query = result.query;
      next();
    } catch (err) {
      next(err);
    }
  };
}
