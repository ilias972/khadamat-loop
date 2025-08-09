interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  filename?: string;
}

declare global {
  namespace Express {
    interface Request {
      file?: UploadedFile;
    }
  }
}

export {};

