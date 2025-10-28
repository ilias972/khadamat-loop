import { PrismaClient } from "@prisma/client";

import { env } from "@config/env";
import logger from "@config/logger";

export const prisma = new PrismaClient({
        log: env.isDevelopment ? ["query", "error", "warn"] : ["error"],
});

export const connectDatabase = async () => {
        try {
                await prisma.$connect();
                logger.info("✅ Database connected");
        } catch (error) {
                logger.error("Database connection failed", error as Error);
                throw error;
        }
};

export default prisma;
