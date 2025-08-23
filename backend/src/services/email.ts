import { createTransport } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { logger } from '../config/logger';

let transport: any = null;
const mock = env.mockEmail || !env.emailEnabled;

if (!mock && env.smtpHost && env.smtpUser && env.smtpPass) {
  transport = createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });
} else if (mock) {
  logger.info('EMAIL_MOCKED');
} else {
  logger.info('EMAIL_DISABLED');
}

export async function sendEmail(to: string, subject: string, body: string, html = false) {
  if (mock || !transport) {
    const dir = path.join('.outbox', 'email');
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}-${to}.txt`);
    fs.writeFileSync(file, `Subject: ${subject}\n\n${body}`);
    logger.info('EMAIL_MOCKED', { to, file });
    return;
  }
  await transport.sendMail({
    to,
    subject,
    from: env.smtpFrom,
    [html ? 'html' : 'text']: body,
  });
}

export default { sendEmail };
