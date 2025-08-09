import multer, { FileFilterCallback } from './multer';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Request } from 'express';

const uploadPath = process.env.UPLOAD_PATH || './uploads';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true, mode: 0o700 });
}

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: any,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadPath);
  },
  filename: (
    _req: Request,
    file: any,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const unique = randomUUID();
    cb(null, unique + path.extname(file.originalname));
  },
});

const allowed = (process.env.ALLOWED_MIME || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function fileFilter(_req: Request, file: any, cb: FileFilterCallback) {
  if (allowed.length > 0 && !allowed.includes(file.mimetype)) {
    const err: any = new Error('Invalid file type');
    err.status = 400;
    return cb(err, false);
  }
  cb(null, true);
}

const limits = {
  fileSize: Number(process.env.MAX_FILE_SIZE ?? 10_485_760),
};

export const uploadSingle = multer({ storage, fileFilter, limits }).single('file');

