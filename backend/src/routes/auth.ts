import { Router } from 'express';
import { z } from 'zod';
import { register, login, profile } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { loginLimiter } from '../middlewares/rateLimit';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['CLIENT', 'PROVIDER', 'ADMIN']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.get('/profile', authenticate, profile);

export default router;
