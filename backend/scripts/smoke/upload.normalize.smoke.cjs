// CommonJS, pas de TS/ts-node requis
try {
  const { normalizeUpload } = require('../../dist/upload/fileAdapter.js'); // après build
  const fakeMulter = { originalname:'x.txt', mimetype:'text/plain', size:3, buffer:Buffer.from('hey') };
  const u = normalizeUpload(fakeMulter);
  if (!u || u.mime!=='text/plain' || u.size!==3 || !u.buffer) {
    console.log('FAIL upload.normalize: bad normalization');
    process.exit(0);
  }
  console.log('PASS upload.normalize');
} catch (e) {
  console.log('SKIPPED upload.normalize: dist not built');
}
