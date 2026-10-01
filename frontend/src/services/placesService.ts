import { CATEGORIES, MOCK_PLACES } from '../data/mockPlaces';
import type {
  CategoryMeta,
  CreateReportDto,
  CreateReviewDto,
  FilterParams,
  Place,
  PlaceCategory,
  Review,
} from '../types/place';
import { USE_MOCK_DATA } from './apiClient';
import { supabase } from './supabaseClient';

const CATEGORY_MAP: Record<string, { id: PlaceCategory; label: string; color: string; icon: string }> = {
  'boarding_house': { id: 'boarding_house', label: 'Nhà trọ & CCMN', color: '#ea580c', icon: 'Home' },
  'food_drink': { id: 'food_drink', label: 'Ăn uống & Cafe', color: '#d97706', icon: 'UtensilsCrossed' },
  'grocery': { id: 'grocery', label: 'Siêu thị & Tạp hóa', color: '#0284c7', icon: 'ShoppingBag' },
  'pharmacy': { id: 'pharmacy', label: 'Hiệu thuốc & Y tế', color: '#dc2626', icon: 'Cross' },
  'services': { id: 'services', label: 'Sửa xe & Dịch vụ', color: '#0891b2', icon: 'Wrench' },
  'entertainment': { id: 'entertainment', label: 'Giải trí & Thể thao', color: '#7c3aed', icon: 'Gamepad2' },
  'campus': { id: 'campus', label: 'Trường & Điểm đón Bus', color: '#16a34a', icon: 'GraduationCap' },
};

function mapDbRowToPlace(row: any, categoryName?: string, reviews: Review[] = []): Place {
  const catKey = (categoryName || 'boarding_house') as PlaceCategory;
  const meta = CATEGORY_MAP[catKey] || CATEGORY_MAP['boarding_house'];

  const ratingAvg = reviews.length > 0 
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)) 
    : 4.8;

  return {
    id: String(row.id),
    name: row.name || 'Địa điểm không tên',
    slug: `place-${row.id}`,
    category: meta.id,
    categoryLabel: meta.label,
    categoryColor: meta.color,
    iconName: meta.icon,
    shortDescription: row.address ? `${row.address} - ${row.area || 'Hòa Lạc'}` : 'Địa điểm tiện ích sinh viên',
    fullDescription: row.opening_hours ? `Giờ mở cửa: ${row.opening_hours}` : 'Thông tin chi tiết đang được cập nhật.',
    address: row.address || 'Hòa Lạc, Thạch Thất, Hà Nội',
    areaName: row.area || 'Hòa Lạc',
    coordinates: {
      lng: Number(row.longitude) || 105.5345,
      lat: Number(row.latitude) || 21.0185,
    },
    distanceToFPT: 'Gần FPTU',
    distanceToVNU: 'Gần VNU',
    priceInfo: (row.rent_price || row.min_price) ? {
      amount: row.rent_price || row.min_price || 0,
      unit: 'tháng',
      electricity: row.electricity_price,
      water: row.water_price ? parseInt(row.water_price, 10) || undefined : undefined,
    } : undefined,
    phone: row.phone,
    zaloPhone: row.phone,
    photos: Array.isArray(row.images) && row.images.length > 0 
      ? row.images 
      : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    tags: Array.isArray(row.amenities) ? row.amenities : [],
    amenities: (Array.isArray(row.amenities) ? row.amenities : []).map((label: string) => ({
      icon: 'Check',
      label,
      available: true,
    })),
    rating: ratingAvg,
    reviewCount: reviews.length,
    reviews,
    isVerified: true,
    isAvailable: row.room_status ? row.room_status !== 'full' : true,
    openingHours: row.opening_hours,
    badgeText: row.room_status === 'available' ? 'Còn phòng' : undefined,
  };
}

/**
 * Places Service Layer
 * Supabase integration with fallback to Mock Data
 */
