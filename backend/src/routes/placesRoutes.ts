import { Router, Request, Response } from 'express';
import { placesService, detectAreaFromCoordinates } from '../services/placesService.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import type { FilterParams, CreatePlaceDto, CreateReviewDto } from '../types/place.js';

export const placesRouter = Router();

// GET /api/places/template (14-question survey metadata for surveyors)
placesRouter.get('/template', async (_req: Request, res: Response): Promise<void> => {
  try {
    const template = await placesService.getSurveyTemplate();
    res.json(template);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// POST /api/places/detect-area (Auto-detect area from GPS coordinates)
placesRouter.post('/detect-area', async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = parseFloat(req.body.lat ?? req.body.latitude);
    const lng = parseFloat(req.body.lng ?? req.body.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ error: 'Validation Error', message: 'Tọa độ GPS lat và lng là bắt buộc.' });
      return;
    }

    const area = detectAreaFromCoordinates(lat, lng);
    res.json({ area, lat, lng });
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET /api/places/nearby?lat=21.0185&lng=105.5345&radius=1000
placesRouter.get('/nearby', async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = req.query.radius ? parseFloat(req.query.radius as string) : 1000;

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({
        error: 'Tọa độ không hợp lệ',
        message: 'Query params `lat` và `lng` là bắt buộc và phải là số thực.',
      });
      return;
    }

    const places = await placesService.getNearbyPlaces(lat, lng, radius);
    res.json(places);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET /api/places
placesRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: FilterParams = {};

    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.q) filters.searchQuery = req.query.q as string;
    if (req.query.area) filters.area = req.query.area as string;
    if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice as string);
    if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice as string);
    if (req.query.sortBy) filters.sortBy = req.query.sortBy as any;

    if (req.query.minLng && req.query.maxLng && req.query.minLat && req.query.maxLat) {
      filters.bbox = {
        minLng: parseFloat(req.query.minLng as string),
        maxLng: parseFloat(req.query.maxLng as string),
        minLat: parseFloat(req.query.minLat as string),
        maxLat: parseFloat(req.query.maxLat as string),
      };
    }

    const places = await placesService.getPlaces(filters);
    res.json(places);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET /api/places/:id
placesRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const place = await placesService.getPlaceById(id);
    if (!place) {
      res.status(404).json({ error: 'Not Found', message: `Không tìm thấy địa điểm với ID ${id}` });
      return;
    }
    res.json(place);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// POST /api/places (Chấm vào bản đồ - Thêm địa điểm mới)
placesRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const dto: CreatePlaceDto = req.body;

    if (!dto.name) {
      res.status(400).json({ error: 'Validation Error', message: 'Tên địa điểm là bắt buộc' });
      return;
    }

    const lat = dto.coordinates?.lat ?? dto.latitude;
    const lng = dto.coordinates?.lng ?? dto.longitude;

    if (lat === undefined || lng === undefined) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Tọa độ GPS (coordinates.lat & coordinates.lng) là bắt buộc khi chấm trên bản đồ!',
      });
      return;
    }

    const createdPlace = await placesService.createPlace(dto);
    res.status(201).json(createdPlace);
  } catch (err: any) {
    res.status(400).json({ error: 'Bad Request', message: err.message });
  }
});

// POST /api/places/:id/reviews
placesRouter.post('/:id/reviews', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const dto: CreateReviewDto = req.body;
    dto.placeId = id;

    if (!dto.rating || dto.rating < 1 || dto.rating > 5) {
      res.status(400).json({ error: 'Validation Error', message: 'Đánh giá rating phải từ 1 đến 5 sao' });
      return;
    }
    if (!dto.comment || !dto.comment.trim()) {
      res.status(400).json({ error: 'Validation Error', message: 'Nội dung nhận xét là bắt buộc' });
      return;
    }

    const createdReview = await placesService.addReview(id, dto);
    res.status(201).json(createdReview);
  } catch (err: any) {
    res.status(400).json({ error: 'Bad Request', message: err.message });
  }
});

// DELETE /api/places/:id (Admin only)
placesRouter.delete('/:id', requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await placesService.deletePlace(id);
    if (!deleted) {
      res.status(404).json({ error: 'Not Found', message: `Không tìm thấy địa điểm ${id}` });
      return;
    }
    res.json({ success: true, message: `Đã xóa địa điểm ${id} thành công.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// POST /api/places/:id/delete (Admin only - Alias for environments that restrict HTTP DELETE)
placesRouter.post('/:id/delete', requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await placesService.deletePlace(id);
    if (!deleted) {
      res.status(404).json({ error: 'Not Found', message: `Không tìm thấy địa điểm ${id}` });
      return;
    }
    res.json({ success: true, message: `Đã xóa địa điểm ${id} thành công.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

