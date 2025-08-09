import cron from 'node-cron';
import { runBookingExpiryJob } from './bookingExpiry';
import { runKycRetentionJob } from './kycRetention';
export function startSchedulers() {
  const spec = process.env.CRON_EXPIRE_SCHEDULE || '*/15 * * * *';
  cron.schedule(spec, () => { runBookingExpiryJob().catch(()=>{}); });
  cron.schedule('0 0 * * *', () => { runKycRetentionJob().catch(()=>{}); });
}
