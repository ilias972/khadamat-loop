jest.mock('../services/sms', () => ({ sendSMS: jest.fn(async () => ({ ok: true })) }));
jest.mock('../services/notifications', () => ({ createNotification: jest.fn(async () => ({ id: 1 })) }));
