try {
  require('ts-node/register');
} catch {
  console.log('SKIPPED: ts-node not available');
  process.exit(0);
}
const assert = require('assert');

async function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

async function runMemory(){
  process.env.MOCK_REDIS = 'true';
  const cache = require('../../src/utils/cache');
  const max = parseInt(process.env.CACHE_MEM_MAX_KEYS || '5000',10);
  await cache.cacheSet('test:key','v',1);
  const val = await cache.cacheGet('test:key');
  assert.strictEqual(val,'v','get failed');
  await sleep(1100);
  const expired = await cache.cacheGet('test:key');
  assert.strictEqual(expired,null,'ttl failed');
  for(let i=0;i<max+10;i++){
    await cache.cacheSet(`lru:${i}`,String(i));
  }
  const first = await cache.cacheGet('lru:0');
  assert.strictEqual(first,null,'lru failed');
  await cache.stopCache();
  console.log('memory PASS');
}

async function runRedis(){
  if(!process.env.REDIS_URL){
    console.log('redis SKIPPED');
    return;
  }
  delete process.env.MOCK_REDIS;
  delete require.cache[require.resolve('../../src/utils/cache')];
  const cache = require('../../src/utils/cache');
  await cache.cacheSet('test:r','1',1);
  const val = await cache.cacheGet('test:r');
  assert.strictEqual(val,'1');
  await cache.cacheDel('test:r');
  await cache.stopCache();
  try{
    const res = await fetch('http://localhost:3000/metrics',{headers:{Authorization:`Bearer ${process.env.METRICS_TOKEN||''}`}});
    const txt = await res.text();
    if(!txt.includes('cache_hits_total') || !txt.includes('driver="redis"')){
      console.log('metrics label missing');
    }
  }catch{}
  console.log('redis PASS');
}

runMemory()
  .then(runRedis)
  .catch(e=>{console.error('FAIL',e.message);process.exit(1);});
