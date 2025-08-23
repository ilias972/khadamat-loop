#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dir = process.env.BACKUP_DIR || './backups';
const days = parseInt(process.env.BACKUP_RETENTION_DAYS || '14', 10);
const cutoff = Date.now() - days * 86400000;
if (!fs.existsSync(dir)) process.exit(0);
for (const f of fs.readdirSync(dir)) {
  const fp = path.join(dir, f);
  const stat = fs.statSync(fp);
  if (stat.isFile() && stat.mtimeMs < cutoff) {
    fs.unlinkSync(fp);
    console.log('removed', fp);
  }
}
