import { Router } from 'express';
import { z } from 'zod';
import { register, login, profile, verifyMfa, forgotPassword, resetPassword } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { loginLimiter, mfaLimiter, forgotPasswordLimiter, resetPasswordLimiter } from '../middlewares/rateLimit';

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

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().transform((s) => s.trim().toLowerCase()),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(8),
  }),
});

router.post('/register', validate(RegisterSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/forgot-password', forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', resetPasswordLimiter, validate(resetPasswordSchema), resetPassword);
router.post('/mfa/verify', mfaLimiter, validate(mfaVerifySchema), verifyMfa);
router.get('/profile', authenticate, profile);

export default router;
