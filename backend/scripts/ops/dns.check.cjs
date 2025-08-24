#!/usr/bin/env node
const dns = require('dns').promises;
async function check(host, label) {
  try {
    const records = [];
    records.push(...await dns.resolve4(host).catch(() => []));
    records.push(...await dns.resolve6(host).catch(() => []));
    records.push(...await dns.resolveCname(host).catch(() => []));
    if (records.length) {
      console.log(`PASS dns:${label} ${records.join(',')}`);
    } else {
      console.log(`SKIPPED dns:${label} no-records`);
    }
  } catch (e) {
    console.log(`SKIPPED dns:${label} ${e.code || e.message}`);
  }
}
(async () => {
  await check('api.khadamat.ma', 'api');
  await check('www.khadamat.ma', 'www');
})();
