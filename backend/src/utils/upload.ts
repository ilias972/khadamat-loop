import multer, { FileFilterCallback } from './multer';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_STORAGE_DIR || './uploads');

const maxBytes = (parseInt(process.env.UPLOAD_MAX_MB || '10', 10)) * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: any,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const now = new Date();
    const dest = path.join(
      UPLOAD_DIR,
      String(now.getFullYear()),
      String(now.getMonth() + 1).padStart(2, '0')
    );
    fs.mkdirSync(dest, { recursive: true, mode: 0o700 });
    cb(null, dest);
  },
  filename: (
    _req: Request,
    file: any,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path
      .extname(file.originalname || '')
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '');
    const unique = randomUUID();
    cb(null, `${unique}${ext}`);
  },
});

const allowed = (process.env.UPLOAD_ALLOWED_MIME || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function fileFilter(_req: Request, file: any, cb: FileFilterCallback) {
  if (allowed.length > 0 && !allowed.includes(file.mimetype)) {
    const err: any = new Error('Invalid file type');
    err.status = 415;
    return cb(err, false);
  }
  cb(null, true);
}

const limits = {
  fileSize: maxBytes,
};

const baseUpload = multer({ storage, fileFilter, limits }).single('file');

export function uploadSingle(req: Request, res: Response, next: NextFunction) {
  baseUpload(req, res, (err: any) => {
    if (!err && req.file) {
      logger.info('file-upload', {
        userId: req.user?.id,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        route: req.originalUrl,
      });
    }
    next(err);
  });
}

