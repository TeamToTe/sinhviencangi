import { Router, Request, Response } from 'express';
import { placesService } from '../services/placesService.js';
import { requireAdmin, type AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { reportRateLimiter } from '../middleware/rateLimiter.js';
import type { CreateReportDto } from '../types/place.js';

export const reportsRouter = Router();

// GET /api/reports (Admin only - List all reported issues)
reportsRouter.get('/', requireAdmin, async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const reports = await placesService.getReports();
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// POST /api/reports (Public - Submit report about place data error)
reportsRouter.post('/', reportRateLimiter, async (req: Request, res: Response): Promise<void> => {
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

// PATCH /api/reports/:id (Admin only - Mark report as resolved or updated)
reportsRouter.patch('/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!status || !['pending', 'resolved'].includes(status)) {
      res.status(400).json({ error: 'Validation Error', message: 'Trạng thái status phải là "pending" hoặc "resolved"' });
      return;
    }

    const targetId = Array.isArray(id) ? id[0] : id;
    const updated = await placesService.updateReportStatus(targetId, status, adminNote);
    if (!updated) {
      res.status(404).json({ error: 'Not Found', message: 'Không tìm thấy báo cáo với ID đã cho' });
      return;
    }

    res.json({ success: true, message: 'Đã cập nhật trạng thái báo cáo thành công' });
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});
