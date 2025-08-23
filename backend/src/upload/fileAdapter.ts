import path from 'node:path';
import fs from 'node:fs/promises';
import { logger } from '../config/logger';

export type NormalizedUpload = {
  originalName: string;
  mime: string;
  size: number;
  // Emplacement temporaire si dispo (multer disk ou express-fileupload useTempFiles)
  tempPath?: string;
  // Buffer si en mémoire (multer memory ou express-fileupload data)
  buffer?: Buffer;
};

// Détecte Multer
function isMulterFile(f: any): f is Express.Multer.File {
  return !!f && (typeof f.originalname === 'string' || typeof f.fieldname === 'string') && typeof f.mimetype === 'string';
}

// Détecte express-fileupload
function isEFUFile(f: any): f is import('express-fileupload').UploadedFile {
  return !!f && typeof f.mimetype === 'string' && (typeof f.name === 'string') && ('mv' in f || 'data' in f || 'tempFilePath' in f);
}

// Normalise un fichier unique issu de req.file || req.files[<key>]
export function normalizeUpload(file: any): NormalizedUpload | null {
  if (!file) return null;

  // Multer
  if (isMulterFile(file)) {
    const originalName = (file as any).originalname ?? (file as any).filename ?? 'file';
    const tempPath =
      (file as any).path // certains storages la fournissent
      ?? ((file as any).destination && (file as any).filename
          ? path.join((file as any).destination, (file as any).filename)
          : undefined);

    const buffer: Buffer | undefined = (file as any).buffer;

    return {
      originalName,
      mime: (file as any).mimetype,
      size: Number((file as any).size || (buffer?.length ?? 0)),
      tempPath,
      buffer,
    };
  }

  // express-fileupload
  if (isEFUFile(file)) {
    const ef = file as import('express-fileupload').UploadedFile;
    const tempPath = ef.tempFilePath;
    const buffer = ef.data;
    return {
      originalName: ef.name,
      mime: ef.mimetype,
      size: ef.size,
      tempPath,
      buffer,
    };
  }

  return null;
}

// Écrit le fichier normalisé vers un chemin cible (crée les dossiers)
export async function persistNormalizedUpload(
  up: NormalizedUpload,
  targetAbsolutePath: string
) {
  await fs.mkdir(path.dirname(targetAbsolutePath), { recursive: true });

  if (up.tempPath) {
    // Déplacer (rename) si même volume, sinon copier puis supprimer
    try {
      await fs.rename(up.tempPath, targetAbsolutePath);
      logger.info({ event: 'upload.persist', driver: process.env.UPLOAD_DRIVER || 'auto', tmp: !!up.tempPath, buf: !!up.buffer, size: up.size });
      return;
    } catch {
      const data = await fs.readFile(up.tempPath);
      await fs.writeFile(targetAbsolutePath, data);
      try { await fs.unlink(up.tempPath); } catch {}
      logger.info({ event: 'upload.persist', driver: process.env.UPLOAD_DRIVER || 'auto', tmp: !!up.tempPath, buf: !!up.buffer, size: up.size });
      return;
    }
  }

  if (up.buffer) {
    await fs.writeFile(targetAbsolutePath, up.buffer);
    logger.info({ event: 'upload.persist', driver: process.env.UPLOAD_DRIVER || 'auto', tmp: !!up.tempPath, buf: !!up.buffer, size: up.size });
    return;
  }

  throw new Error('NO_UPLOAD_DATA');
}
