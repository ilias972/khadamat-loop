#!/usr/bin/env node
const fs = require('fs');
const path = process.env.ALERTS_RULES_PATH || 'deploy/monitoring/rules.yml';

if (!fs.existsSync(path)) {
  console.log('alerts.validate SKIPPED (missing file)');
  process.exit(0);
}
try {
  const content = fs.readFileSync(path, 'utf8');
  const required = ['APIHighLatencyP95', 'APIErrorsRate', 'WebhookDLQBacklog', 'SmsDLQBacklog'];
  const missing = required.filter((r) => !content.includes(`alert: ${r}`));
  if (missing.length) {
    console.log('alerts.validate FAIL missing ' + missing.join(','));
    process.exit(1);
  }
  console.log('alerts.validate PASS');
} catch (e) {
  console.log('alerts.validate FAIL ' + e.message);
  process.exit(1);
}
