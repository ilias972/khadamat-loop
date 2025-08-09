import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscriptions';
import paymentRoutes from './routes/payments';
import { handleStripeWebhook } from './controllers/paymentController';
import providersRouter from './routes/providers';
import servicesRouter from './routes/services';
import bookingsRouter from './routes/bookings';

const app = express();

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));

app.get('/health', (_req, res) => {
  res.json({ success: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/providers', providersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
