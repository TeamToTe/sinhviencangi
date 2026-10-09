import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { placesService } from '../services/placesService.js';

export const healthRouter = Router();

// GET /api/health
healthRouter.get('/health', async (_req: Request, res: Response): Promise<void> => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: db.isPostgres ? 'PostgreSQL/Supabase' : 'SQLite (Embedded)',
    service: 'ConnectHub Hola Map Backend API',
  });
});

// GET /api/stats (Survey progress and KPI statistics)
healthRouter.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await placesService.getSurveyStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Stats error', message: err.message });
  }
});
