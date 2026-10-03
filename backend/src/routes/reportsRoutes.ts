import { Router, Request, Response } from 'express';
import { placesService } from '../services/placesService.js';
import type { CreateReportDto } from '../types/place.js';

export const reportsRouter = Router();

// POST /api/reports
reportsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const dto: CreateReportDto = req.body;
    if (!dto.reason || !dto.note) {
      res.status(400).json({ error: 'Validation Error', message: 'Lý do báo cáo và nội dung ghi chú là bắt buộc' });
      return;
    }

    const result = await placesService.createReport(dto);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});
