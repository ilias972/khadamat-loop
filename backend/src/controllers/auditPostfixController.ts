import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../lib/prisma';
import { pingClamAV } from '../services/antivirus';
import { env } from '../config/env';

export async function getAuditPostfix(_req: Request, res: Response, next: NextFunction) {
  try {
    const dir = path.resolve(__dirname, '../../reports');
    let latest: any = null;
    try {
      const files = await fs.readdir(dir);
      const jsonFiles = files.filter((f) => f.startsWith('audit-') && f.endsWith('.json')).sort();
      if (jsonFiles.length) {
        const file = jsonFiles[jsonFiles.length - 1];
        const data = JSON.parse(await fs.readFile(path.join(dir, file), 'utf8'));
        const p0 = data.findings?.filter((f: any) => f.level === 'P0').length || 0;
        const p1 = data.findings?.filter((f: any) => f.level === 'P1').length || 0;
        const p2 = data.findings?.filter((f: any) => f.level === 'P2').length || 0;
        latest = { score: data.score, p0, p1, p2 };
      }
    } catch (e) {
      latest = null;
    }

    const avEnabled = process.env.UPLOAD_ANTIVIRUS === 'true';
    const avReachable = avEnabled ? await pingClamAV() : false;
    let dlqBacklog = 0;
    let lastWebhook: any = null;
    if (env.dlqEnable) {
      try {
        dlqBacklog = await prisma.webhookDLQ.count();
        lastWebhook = await prisma.webhookEvent.findFirst({ orderBy: { createdAt: 'desc' } });
      } catch (e) {
        dlqBacklog = 0;
        lastWebhook = null;
      }
    }
    const runtime = {
      av: { enabled: avEnabled, reachable: avReachable },
      dlq: { backlog: dlqBacklog },
      webhooks: lastWebhook
        ? { timestamp: lastWebhook.createdAt, retryCount: lastWebhook.retryCount ?? 0 }
        : null,
      corsActive: env.corsOrigins.length > 0 && !env.corsOrigins.includes('*'),
      cspActive: true,
      ipAllowList: process.env.NODE_ENV === 'production' ? env.adminIpAllowlist !== '' : true,
    };

    res.json({ success: true, data: { audit: latest, runtime } });
  } catch (err) {
    next(err);
  }
}
