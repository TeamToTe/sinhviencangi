import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';

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

// GET /api/stats
healthRouter.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const placesRes = await db.query('SELECT COUNT(*) as count FROM places');
    const reviewsRes = await db.query('SELECT COUNT(*) as count FROM reviews');
    const catsRes = await db.query('SELECT COUNT(*) as count FROM categories');
    const contribsRes = await db.query('SELECT COUNT(*) as count FROM contributions');

    res.json({
      totalPlaces: Number(placesRes.rows[0]?.count || 0),
      totalReviews: Number(reviewsRes.rows[0]?.count || 0),
      totalCategories: Number(catsRes.rows[0]?.count || 0),
      totalContributors: Number(contribsRes.rows[0]?.count || 0),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Stats error', message: err.message });
  }
});
