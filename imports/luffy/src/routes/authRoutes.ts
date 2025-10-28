import {Router} from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { login, signup } from '../controllers/authController';

const authRoutes:Router = Router()

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/me', authMiddleware)

export default authRoutes