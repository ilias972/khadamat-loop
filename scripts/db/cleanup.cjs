const fs = require('fs');
const path = require('path');

const dir = process.env.BACKUP_DIR || './backups';
const days = parseInt(process.env.BACKUP_RETENTION_DAYS || '14', 10);
if (!fs.existsSync(dir)) process.exit(0);
const now = Date.now();
fs.readdirSync(dir).forEach((f) => {
  const file = path.join(dir, f);
  try {
    const stat = fs.statSync(file);
    const age = (now - stat.mtimeMs) / 86400000;
    if (age > days) {
      fs.unlinkSync(file);
      console.log('BACKUP_DELETED', { file });
    }
  } catch {}
});
