#!/usr/bin/env node

try {
  require.resolve('jest');
} catch {
  if (process.env.OFFLINE_SKIP_TESTS === 'true') {
    console.log('[offline] jest absent → skip tests');
    process.exit(0);
  }
}

if (process.env.OFFLINE_SKIP_TESTS === 'true') {
  console.log('[offline] skip tests');
  process.exit(0);
}

process.exit(1);
