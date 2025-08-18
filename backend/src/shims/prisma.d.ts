// Compilation sans @prisma/client (types minimaux pour ne pas bloquer le build)
declare module '@prisma/client' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface PrismaClientOptions {}
  export namespace Prisma {
    class PrismaClientKnownRequestError extends Error {
      code: string;
    }
  }
  export class PrismaClient {
    constructor(options?: PrismaClientOptions);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
  }
}
