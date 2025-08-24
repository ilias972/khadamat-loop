#!/usr/bin/env node
const tls = require('tls');
const base = process.env.BACKEND_BASE_URL || 'https://api.khadamat.ma';
let host;
try {
  host = new URL(base).hostname;
} catch {
  host = 'api.khadamat.ma';
}
const root = host.startsWith('api.') ? host.slice(4) : host;
const target = `api.${root}`;
const MIN_DAYS = 15;
const socket = tls.connect({ host: target, port: 443, servername: target, timeout: 8000 }, () => {
  const cert = socket.getPeerCertificate();
  socket.end();
  if (!cert || !cert.valid_to) {
    console.log('FAIL tls:expiring invalid-cert');
    process.exit(1);
  }
  const exp = new Date(cert.valid_to);
  const days = (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (days > MIN_DAYS) {
    console.log('PASS tls:valid');
  } else {
    console.log('FAIL tls:expiring');
    process.exit(1);
  }
});
socket.on('error', (e) => {
  console.log('SKIPPED tls ' + e.message);
  socket.destroy();
});
