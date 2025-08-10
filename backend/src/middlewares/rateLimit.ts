import rateLimit from 'express-rate-limit';

function createLimiter(max: number, message: string, windowMs = 15 * 60 * 1000) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 429,
        message,
        timestamp: new Date().toISOString(),
      },
    },
  });
}

function parseWindow(text: string) {
  const m = /^(\d+)([smh])?$/.exec(text);
  if (!m) return 10 * 60 * 1000;
  const num = parseInt(m[1], 10);
  const unit = m[2] || 'm';
  switch (unit) {
    case 's': return num * 1000;
    case 'h': return num * 60 * 60 * 1000;
    default: return num * 60 * 1000;
  }
}

const mfaRate = process.env.MFA_RATE_LIMIT || '5:10m';
const [mfaCount, mfaWindow] = mfaRate.split(':');
const mfaWindowMs = parseWindow(mfaWindow || '10m');

export const loginLimiter = createLimiter(5, 'Too many login attempts, please try again later.');
export const paymentsLimiter = createLimiter(100, 'Too many requests, please try again later.');
export const mfaLimiter = createLimiter(parseInt(mfaCount, 10) || 5, 'Too many MFA attempts, please try again later.', mfaWindowMs);
export const forgotPasswordLimiter = createLimiter(3, 'Too many password reset requests, please try again later.');
export const resetPasswordLimiter = createLimiter(10, 'Too many password reset attempts, please try again later.');
