import { RequestHandler } from 'express';

export type FileFilterCallback = (error: any, acceptFile: boolean) => void;

export function diskStorage(opts: any) {
  return opts;
}

export default function multer(_opts: any) {
  return {
    single(_field: string): RequestHandler {
      return (_req, _res, next) => next();
    },
  };
}

multer.diskStorage = diskStorage;

