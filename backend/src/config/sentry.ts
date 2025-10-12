type SentryModule = typeof import('@sentry/node');

let Sentry: SentryModule | null = null;

const setSentryInstance = (instance: SentryModule | null) => {
  Sentry = instance;
};

export { Sentry, setSentryInstance };
