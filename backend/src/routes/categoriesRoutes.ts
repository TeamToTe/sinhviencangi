import { Router, Request, Response } from 'express';
import { placesService } from '../services/placesService.js';

export const categoriesRouter = Router();

// GET /api/categories
categoriesRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await placesService.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});
