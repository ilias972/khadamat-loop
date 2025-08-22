import { prisma } from '../lib/prisma';

export async function createSystemMessage(
  {
    bookingId,
    senderId,
    receiverId,
    content,
  }: { bookingId?: number; senderId: number; receiverId: number; content: string },
  tx: any = prisma
) {
  const hasIsSystem = (prisma as any).message?.fields?.isSystem !== undefined;
  return tx.message.create({
    data: {
      bookingId: bookingId ?? null,
      senderId,
      receiverId,
      content,
      ...(hasIsSystem ? { isSystem: true } : {}),
    },
  });
}
