import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

const app: Express = express();

const clientUrl = env.CLIENT_URL;
const allowedOrigins = clientUrl ? clientUrl.split(',').map((url) => url.trim()) : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} is not allowed by CLIENT_URL`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint (Public / Unauthenticated)
app.get('/api/health', (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: {
      status: 'ok',
    },
  });
});

// Ticket REST API routes
app.use('/api', routes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
