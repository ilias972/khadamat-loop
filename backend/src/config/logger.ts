import { createLogger, format, transports } from "winston";

import { env } from "@config/env";

const { combine, timestamp, printf, errors, colorize } = format;

const consoleFormat = printf(({ level, message, timestamp: time, stack }) => {
        return stack ? `${time} ${level}: ${stack}` : `${time} ${level}: ${message}`;
});

export const logger = createLogger({
        level: env.LOG_LEVEL,
        format: combine(errors({ stack: true }), timestamp(), consoleFormat),
        transports: [
                new transports.Console({
                        format: env.isDevelopment
                                ? combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), consoleFormat)
                                : combine(timestamp(), consoleFormat),
                }),
        ],
});

export default logger;
