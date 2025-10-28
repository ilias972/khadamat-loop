import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

import { ApiError } from "@middlewares/error.middleware";

export const validateRequest = (schema: ZodSchema) =>
        async (req: Request, _res: Response, next: NextFunction) => {
                try {
                        const parsed = await schema.parseAsync({
                                body: req.body,
                                query: req.query,
                                params: req.params,
                        });
                        req.body = parsed.body;
                        req.query = parsed.query;
                        req.params = parsed.params;
                        next();
                } catch (error) {
                        next(new ApiError(400, "Validation failed", error));
                }
        };
