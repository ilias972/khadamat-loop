import { createLogger, format, transports } from 'winston';
import path from 'node:path';
import fs from 'node:fs';

const LOG_DIR = path.resolve(process.env.LOG_DIR || 'logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

function mask(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED]')
    .replace(/\+?\d{6,15}/g, (m) => m.slice(-4).padStart(m.length, '*'));
}

const redactFormat = format((info) => {
  if (process.env.LOG_REDACT_PII === 'true') {
    if (typeof info.message === 'string') info.message = mask(info.message);
    for (const key of Object.keys(info)) {
      if (typeof info[key] === 'string') info[key] = mask(info[key]);
    }
  }
  return info;
});

const logFmt = format.printf(({ level, message, timestamp, stack, ...meta }) =>
  JSON.stringify({ ts: timestamp, level, msg: message, stack, ...meta })
);

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(redactFormat(), format.timestamp(), logFmt),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(LOG_DIR, 'app.log') }),
    new transports.File({ filename: path.join(LOG_DIR, 'error.log'), level: 'error' })
  ],
});
