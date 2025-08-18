import { createLogger, format, transports } from 'winston';
import path from 'node:path';
import fs from 'node:fs';

const LOG_DIR = path.resolve(process.env.LOG_DIR || 'logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

const logFmt = format.printf(({ level, message, timestamp, stack, ...meta }) =>
  JSON.stringify({ ts: timestamp, level, msg: message, stack, ...meta })
);

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.timestamp(), logFmt),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(LOG_DIR, 'app.log') }),
    new transports.File({ filename: path.join(LOG_DIR, 'error.log'), level: 'error' })
  ],
});
