import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { runKycRetentionJob } from './kycRetention';
import { runBookingExpiryJob } from './bookingExpiry';
import { jobsHeartbeatTotal } from '../metrics';

const lastRun: { retention?: string | null; backup?: string | null; heartbeat?: string | null } = {
  retention: null,
  backup: null,
  heartbeat: null,
};

let cron: any = null;

function schedule(spec: string, fn: () => void) {
  if (cron) {
    cron.schedule(spec, fn, { timezone: env.jobsTz });
    return;
  }
  // Fallback minimal scheduler (supports "*/m * * * *" and "m h * * *")
  const nextDelay = (s: string) => {
    const parts = s.trim().split(/\s+/);
    if (parts.length < 2) return null;
    const [minPart, hourPart] = parts;
    const now = new Date();
    const next = new Date(now.getTime());
    next.setSeconds(0, 0);
    if (minPart.startsWith('*/')) {
      const step = parseInt(minPart.slice(2), 10) || 1;
      const minute = Math.floor(now.getMinutes() / step) * step + step;
      if (minute >= 60) {
        next.setHours(next.getHours() + 1);
        next.setMinutes(0);
      } else {
        next.setMinutes(minute);
      }
    } else {
      const minute = parseInt(minPart, 10) || 0;
      next.setMinutes(minute);
      const hour = parseInt(hourPart, 10) || 0;
      next.setHours(hour);
      if (next <= now) next.setDate(next.getDate() + 1);
    }
    return next.getTime() - now.getTime();
  };
  const run = () => {
    fn();
    const d = nextDelay(spec);
    if (d != null) setTimeout(run, d);
  };
  const d = nextDelay(spec);
  if (d != null) setTimeout(run, d);
}

async function runBackupJob() {
  const script = path.resolve(__dirname, '../../scripts/db/backup.js');
  if (!fs.existsSync(script)) {
    logger.warn('job_backup_skipped', { reason: 'missing_script' });
    return;
  }
  await new Promise((resolve) => {
    const proc = spawn(process.execPath, [script], { cwd: path.resolve(__dirname, '..', '..') });
    let out = '';
    proc.stdout.on('data', (d) => (out += d.toString()));
    proc.stderr.on('data', (d) => (out += d.toString()));
    proc.on('close', (code) => {
      if (code === 0) {
        const m = out.match(/Backup saved to (\S+)/);
        if (m) {
          try {
            const file = m[1];
            const buf = fs.readFileSync(file);
            const sum = crypto.createHash('sha256').update(buf).digest('hex');
            logger.info('job_backup', { job: 'backup', checksum: sum });
          } catch (e) {
            logger.warn('job_backup_checksum_fail', { error: e.message });
          }
        }
        lastRun.backup = new Date().toISOString();
      } else {
        logger.warn('job_backup_skipped', { reason: out.trim() || 'unknown' });
      }
      resolve(null);
    });
  });
}

async function runRetentionJob() {
  try {
    const purgedCounts = await runKycRetentionJob();
    logger.info('job_retention', { job: 'retention', purgedCounts });
  } catch (e) {
    logger.error('job_retention_error', { error: (e as any)?.message });
  }
  lastRun.retention = new Date().toISOString();
}

function runHeartbeatJob() {
  jobsHeartbeatTotal?.labels({ job: 'scheduler' }).inc();
  logger.info('job_heartbeat', { job: 'heartbeat' });
  lastRun.heartbeat = new Date().toISOString();
}

export async function startSchedulers() {
  try {
    ({ default: cron } = await import('node-cron'));
  } catch {
    cron = null;
  }

  if (!env.jobsEnable) {
    logger.info('jobs_scheduler_disabled');
    return;
  }
  if (process.env.WORKER_ROLE && process.env.WORKER_ROLE !== 'jobs') {
    logger.info('jobs_scheduler_skipped', { role: process.env.WORKER_ROLE });
    return;
  }
  try {
    const spec = process.env.CRON_EXPIRE_SCHEDULE || '*/15 * * * *';
    schedule(spec, () => { runBookingExpiryJob().catch(() => {}); });
    schedule(env.jobsRetentionCron, () => { runRetentionJob(); });
    schedule(env.jobsBackupCron, () => { runBackupJob(); });
    schedule(env.jobsHeartbeatCron, () => { runHeartbeatJob(); });
    logger.info('jobs_scheduler_started', { tz: env.jobsTz });
  } catch (e) {
    logger.error('jobs_scheduler_failed', { error: (e as any)?.message });
  }
}

export function getJobsStatus() {
  return { enabled: env.jobsEnable, lastRun };
}
