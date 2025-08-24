#!/usr/bin/env node
const fetch = global.fetch;

const args = process.argv.slice(2);
let url = null;
let timeout = 30000;
let retry = 1000;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--url') url = args[++i];
  else if (a === '--timeout') timeout = parseInt(args[++i], 10);
  else if (a === '--retry') retry = parseInt(args[++i], 10);
}

if (!url) {
  console.error('wait.cjs: missing --url');
  process.exit(1);
}

const deadline = Date.now() + timeout;

async function attempt() {
  if (Date.now() > deadline) {
    console.error('WAIT_TIMEOUT');
    process.exit(1);
  }
  try {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), retry);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(to);
    if (res.status === 200) {
      console.log('PASS wait');
      process.exit(0);
    }
  } catch {}
  setTimeout(attempt, retry);
}

attempt();
