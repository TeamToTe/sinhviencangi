import { Router, Request, Response } from 'express';
import { placesService } from '../services/placesService.js';

export const contributionsRouter = Router();

// GET /api/contributions
contributionsRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const contributors = await placesService.getContributors();
    res.json(contributors);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});
