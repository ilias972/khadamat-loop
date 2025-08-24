const path = require('node:path');
const fs = require('node:fs');

const LOG_DIR = path.resolve(process.env.LOG_DIR || 'logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

module.exports = {
  apps: [
    {
      name: 'khadamat-backend',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3000 },
      error_file: path.join(LOG_DIR, 'pm2-error.log'),
      out_file: path.join(LOG_DIR, 'pm2-out.log'),
      log_file: path.join(LOG_DIR, 'pm2-combined.log'),
      time: true
    },
    {
      name: 'jobs',
      script: 'dist/server.js',
      instances: 1,
      env: { NODE_ENV: 'production', WORKER_ROLE: 'jobs', PORT: 3000 },
      error_file: path.join(LOG_DIR, 'pm2-jobs-error.log'),
      out_file: path.join(LOG_DIR, 'pm2-jobs-out.log'),
      log_file: path.join(LOG_DIR, 'pm2-jobs-combined.log'),
      time: true
    }
  ]
};
