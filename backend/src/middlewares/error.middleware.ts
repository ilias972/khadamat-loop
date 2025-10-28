import type { NextFunction, Request, Response } from "express";

import logger from "@config/logger";

export class ApiError extends Error {
        statusCode: number;

        details?: unknown;

        constructor(statusCode: number, message: string, details?: unknown) {
                super(message);
                this.statusCode = statusCode;
                this.details = details;
        }
}

export const notFoundHandler = (_req: Request, res: Response) => {
        res.status(404).json({ message: "Resource not found" });
};

export const errorMiddleware = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
        const statusCode = error instanceof ApiError ? error.statusCode : 500;
        const message = error.message || "Internal server error";

        logger.error(message, error);

        res.status(statusCode).json({
                message,
                details: error instanceof ApiError ? error.details : undefined,
        });
};
