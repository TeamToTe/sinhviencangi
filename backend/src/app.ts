import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { placesRouter } from './routes/placesRoutes.js';
import { categoriesRouter } from './routes/categoriesRoutes.js';
import { reportsRouter } from './routes/reportsRoutes.js';
import { contributionsRouter } from './routes/contributionsRoutes.js';
import { healthRouter } from './routes/healthRoutes.js';
import { config } from './config.js';

export function createApp(): Express {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin,
      credentials: true,
    })
  );

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root welcome
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'ConnectHub Hola Map API',
      status: 'active',
      endpoints: {
        places: '/api/places',
        nearby: '/api/places/nearby?lat=21.0185&lng=105.5345&radius=1000',
        categories: '/api/categories',
        contributions: '/api/contributions',
        health: '/api/health',
        stats: '/api/stats',
      },
    });
  });

  // Mount API Routers under /api
  app.use('/api/places', placesRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/reports', reportsRouter);
  app.use('/api/contributions', contributionsRouter);
  app.use('/api', healthRouter);

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Endpoint ${req.method} ${req.originalUrl} không tồn tại trên hệ thống.`,
    });
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
      error: err.name || 'InternalServerError',
      message: err.message || 'Đã có lỗi xảy ra phía máy chủ.',
    });
  });

  return app;
}
