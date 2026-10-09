import { Router, Request, Response } from 'express';
import { saveBase64Image } from '../services/placesService.js';

export const uploadRouter = Router();

// POST /api/upload
uploadRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, data, images } = req.body;

    // Handle multiple images
    if (Array.isArray(images) && images.length > 0) {
      const urls: string[] = [];
      for (const img of images) {
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          const url = await saveBase64Image(img);
          urls.push(url);
        } else if (typeof img === 'string') {
          urls.push(img);
        }
      }
      res.status(201).json({ success: true, urls });
      return;
    }

    // Handle single image
    const singleData = image || data;
    if (!singleData || typeof singleData !== 'string') {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Dữ liệu ảnh `image` hoặc `data` (base64 Data URI) là bắt buộc!',
      });
      return;
    }

    const savedUrl = await saveBase64Image(singleData);
    res.status(201).json({
      success: true,
      url: savedUrl,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Upload Error', message: err.message });
  }
});
