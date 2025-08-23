import { createTransport } from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

let transport: any = null;

if (env.emailEnabled && env.smtpHost && env.smtpUser && env.smtpPass) {
  transport = createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });
} else {
  logger.info('EMAIL_DISABLED');
}

export async function sendEmail(to: string, subject: string, body: string, html = false) {
  if (!transport) {
    logger.info('EMAIL_DISABLED');
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
