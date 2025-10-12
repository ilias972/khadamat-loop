import type { IncomingMessage, ServerResponse } from 'http';

declare interface UploadedFile {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

declare module 'express-serve-static-core' {
  interface Request extends IncomingMessage {
    body: any;
    params: any;
    query: any;
    headers: Record<string, any>;
    method: string;
    originalUrl: string;
    user?: { id: string; role?: string; mfa?: boolean };
    ip?: string;
    ipAddress?: string;
    id?: string;
    file?: UploadedFile;
    files?: Record<string, UploadedFile | UploadedFile[]> | UploadedFile[];
    [key: string]: any;
  }

  interface Response extends ServerResponse {
    json(body?: any): Response;
    status(code: number): Response;
    send(body?: any): Response;
    end(body?: any): Response;
    set(field: string, value: string): Response;
    setHeader(field: string, value: string): void;
    redirect(status: number, url: string): void;
    redirect(url: string): void;
    locals: Record<string, any>;
  }

  type NextFunction = (err?: any) => void;

  type RequestHandler<P = any, ResBody = any, ReqBody = any, ReqQuery = any> = (
    req: Request & { params: P; body: ReqBody; query: ReqQuery },
    res: Response,
    next: NextFunction
  ) => any;

  type ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => any;

  interface Router {
    (req: Request, res: Response, next: NextFunction): void;
    use(...handlers: Array<RequestHandler | ErrorRequestHandler | Router>): Router;
    get(path: string | RegExp, ...handlers: Array<RequestHandler | ErrorRequestHandler>): Router;
    post(path: string | RegExp, ...handlers: Array<RequestHandler | ErrorRequestHandler>): Router;
    put(path: string | RegExp, ...handlers: Array<RequestHandler | ErrorRequestHandler>): Router;
    delete(path: string | RegExp, ...handlers: Array<RequestHandler | ErrorRequestHandler>): Router;
    patch(path: string | RegExp, ...handlers: Array<RequestHandler | ErrorRequestHandler>): Router;
    options(path: string | RegExp, ...handlers: Array<RequestHandler | ErrorRequestHandler>): Router;
    all(path: string | RegExp, ...handlers: Array<RequestHandler | ErrorRequestHandler>): Router;
    param(name: string, handler: (req: Request, res: Response, next: NextFunction, value: string) => any): Router;
  }

  interface Application extends Router {
    listen(port: number, hostname?: string, backlog?: number, callback?: () => void): any;
    set(setting: string, value: any): this;
    disable(setting: string): this;
    enable(setting: string): this;
  }

  interface Express extends Application {}
}

declare module 'express' {
  import type {
    Application,
    Express,
    NextFunction,
    Request,
    RequestHandler,
    Response,
    Router,
  } from 'express-serve-static-core';

  interface ExpressExport {
    (): Application;
    Router(options?: any): Router;
    json(...args: any[]): RequestHandler;
    urlencoded(...args: any[]): RequestHandler;
    raw(...args: any[]): RequestHandler;
    text(...args: any[]): RequestHandler;
  }

  type RouterFunction = (options?: any) => Router;
  type BodyParserFunction = (...args: any[]) => RequestHandler;

  const express: ExpressExport & {
    Router: RouterFunction;
    json: BodyParserFunction;
    urlencoded: BodyParserFunction;
    raw: BodyParserFunction;
    text: BodyParserFunction;
  };

  namespace express {
    export type Application = import('express-serve-static-core').Application;
    export type Express = import('express-serve-static-core').Express;
    export type Request = import('express-serve-static-core').Request;
    export type Response = import('express-serve-static-core').Response;
    export type NextFunction = import('express-serve-static-core').NextFunction;
    export type RequestHandler<P = any, ResBody = any, ReqBody = any, ReqQuery = any> = import('express-serve-static-core').RequestHandler<
      P,
      ResBody,
      ReqBody,
      ReqQuery
    >;
    export type Router = import('express-serve-static-core').Router;
  }

  export default express;
  export { Application, Express, NextFunction, Request, RequestHandler, Response };
  export const Router: RouterFunction;
  export const json: BodyParserFunction;
  export const urlencoded: BodyParserFunction;
  export const raw: BodyParserFunction;
  export const text: BodyParserFunction;
}

declare module 'cors' {
  import type { RequestHandler } from 'express-serve-static-core';
  type CorsOptions = Record<string, any>;
  type CorsOptionsDelegate = (req: import('express-serve-static-core').Request, callback: (err: Error | null, options?: CorsOptions) => void) => void;
  interface Cors extends RequestHandler {
    (req: import('express-serve-static-core').Request, res: import('express-serve-static-core').Response, next: import('express-serve-static-core').NextFunction): any;
  }
  interface CorsStatic {
    (options?: CorsOptions | CorsOptionsDelegate): RequestHandler;
    CorsOptions: CorsOptions;
    CorsOptionsDelegate: CorsOptionsDelegate;
  }
  const cors: CorsStatic;
  export = cors;
}

declare module 'cookie-parser' {
  import type { RequestHandler } from 'express-serve-static-core';
  interface CookieParseOptions {
    decode?(val: string): string;
  }
  interface CookieParser {
    (secret?: string | string[], options?: CookieParseOptions): RequestHandler;
    JSONCookie(str: string): Record<string, any> | string;
    JSONCookies(cookies: Record<string, any>): Record<string, any>;
    signedCookie(value: string, secret: string | string[]): string | false;
    signedCookies(cookies: Record<string, any>, secret: string | string[]): Record<string, any>;
  }
  const parser: CookieParser;
  export = parser;
}

declare module 'express-rate-limit' {
  import type { NextFunction, Request, RequestHandler, Response } from 'express-serve-static-core';
  interface RateLimitOptions {
    windowMs?: number;
    max?: number | ((req: Request, res: Response) => number | Promise<number>);
    limit?: number;
    message?: any;
    statusCode?: number;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    keyGenerator?: (req: Request, res: Response) => string;
    handler?: (req: Request, res: Response, next: NextFunction, options: RateLimitOptions) => void;
    skip?: (req: Request, res: Response) => boolean;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  }
  interface RateLimitRequestHandler extends RequestHandler {
    resetKey(key: string): void;
  }
  function rateLimit(options?: RateLimitOptions): RateLimitRequestHandler;
  export = rateLimit;
}

declare global {
  namespace Express {
    interface Request extends import('express-serve-static-core').Request {}
    namespace Multer {
      interface File extends UploadedFile {}
    }
  }
}

export {};
