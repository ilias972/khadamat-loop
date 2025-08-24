import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';

export async function getAuditSummary(_req: Request, res: Response, next: NextFunction) {
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
        latest = {
          score: data.score,
          generatedAt: data.generatedAt,
          p0,
          p1,
          p2,
          findings: data.findings || []
        };
      }
    } catch (e) {
      latest = null;
    }
    res.json({ success: true, data: latest });
  } catch (err) {
    next(err);
  }
}
