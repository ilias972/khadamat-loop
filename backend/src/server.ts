import fs from "node:fs";
import http from "node:http";
import https from "node:https";

import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { env } from "@config/env";
import logger from "@config/logger";
import { swaggerSpec } from "@config/swagger";
import v1Router from "@routes/v1";
import { errorMiddleware, notFoundHandler } from "@middlewares/error.middleware";
import { metricsMiddleware } from "@middlewares/metrics.middleware";
import { connectDatabase } from "@utils/prisma";
import { metricsRegistry } from "@utils/metrics";

const rateLimiter = rateLimit({
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        limit: env.RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
});

export const createApp = () => {
        const app = express();

        app.use(helmet());
        const corsOrigin = env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",");
        app.use(cors({ origin: corsOrigin, credentials: true }));
        app.use(compression());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(rateLimiter);
        app.use(metricsMiddleware);

        app.get("/health", (_req, res) => {
                res.json({ status: "ok" });
        });

        if (env.ENABLE_PROMETHEUS) {
                app.get(env.PROMETHEUS_METRICS_PATH, async (_req, res) => {
                        res.set("Content-Type", metricsRegistry.contentType);
                        res.send(await metricsRegistry.metrics());
                });
        }

        if (env.ENABLE_SWAGGER) {
                app.use(env.SWAGGER_BASE_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        }

        app.use("/api/v1", v1Router);

        app.use(notFoundHandler);
        app.use(errorMiddleware);

        return app;
};

export const app = createApp();

export const startServer = async () => {
        await connectDatabase();

        const server = env.ENABLE_HTTPS
                ? https.createServer(
                          {
                                  key: env.SSL_KEY_PATH ? fs.readFileSync(env.SSL_KEY_PATH) : undefined,
                                  cert: env.SSL_CERT_PATH ? fs.readFileSync(env.SSL_CERT_PATH) : undefined,
                          },
                          app,
                  )
                : http.createServer(app);

        return new Promise<http.Server | https.Server>((resolve) => {
                server.listen(env.PORT, env.HOST, () => {
                        const protocol = env.ENABLE_HTTPS ? "https" : "http";
                        console.log(`🚀 Khadamat API running on ${protocol}://${env.HOST}:${env.PORT}`);
                        console.log("✅ Database connected");
                        if (env.ENABLE_SWAGGER) {
                                console.log(`📊 Swagger docs available at ${env.SWAGGER_BASE_PATH}`);
                        }
                        logger.info(
                                `Khadamat API listening on ${protocol}://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`,
                        );
                        resolve(server);
                });
        });
};

if (process.env.NODE_ENV !== "test") {
        startServer().catch((error) => {
                logger.error("Failed to start server", error);
                process.exit(1);
        });
}

export default app;
