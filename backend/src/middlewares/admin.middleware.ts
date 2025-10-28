import type { NextFunction, Request, Response } from "express";

import { ApiError } from "@middlewares/error.middleware";

export const adminMiddleware = (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== "ADMIN") {
                throw new ApiError(403, "Admin access required");
        }

        next();
};
