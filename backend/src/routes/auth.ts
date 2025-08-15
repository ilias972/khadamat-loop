import { Router } from 'express';
import { z } from 'zod';
import {
  register,
  login,
  profile,
  verifyMfa,
  refresh,
  logout,
  changePassword,
  requestPasswordReset,
  confirmResetPassword,
} from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import {
  loginLimiter,
  mfaLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  refreshLimiter,
  logoutLimiter,
  changePasswordLimiter,
} from '../middlewares/rateLimit';

const router = Router();

const RegisterSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email()
      .transform((s) => s.trim().toLowerCase()),
    password: z.string().min(8),
    firstName: z.string().min(1).transform((s) => s.trim()).optional(),
    lastName: z.string().min(1).transform((s) => s.trim()).optional(),
    role: z
      .enum(['CLIENT', 'PROVIDER', 'ADMIN'])
      .or(z.string())
      .transform((r) => {
        const up = String(r).trim().toUpperCase();
        if (!['CLIENT', 'PROVIDER', 'ADMIN'].includes(up)) throw new Error('Invalid role');
        return up as 'CLIENT' | 'PROVIDER' | 'ADMIN';
      })
      .optional(),
    phone: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email()
      .transform((s) => s.trim().toLowerCase()),
    password: z.string().min(8),
  }),
});

const mfaVerifySchema = z.object({
  body: z.object({
    code: z.string().optional(),
    recoveryCode: z.string().optional(),
  }).refine((d) => d.code || d.recoveryCode, {
    message: 'code or recoveryCode required',
  }),
});

const resetRequestSchema = z.object({
  body: z.object({
    email: z.string().email().transform((s) => s.trim().toLowerCase()),
  }),
});

const resetConfirmSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(8),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
  }),
});

const emptySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

router.post('/register', validate(RegisterSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh', refreshLimiter, validate(emptySchema), refresh);
router.post('/logout', logoutLimiter, validate(emptySchema), logout);
router.post('/change-password', authenticate, changePasswordLimiter, validate(changePasswordSchema), changePassword);
router.post('/reset-password', forgotPasswordLimiter, validate(resetRequestSchema), requestPasswordReset);
router.post('/reset-password/confirm', resetPasswordLimiter, validate(resetConfirmSchema), confirmResetPassword);
router.post('/mfa/verify', mfaLimiter, validate(mfaVerifySchema), verifyMfa);
router.get('/profile', authenticate, profile);

export default router;
