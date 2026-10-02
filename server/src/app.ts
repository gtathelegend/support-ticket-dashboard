import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
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
