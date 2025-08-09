import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));

app.get('/health', (_req, res) => {
  res.json({ success: true });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
