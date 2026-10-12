import { supabase, isSupabaseConfigured } from './supabaseClient';
import { compressImage, blobToBase64 } from '../utils/compressImage';

export interface UploadImageResult {
  url: string;
  originalSize: number;
  compressedSize: number;
  isSupabaseUrl: boolean;
}

const DEFAULT_BUCKET = 'reviews';

// Guardrail: Maximum 5MB per file
export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/avif',
];

export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.heic',
  '.heif',
  '.avif',
];

/**
 * Guardrail validation function: validates format and file size <= 5MB
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check format: MIME type or extension
  const isMimeValid = file.type && ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase());
  const isExtValid = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (!isMimeValid && !isExtValid) {
    return {
      valid: false,
      error: `File "${file.name}" không hợp lệ. Chỉ chấp nhận các định dạng ảnh (JPEG, PNG, WebP, GIF, HEIC, AVIF).`,
    };
  }

  // Check file size: max 5MB
  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Ảnh "${file.name}" dung lượng ${sizeInMB} MB vượt quá giới hạn tối đa 5 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Uploads a review image with client-side WebP compression.
 * If Supabase Storage is configured and accessible, uploads to the 'reviews' bucket
 * and returns the public CDN URL.
 * If Supabase Storage is unavailable, falls back to a compressed Base64 Data URL.
 */
export async function uploadReviewImage(
  file: File,
  placeId: string | number = 'general',
  bucketName: string = DEFAULT_BUCKET
): Promise<UploadImageResult> {
  // Guardrail check
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const originalSize = file.size;

  // 1. Client-side compression to WebP (max 1200px, 80% quality)
  // Drops file size from ~3-8MB to ~70-150KB!
  let compressedBlob: Blob;
  try {
    compressedBlob = await compressImage(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.8,
      format: 'image/webp',
    });
  } catch (err) {
    console.warn('[StorageService] Image compression failed, using original file:', err);
    compressedBlob = file;
  }

  const compressedSize = compressedBlob.size;

  // 2. Upload to Supabase Storage if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const fileName = `review_${timestamp}_${randomSuffix}.webp`;
      const filePath = `${placeId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000', // Cache for 1 year in browser/CDN to save egress bandwidth
          upsert: false,
        });

      if (!error && data?.path) {
        const { data: publicData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);

        if (publicData?.publicUrl) {
          return {
            url: publicData.publicUrl,
            originalSize,
            compressedSize,
            isSupabaseUrl: true,
          };
        }
      } else if (error) {
        console.warn(`[StorageService] Supabase bucket "${bucketName}" upload error:`, error.message);
      }
    } catch (err) {
      console.warn('[StorageService] Unexpected upload error, falling back to base64:', err);
    }
  }

  // 3. Fallback: return compressed base64 (still 90% smaller than raw base64!)
  const base64Url = await blobToBase64(compressedBlob);
  return {
    url: base64Url,
    originalSize,
    compressedSize,
    isSupabaseUrl: false,
  };
}

/**
 * Upload multiple review images concurrently with progress tracking
 */
export async function uploadReviewImages(
  files: File[],
  placeId: string | number = 'general',
  onProgress?: (current: number, total: number) => void
): Promise<UploadImageResult[]> {
  const results: UploadImageResult[] = [];
  for (let i = 0; i < files.length; i++) {
    const res = await uploadReviewImage(files[i], placeId);
    results.push(res);
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  return results;
}
