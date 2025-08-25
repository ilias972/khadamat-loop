import net from 'node:net';
import fs from 'node:fs';
import { logger } from '../config/logger';
import { NormalizedUpload } from '../upload/fileAdapter';
import path from 'node:path';

const AV_HOST = process.env.CLAMAV_HOST || 'localhost';
const AV_PORT = parseInt(process.env.CLAMAV_PORT || '3310', 10);
const AV_TIMEOUT = parseInt(process.env.AV_TIMEOUT_MS || '8000', 10);
const AV_MAX_BYTES = (parseInt(process.env.AV_MAX_FILE_MB || '10', 10)) * 1024 * 1024;

export async function pingClamAV(): Promise<boolean> {
  try {
    return await new Promise<boolean>((resolve) => {
      const socket = net.connect({ host: AV_HOST, port: AV_PORT }, () => {
        socket.write('PING\n');
      });
      socket.setTimeout(AV_TIMEOUT, () => {
        socket.destroy();
        resolve(false);
      });
      socket.on('data', (d) => {
        resolve(d.toString().includes('PONG'));
        socket.end();
      });
      socket.on('error', () => resolve(false));
    });
  } catch {
    return false;
  }
}

export type ScanVerdict = 'clean' | 'infected' | 'error';

export async function scanUpload(up: NormalizedUpload): Promise<ScanVerdict> {
  const size = up.size;
  if (size > AV_MAX_BYTES) {
    // Already limited by upload middleware; skip scan
    return 'clean';
  }
  const data: Buffer | null = up.buffer || (up.tempPath ? await fs.promises.readFile(up.tempPath) : null);
  if (!data) return 'clean';

  return new Promise<ScanVerdict>((resolve) => {
    const socket = net.connect({ host: AV_HOST, port: AV_PORT });
    let resolved = false;
    const onError = () => {
      if (!resolved) {
        resolved = true;
        resolve('error');
      }
    };
    socket.setTimeout(AV_TIMEOUT, onError);
    socket.on('error', onError);
    socket.on('connect', () => {
      socket.write('nINSTREAM\n');
      let offset = 0;
      while (offset < data.length) {
        const chunk = data.subarray(offset, offset + 1024 * 32);
        const sizeBuf = Buffer.alloc(4);
        sizeBuf.writeUInt32BE(chunk.length, 0);
        socket.write(sizeBuf);
        socket.write(chunk);
        offset += chunk.length;
      }
      const zero = Buffer.alloc(4);
      zero.writeUInt32BE(0, 0);
      socket.write(zero);
    });
    socket.on('data', (buf) => {
      if (resolved) return;
      const msg = buf.toString();
      resolved = true;
      socket.end();
      if (msg.includes('FOUND')) resolve('infected');
      else if (msg.includes('OK')) resolve('clean');
      else resolve('error');
    });
  });
}

export async function quarantineUpload(up: NormalizedUpload, qPath: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(qPath), { recursive: true, mode: 0o700 });
  if (up.tempPath) {
    try {
      await fs.promises.rename(up.tempPath, qPath);
      return;
    } catch {}
  }
  if (up.buffer) {
    await fs.promises.writeFile(qPath, up.buffer);
  }
  try {
    if (up.tempPath) await fs.promises.unlink(up.tempPath);
  } catch {}
  logger.warn({ event: 'av.quarantine', path: qPath });
}
