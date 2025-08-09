import { createNotification } from '../services/notifications';

export async function notifyUser(userId: number, type: string, title: string, message: string, data?: any) {
  try {
    await createNotification(userId, type, title, message, data);
  } catch (err) {
    console.error('notifyUser error', err);
  }
}
