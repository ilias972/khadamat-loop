const stage = process.env.STAGE || process.env.NODE_ENV;
if (stage === 'prod' && process.env.DEMO_ALLOW_IN_PROD !== 'true') {
  console.error('Demo scripts are disabled in production. Set DEMO_ALLOW_IN_PROD=true to override.');
  process.exit(1);
}
if (process.env.DEMO_ENABLE !== 'true') {
  console.error('Demo scripts are disabled. Set DEMO_ENABLE=true to run.');
  process.exit(1);
}
if (process.env.OFFLINE_MODE === 'true') {
  console.error('Demo scripts require online mode. OFFLINE_MODE must be false.');
  process.exit(1);
}
