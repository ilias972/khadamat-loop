#!/usr/bin/env node
const { BACKEND_BASE_URL = 'https://api.khadamat.ma', ADMIN_BEARER_TOKEN } = process.env;
if (!ADMIN_BEARER_TOKEN) {
  console.log('SKIPPED admin:authz');
  process.exit(0);
}
(async () => {
  try {
    const url = `${BACKEND_BASE_URL}/api/admin/snapshot`;
    const r1 = await fetch(url);
    const r2 = await fetch(url, {
      headers: {
        Authorization: `Bearer ${ADMIN_BEARER_TOKEN}`,
        'X-Forwarded-For': '203.0.113.10',
      },
    });
    if (r1.status === 401 && r2.status === 403) {
      console.log('PASS admin:authz');
    } else {
      console.log(`FAIL admin:authz ${r1.status}/${r2.status}`);
      process.exit(1);
    }
  } catch (e) {
    console.log('FAIL admin:authz ' + e.message);
    process.exit(1);
  }
})();
