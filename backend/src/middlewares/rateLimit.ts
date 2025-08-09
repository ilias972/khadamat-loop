import rateLimit from 'express-rate-limit';

function createLimiter(max: number, message: string) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
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

export const loginLimiter = createLimiter(5, 'Too many login attempts, please try again later.');
export const paymentsLimiter = createLimiter(100, 'Too many requests, please try again later.');
