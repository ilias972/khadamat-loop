import { readFileSync, existsSync } from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env.test');
if (existsSync(envPath)) {
  const env = readFileSync(envPath, 'utf8');
  env.split('\n').forEach(line => {
    const m = line.match(/^([^#=]+)=\"?(.*)\"?$/);
    if (m) {
      const key = m[1].trim();
      const val = m[2].trim();
      if (key && !process.env[key]) process.env[key] = val;
    }
  });
}

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';
process.env.DEMO_ACCOUNTS_ENABLED = 'false';
process.env.ADMIN_TOTP_REQUIRED = 'false';

jest.mock('../services/sms', () => ({ sendSMS: jest.fn(async () => ({ ok: true })) }));
jest.mock('../services/notifications', () => ({ createNotification: jest.fn(async () => ({ id: 1 })) }));
