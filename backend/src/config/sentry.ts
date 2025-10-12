import type * as SentryType from '@sentry/node';

let Sentry: SentryType | null = null;

const setSentryInstance = (instance: SentryType | null) => {
  Sentry = instance;
};

export { Sentry, setSentryInstance };
