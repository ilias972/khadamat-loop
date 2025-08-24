#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { GO_LIVE_REQUIRE_ALERTS_RULES = 'false' } = process.env;
if (GO_LIVE_REQUIRE_ALERTS_RULES !== 'true') {
  console.log('SKIPPED alerts');
  process.exit(0);
}
try {
  const dir = path.resolve(__dirname, '../../ops/alerts');
  const has = fs.existsSync(dir) && fs.readdirSync(dir).some((f) => f.endsWith('.yml'));
  if (has) {
    console.log('PASS alerts:rules');
  } else {
    console.log('FAIL alerts:rules');
    process.exit(1);
  }
} catch (e) {
  console.log('FAIL alerts:' + e.message);
  process.exit(1);
}