export const placesService = {
  /**
   * Fetch places with filtering, fuzzy search and optional bounding box
   */
  async getPlaces(filters: FilterParams = {}): Promise<Place[]> {
    if (!USE_MOCK_DATA) {
      try {
        let query = supabase.from('places').select('*, categories(name), reviews(*)');

        if (filters.area && filters.area !== 'all') {
          query = query.ilike('area', `%${filters.area}%`);
        }

        if (filters.minPrice !== undefined && filters.minPrice > 0) {
          query = query.gte('min_price', filters.minPrice);
        }

        if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
          query = query.lte('max_price', filters.maxPrice);
        }

        if (filters.bbox) {
          query = query
            .gte('longitude', filters.bbox.minLng)
            .lte('longitude', filters.bbox.maxLng)
            .gte('latitude', filters.bbox.minLat)
            .lte('latitude', filters.bbox.maxLat);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          let places = data.map((item: any) => {
            const catName = item.categories?.name;
            const revs: Review[] = (item.reviews || []).map((r: any) => ({
              id: String(r.id),
              authorName: 'Sinh viên FPT/VNU',
              rating: r.rating || 5,
              comment: r.content || '',
              createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '',
            }));
            return mapDbRowToPlace(item, catName, revs);
          });

          // Filter by category
          if (filters.category && filters.category !== 'all') {
            places = places.filter((p) => p.category === filters.category);
          }

          // Search query
          if (filters.searchQuery && filters.searchQuery.trim()) {
            const q = filters.searchQuery.toLowerCase().trim();
            places = places.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.address.toLowerCase().includes(q) ||
                p.shortDescription.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q))
            );
          }

          // Sort
          if (filters.sortBy === 'rating') {
            places.sort((a, b) => b.rating - a.rating);
          } else if (filters.sortBy === 'price_asc') {
            places.sort((a, b) => (a.priceInfo?.amount || 0) - (b.priceInfo?.amount || 0));
          } else if (filters.sortBy === 'price_desc') {
            places.sort((a, b) => (b.priceInfo?.amount || 0) - (a.priceInfo?.amount || 0));
          }

          return places;
        }
      } catch (err) {
        console.warn('[Supabase] Falling back to mock places due to query error:', err);
      }
    }

    // Default Mock Data logic
    await new Promise((resolve) => setTimeout(resolve, 50));
    let result = [...MOCK_PLACES];

    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.area && filters.area !== 'all') {
      result = result.filter((p) => p.areaName === filters.area);
    }

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

    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((p) =>
        filters.tags!.every((t) => p.tags.includes(t))
      );
    }

    if (filters.onlyAvailable) {
      result = result.filter((p) => p.isAvailable !== false);
    }

    if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => (a.priceInfo?.amount || 0) - (b.priceInfo?.amount || 0));
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => (b.priceInfo?.amount || 0) - (a.priceInfo?.amount || 0));
    }

    return result;
  },

  /**
   * Get single place details by ID
   */
  async getPlaceById(id: string): Promise<Place | null> {
    if (!USE_MOCK_DATA) {
      try {
        const { data, error } = await supabase
          .from('places')
          .select('*, categories(name), reviews(*)')
          .eq('id', id)
          .single();

        if (!error && data) {
          const catName = data.categories?.name;
          const revs: Review[] = (data.reviews || []).map((r: any) => ({
            id: String(r.id),
            authorName: 'Sinh viên FPT/VNU',
            rating: r.rating || 5,
            comment: r.content || '',
            createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '',
          }));
          return mapDbRowToPlace(data, catName, revs);
        }
      } catch (err) {
        console.warn('[Supabase] Failed to fetch place by ID from Supabase:', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 30));
    return MOCK_PLACES.find((p) => p.id === id) || null;
  },

  /**
   * Get categories metadata with counts
   */
  async getCategories(): Promise<CategoryMeta[]> {
    if (!USE_MOCK_DATA) {
      try {
        const { data } = await supabase.from('categories').select('*');
        if (data && data.length > 0) {
          return CATEGORIES.map((cat) => ({
            ...cat,
            count: 0,
          }));
        }
      } catch (err) {
        console.warn('[Supabase] Failed to get categories from Supabase:', err);
      }
    }

    return CATEGORIES.map((cat) => ({
      ...cat,
      count: MOCK_PLACES.filter((p) => p.category === cat.id).length,
    }));
  },

  /**
   * Submit report about incorrect place info
   */
  async reportPlace(dto: CreateReportDto): Promise<{ success: boolean; message: string }> {
    if (!USE_MOCK_DATA) {
      try {
        await supabase.from('contributions').insert([
          { contributor_name: dto.contactEmail || 'Anonymous Student' },
        ]);
      } catch (err) {
        console.error('[Supabase] Error saving contribution:', err);
      }
    }
    return { success: true, message: 'Cảm ơn bạn! Báo cáo đã được ghi nhận.' };
  },

  /**
   * Submit a student review
   */
  async addReview(dto: CreateReviewDto): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      authorName: dto.authorName,
      studentBatch: dto.studentBatch || 'Sinh viên Hòa Lạc',
      rating: dto.rating,
      comment: dto.comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (!USE_MOCK_DATA) {
      try {
        const numericId = parseInt(dto.placeId, 10);
        if (!isNaN(numericId)) {
          await supabase.from('reviews').insert([
            {
              place_id: numericId,
              rating: dto.rating,
              content: dto.comment,
            },
          ]);
        }
      } catch (err) {
        console.error('[Supabase] Error saving review to Supabase:', err);
      }
    }

    const place = MOCK_PLACES.find((p) => p.id === dto.placeId);
    if (place) {
      place.reviews.unshift(newReview);
      place.reviewCount += 1;
    }

    return newReview;
  },
};
