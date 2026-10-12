import { Router, Request, Response } from 'express';
import { saveBase64Image } from '../services/placesService.js';

export const uploadRouter = Router();

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_BASE64_IMAGE_REGEX = /^data:image\/(jpeg|jpg|png|webp|gif|avif|heic|heif);base64,/i;

function validateImageItem(img: string): { valid: boolean; message?: string } {
  if (img.startsWith('data:')) {
    if (!ALLOWED_BASE64_IMAGE_REGEX.test(img)) {
      return {
        valid: false,
        message: 'Định dạng ảnh không hợp lệ (chỉ chấp nhận JPEG, PNG, WebP, GIF, AVIF, HEIC).',
      };
    }
    const base64Data = img.split(',')[1] || '';
    const approxBytes = Math.ceil(base64Data.length * 0.75);
    if (approxBytes > MAX_IMAGE_BYTES) {
      return {
        valid: false,
        message: 'Dung lượng ảnh vượt quá giới hạn tối đa 5MB.',
      };
    }
  } else if (!/^https?:\/\/.+/i.test(img) && !img.startsWith('/uploads/')) {
    return {
      valid: false,
      message: 'Dữ liệu hoặc đường dẫn ảnh không hợp lệ.',
    };
  }
  return { valid: true };
}

// POST /api/upload
uploadRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, data, images } = req.body;

    // Handle multiple images
    if (Array.isArray(images) && images.length > 0) {
      const urls: string[] = [];
      for (const img of images) {
        if (typeof img !== 'string') continue;
        const check = validateImageItem(img);
        if (!check.valid) {
          res.status(400).json({ error: 'Validation Error', message: check.message });
          return;
        }

        if (img.startsWith('data:image/')) {
          const url = await saveBase64Image(img);
          urls.push(url);
        } else {
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

    const check = validateImageItem(singleData);
    if (!check.valid) {
      res.status(400).json({ error: 'Validation Error', message: check.message });
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
