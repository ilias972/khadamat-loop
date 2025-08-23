const net = require('net');
const HOST = process.env.CLAMAV_HOST || 'localhost';
const PORT = parseInt(process.env.CLAMAV_PORT || '3310', 10);
const TIMEOUT = parseInt(process.env.AV_TIMEOUT_MS || '8000', 10);

const enabled = process.env.UPLOAD_ANTIVIRUS === 'true';
if (!enabled) {
  console.log('SKIPPED av-selftest');
  process.exit(0);
}

const eicar = Buffer.from('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*', 'ascii');

function send() {
  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: HOST, port: PORT });
    let done = false;
    const fail = (err) => { if (!done) { done = true; reject(err); } };
    socket.setTimeout(TIMEOUT, fail);
    socket.on('error', fail);
    socket.on('connect', () => {
      socket.write('nINSTREAM\n');
      const size = Buffer.alloc(4);
      size.writeUInt32BE(eicar.length, 0);
      socket.write(size);
      socket.write(eicar);
      const zero = Buffer.alloc(4);
      zero.writeUInt32BE(0, 0);
      socket.write(zero);
    });
    socket.on('data', (buf) => {
      done = true;
      socket.end();
      resolve(buf.toString());
    });
  });
}

send()
  .then((msg) => {
    if (msg.includes('FOUND')) {
      console.log('PASS av-selftest');
    } else {
      console.log('FAIL av-selftest:', msg.trim());
      process.exitCode = 1;
    }
  })
  .catch((e) => {
    console.log('FAIL av-selftest:', e.message);
    process.exitCode = 1;
  });
