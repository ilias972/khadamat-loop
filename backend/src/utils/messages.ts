import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createSystemMessage({
  bookingId, senderId, receiverId, content
}: { bookingId?: number; senderId: number; receiverId: number; content: string; }) {
  const hasIsSystem = (prisma as any).message?.fields?.isSystem !== undefined;
  return prisma.message.create({
    data: {
      bookingId: bookingId ?? null,
      senderId,
      receiverId,
      content,
      ...(hasIsSystem ? { isSystem: true } : {})
    }
  });
}
