import { CATEGORIES, MOCK_PLACES } from '../data/mockPlaces';
import type {
  CategoryMeta,
  CreateReportDto,
  CreateReviewDto,
  FilterParams,
  Place,
  Review,
} from '../types/place';
import { request, USE_MOCK_DATA } from './apiClient';

/**
 * Places Service Layer
 * Easy plug-in interface for backend endpoints
 */
export const placesService = {
  /**
   * Fetch places with filtering, fuzzy search and optional bounding box
   */
  async getPlaces(filters: FilterParams = {}): Promise<Place[]> {
    if (USE_MOCK_DATA) {
      // Simulate low-latency network request (50ms)
      await new Promise((resolve) => setTimeout(resolve, 50));

      let result = [...MOCK_PLACES];

      // Filter by category
      if (filters.category && filters.category !== 'all') {
        result = result.filter((p) => p.category === filters.category);
      }

      // Filter by area
      if (filters.area && filters.area !== 'all') {
        result = result.filter((p) => p.areaName === filters.area);
      }

      // Search query (name, address, tags, shortDescription)
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      // Price filter (only for items with priceInfo)
      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        result = result.filter(
          (p) => !p.priceInfo || p.priceInfo.amount >= (filters.minPrice ?? 0)
        );
      }
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        result = result.filter(
          (p) => !p.priceInfo || p.priceInfo.amount <= (filters.maxPrice ?? Infinity)
        );
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        result = result.filter((p) =>
          filters.tags!.every((t) => p.tags.includes(t))
        );
      }

      // Only available filter
      if (filters.onlyAvailable) {
        result = result.filter((p) => p.isAvailable !== false);
      }

      // Sort
      if (filters.sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'price_asc') {
        result.sort((a, b) => (a.priceInfo?.amount || 0) - (b.priceInfo?.amount || 0));
      } else if (filters.sortBy === 'price_desc') {
        result.sort((a, b) => (b.priceInfo?.amount || 0) - (a.priceInfo?.amount || 0));
      }

      return result;
    }

    // Call Real Backend API
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.searchQuery) params.append('q', filters.searchQuery);
    if (filters.area && filters.area !== 'all') params.append('area', filters.area);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.bbox) {
      params.append('minLng', filters.bbox.minLng.toString());
      params.append('minLat', filters.bbox.minLat.toString());
      params.append('maxLng', filters.bbox.maxLng.toString());
      params.append('maxLat', filters.bbox.maxLat.toString());
    }

    return request<Place[]>(`/places?${params.toString()}`);
  },

  /**
   * Get single place details by ID
   */
  async getPlaceById(id: string): Promise<Place | null> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      return MOCK_PLACES.find((p) => p.id === id) || null;
    }

    return request<Place>(`/places/${id}`);
  },

  /**
   * Get categories metadata with counts
   */
  async getCategories(): Promise<CategoryMeta[]> {
    if (USE_MOCK_DATA) {
      return CATEGORIES.map((cat) => ({
        ...cat,
        count: MOCK_PLACES.filter((p) => p.category === cat.id).length,
      }));
    }

    return request<CategoryMeta[]>('/categories');
  },

  /**
   * Submit report about incorrect place info
   */
  async reportPlace(dto: CreateReportDto): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_DATA) {
      console.log('[Mock Backend] Received Place Report:', dto);
      return { success: true, message: 'Cảm ơn bạn! Báo cáo đã được ghi nhận.' };
    }

    return request<{ success: boolean; message: string }>('/reports', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Submit a student review
   */
  async addReview(dto: CreateReviewDto): Promise<Review> {
    if (USE_MOCK_DATA) {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        authorName: dto.authorName,
        studentBatch: dto.studentBatch || 'Sinh viên Hòa Lạc',
        rating: dto.rating,
        comment: dto.comment,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const place = MOCK_PLACES.find((p) => p.id === dto.placeId);
      if (place) {
        place.reviews.unshift(newReview);
        place.reviewCount += 1;
      }

      return newReview;
    }

    return request<Review>(`/places/${dto.placeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },
};
