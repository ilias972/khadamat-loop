import cron from 'node-cron';
import { runBookingExpiryJob } from './bookingExpiry';
export function startSchedulers() {
  const spec = process.env.CRON_EXPIRE_SCHEDULE || '*/15 * * * *';
  cron.schedule(spec, () => { runBookingExpiryJob().catch(()=>{}); });
}
