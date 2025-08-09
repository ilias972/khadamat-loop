import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(__dirname, '../../.env.test');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    const m = /^([^#=]+)=(.*)$/.exec(line.trim());
    if (m) {
      const key = m[1].trim();
      let value = m[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}
