import { createLogger, format, transports } from 'winston';
import path from 'node:path';

const logFmt = format.printf(({ level, message, timestamp, stack, ...meta }) =>
  JSON.stringify({ ts: timestamp, level, msg: message, stack, ...meta })
);

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.timestamp(), logFmt),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join('logs', 'app.log') }),
    new transports.File({ filename: path.join('logs', 'error.log'), level: 'error' })
  ],
});
