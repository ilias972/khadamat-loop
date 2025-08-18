import { prisma } from '../lib/prisma';

export async function createNotification(
  userId: number,
  type: string,
  title: string,
  message: string,
  data?: Record<string, any>
) {
  return prisma.notification.create({ data: { userId, type, title, message, data: data ? JSON.stringify(data) : null } });
}
