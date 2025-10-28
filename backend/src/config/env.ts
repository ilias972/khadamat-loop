import path from "node:path";
import fs from "node:fs";

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanWithDefault = (defaultValue: boolean) =>
        z
                .enum(["true", "false"])
                .default(defaultValue ? "true" : "false")
                .transform((value) => value === "true");

const envSchema = z
        .object({
                NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
                HOST: z.string().min(1).default("0.0.0.0"),
                PORT: z.coerce.number().int().positive().default(3000),
                DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
                SHADOW_DATABASE_URL: z.string().optional(),
                JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
                JWT_EXPIRATION: z.string().default("1h"),
                REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
                REFRESH_TOKEN_EXPIRATION: z.string().default("7d"),
                CORS_ORIGIN: z.string().default("*"),
                REDIS_URL: z.string().url().optional(),
                RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
                RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
                ENABLE_SWAGGER: booleanWithDefault(true),
                SWAGGER_BASE_PATH: z.string().default("/api/docs"),
                ENABLE_PROMETHEUS: booleanWithDefault(true),
                PROMETHEUS_METRICS_PATH: z.string().default("/metrics"),
                ENABLE_HTTPS: booleanWithDefault(false),
                SSL_KEY_PATH: z.string().optional(),
                SSL_CERT_PATH: z.string().optional(),
                LOG_LEVEL: z
                        .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
                        .default("info"),
                FRONTEND_URL: z.string().default("http://localhost:5173"),
                STRIPE_SECRET_KEY: z.string().optional(),
        })
        .superRefine((data, ctx) => {
                if (data.ENABLE_HTTPS) {
                        if (!data.SSL_CERT_PATH || !data.SSL_KEY_PATH) {
                                ctx.addIssue({
                                        code: z.ZodIssueCode.custom,
                                        message: "SSL_CERT_PATH and SSL_KEY_PATH are required when ENABLE_HTTPS=true",
                                        path: ["SSL_CERT_PATH"],
                                });
                        } else {
                                const certExists = fs.existsSync(path.resolve(data.SSL_CERT_PATH));
                                const keyExists = fs.existsSync(path.resolve(data.SSL_KEY_PATH));

                                if (!certExists) {
                                        ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: `Certificate not found at ${data.SSL_CERT_PATH}`,
                                                path: ["SSL_CERT_PATH"],
                                        });
                                }

                                if (!keyExists) {
                                        ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: `Private key not found at ${data.SSL_KEY_PATH}`,
                                                path: ["SSL_KEY_PATH"],
                                        });
                                }
                        }
                }
        });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
        console.error("❌ Invalid environment variables:");
        console.error(parsedEnv.error.flatten().fieldErrors);
        throw new Error("Invalid environment variables");
}

export const env = {
        ...parsedEnv.data,
        isDevelopment: parsedEnv.data.NODE_ENV === "development",
        isProduction: parsedEnv.data.NODE_ENV === "production",
        isTest: parsedEnv.data.NODE_ENV === "test",
};

export type AppEnv = typeof env;
