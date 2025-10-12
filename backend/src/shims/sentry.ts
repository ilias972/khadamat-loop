interface SentryHandlers {
  requestHandler(): (req: any, res: any, next: any) => any;
  errorHandler(): (err: any, req: any, res: any, next: any) => any;
}
interface SentryModule {
  init(options: Record<string, unknown>): void;
  Handlers: SentryHandlers;
}

let sentryModule: SentryModule | null = null;
let sentryAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  sentryModule = require('@sentry/node');
  sentryAvailable = true;
} catch {
  sentryModule = {
    init: () => {},
    Handlers: {
      requestHandler: () => (_req, _res, next) => next(),
      errorHandler: () => (err, _req, _res, next) => next(err),
    },
  };
}

export { sentryModule as SentryNode, sentryAvailable };
