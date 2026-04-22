import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import authRoutes from './routes/auth.routes.js';
import modelsRoutes from './routes/models.routes.js';
import usersRoutes from './routes/users.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'] }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', publicLimiter, authRoutes);
app.use('/api/models', publicLimiter, modelsRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

export default app;
