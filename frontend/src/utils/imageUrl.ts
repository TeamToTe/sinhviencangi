import { API_BASE_URL } from '../services/apiClient';

export const FALLBACK_PLACE_IMAGE =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80';

/**
 * Resolves any image URL (relative upload path, absolute URL, base64)
 * ensuring relative uploads from the backend API are properly mapped to the backend origin.
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return FALLBACK_PLACE_IMAGE;
  }

  const trimmed = url.trim();

  // If already absolute HTTP / HTTPS or Data URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  ) {
    return trimmed;
  }

  // If relative path from backend uploads
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const origin = API_BASE_URL.replace(/\/api\/?$/, '');
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${origin}${cleanPath}`;
  }

  return trimmed;
}
