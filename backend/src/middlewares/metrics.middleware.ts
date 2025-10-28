import type { NextFunction, Request, Response } from "express";

import { httpRequestCounter, httpRequestDuration } from "@utils/metrics";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const endTimer = httpRequestDuration.startTimer({
                method: req.method,
                route: req.path,
        });

        res.on("finish", () => {
                endTimer({ status_code: res.statusCode.toString() });
                httpRequestCounter.labels(req.method, req.path, res.statusCode.toString()).inc();
        });

        next();
};
