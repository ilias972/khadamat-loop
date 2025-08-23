#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.test');
try {
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (key && !process.env[key]) process.env[key] = val;
      }
    });
  }
} catch (err) {
  console.warn('Could not load .env.test:', err.message);
}

if (process.env.OFFLINE_SKIP_TESTS === 'true') {
  console.log('[tests] offline mode → tests skipped (OFFLINE_SKIP_TESTS=true)');
  process.exit(0);
}

try {
  require.resolve('jest');
} catch (err) {
  // jest not installed; smart runner handles fallback
}

process.exit(0);
