// Étendre proprement sans nécessiter @types externes.
declare namespace Express {
  namespace Multer {
    interface File {
      destination?: string;
      filename?: string;
      path?: string;        // certains storages l’exposent, on la rend optionnelle
      buffer?: Buffer;      // mémoire
    }
  }
}

declare module 'express-fileupload' {
  export interface UploadedFile {
    name: string;
    mimetype: string;
    size: number;
    md5?: string;
    data?: Buffer;         // si not useTempFiles
    tempFilePath?: string; // si useTempFiles = true
    mv?: (dest: string, cb: (err?: any) => void) => void;
  }
}
