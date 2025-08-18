import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

function mapStatus(status?: string) {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 'DELIVERED';
  if (s === 'failed') return 'FAILED';
  if (s === 'sent') return 'SENT';
  return undefined;
}

export async function smsWebhook(req: Request, res: Response) {
  try {
    const messageSid = (req.body.MessageSid || req.query.MessageSid) as string | undefined;
    const messageStatus = (req.body.MessageStatus || req.query.MessageStatus) as string | undefined;
    const messageId = (req.body.messageId || req.query.messageId) as string | undefined;
    const status = (req.body.status || req.query.status) as string | undefined;

    if (messageSid && messageStatus) {
      const mapped = mapStatus(messageStatus);
      if (mapped) {
        await prisma.smsMessage.updateMany({ where: { providerMessageId: messageSid }, data: { status: mapped } });
      }
    } else if (messageId && status) {
      const mapped = mapStatus(status);
      if (mapped) {
        await prisma.smsMessage.updateMany({ where: { providerMessageId: messageId }, data: { status: mapped } });
      }
    }
  } catch (err) {
    console.error('sms webhook error', err);
  }
  res.sendStatus(200);
}
