import { Router } from 'express';
import { z } from 'zod';
import { register, login, profile } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { loginLimiter } from '../middlewares/rateLimit';

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

router.post('/register', validate(RegisterSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.get('/profile', authenticate, profile);

export default router;
