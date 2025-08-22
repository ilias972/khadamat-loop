import { createNotification } from '../services/notifications';

export async function notifyUser(
  userId: number,
  type: string,
  title: string,
  message: string,
  data?: any,
  tx?: any
) {
  try {
    await createNotification(userId, type, title, message, data, tx);
  } catch (err) {
    console.error('notifyUser error', err);
  }
}
