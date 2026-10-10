import { CATEGORIES, MOCK_PLACES } from '../data/mockPlaces';
import type {
  CategoryMeta,
  ContributorProgress,
  CreatePlaceDto,
  CreateReportDto,
  CreateReviewDto,
  FilterParams,
  Place,
  PlaceCategory,
  Review,
  SurveyStats,
  SurveyTemplate,
} from '../types/place';
import { request, USE_MOCK_DATA } from './apiClient';
import { supabase } from './supabaseClient';
import { resolveImageUrl } from '../utils/imageUrl';

const CATEGORY_MAP: Record<string, { id: PlaceCategory; label: string; color: string; icon: string }> = {
  'boarding_house': { id: 'boarding_house', label: 'Nhà trọ & CCMN', color: '#ea580c', icon: 'Home' },
  'food_drink': { id: 'food_drink', label: 'Ăn uống & Cafe', color: '#d97706', icon: 'UtensilsCrossed' },
  'grocery': { id: 'grocery', label: 'Siêu thị & Tạp hóa', color: '#0284c7', icon: 'ShoppingBag' },
  'pharmacy': { id: 'pharmacy', label: 'Hiệu thuốc & Y tế', color: '#dc2626', icon: 'Cross' },
  'services': { id: 'services', label: 'Sửa xe & Dịch vụ', color: '#0891b2', icon: 'Wrench' },
  'entertainment': { id: 'entertainment', label: 'Giải trí & Thể thao', color: '#7c3aed', icon: 'Gamepad2' },
  'campus': { id: 'campus', label: 'Trường & Điểm đón Bus', color: '#16a34a', icon: 'GraduationCap' },
};

function formatPhotoUrl(url: string): string {
  return resolveImageUrl(url);
}

const VIETNAMESE_CATEGORY_MAP: Record<string, PlaceCategory> = {
  'ẩm thực': 'food_drink',
  'ăn uống': 'food_drink',
  'food_drink': 'food_drink',
  'nhà trọ & chung cư mini': 'boarding_house',
  'nhà trọ': 'boarding_house',
  'boarding_house': 'boarding_house',
  'dịch vụ học tập & đời sống': 'services',
  'dịch vụ': 'services',
  'services': 'services',
  'y tế & sức khỏe': 'pharmacy',
  'y tế': 'pharmacy',
  'pharmacy': 'pharmacy',
  'giải trí & thể thao': 'entertainment',
  'giải trí': 'entertainment',
  'entertainment': 'entertainment',
  'grocery': 'grocery',
  'siêu thị & tạp hóa': 'grocery',
  'campus': 'campus',
  'trường & điểm đón bus': 'campus',
};

function normalizeCategory(categoryName?: string): PlaceCategory {
  if (!categoryName) return 'boarding_house';
  const lower = categoryName.toLowerCase().trim();
  return VIETNAMESE_CATEGORY_MAP[lower] || 'boarding_house';
}

function mapDbRowToPlace(row: any, categoryName?: string, reviews: Review[] = []): Place {
  const catKey = normalizeCategory(categoryName);
  const meta = CATEGORY_MAP[catKey] || CATEGORY_MAP['boarding_house'];
  const isBoarding = meta.id === 'boarding_house';

  const ratingAvg = reviews.length > 0 
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)) 
    : 4.8;

  let badge: string | undefined = undefined;
  if (isBoarding) {
    badge = row.room_status === 'available' ? 'Còn phòng' : (row.room_status === 'full' ? 'Hết phòng' : undefined);
  } else if (meta.id === 'food_drink') {
    badge = row.min_price ? `${Math.round(row.min_price / 1000)}k` : undefined;
  }

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
      amount: (isBoarding ? row.rent_price : (row.min_price || row.rent_price)) || 0,
      unit: isBoarding ? 'tháng' : 'suất',
      electricity: isBoarding ? row.electricity_price : undefined,
      water: isBoarding ? (row.water_price ? parseInt(row.water_price, 10) || undefined : undefined) : undefined,
    } : undefined,
    phone: row.phone,
    zaloPhone: row.phone,
    photos: Array.isArray(row.images) && row.images.length > 0 
      ? row.images.map(formatPhotoUrl) 
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
    isAvailable: isBoarding ? (row.room_status ? row.room_status !== 'full' : true) : true,
    openingHours: row.opening_hours,
    badgeText: badge,
    gpsAccuracy: row.gps_accuracy ? Number(row.gps_accuracy) : undefined,
    contributorName: row.contributor_name || undefined,
  };
}

/**
 * Places Service Layer
 * Supports REST API backend, direct Supabase, and instant Mock Data fallback
 */
export const placesService = {
  /**
   * Fetch places with filtering, fuzzy search and optional bounding box
   */
  async getPlaces(filters: FilterParams = {}): Promise<Place[]> {
    if (!USE_MOCK_DATA) {
      // 1. Try REST Backend API
      try {
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

        const data = await request<Place[]>(`/places?${params.toString()}`);
        if (Array.isArray(data)) {
          return data.map((p) => ({
            ...p,
            photos: Array.isArray(p.photos) ? p.photos.map(formatPhotoUrl) : [],
          }));
        }
      } catch (backendErr) {
        console.warn('[PlacesService] Backend API request failed, trying Supabase fallback:', backendErr);
      }

      // 2. Try Supabase direct fallback
      if (supabase) {
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
            let places: Place[] = data.map((item: any) => {
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

            if (filters.category && filters.category !== 'all') {
              places = places.filter((p: Place) => p.category === filters.category);
            }

            if (filters.searchQuery && filters.searchQuery.trim()) {
              const q = filters.searchQuery.toLowerCase().trim();
              places = places.filter(
                (p: Place) =>
                  p.name.toLowerCase().includes(q) ||
                  p.address.toLowerCase().includes(q) ||
                  p.shortDescription.toLowerCase().includes(q) ||
                  p.tags.some((t: string) => t.toLowerCase().includes(q))
              );
            }

            if (filters.sortBy === 'rating') {
              places.sort((a: Place, b: Place) => b.rating - a.rating);
            } else if (filters.sortBy === 'price_asc') {
              places.sort((a: Place, b: Place) => (a.priceInfo?.amount || 0) - (b.priceInfo?.amount || 0));
            } else if (filters.sortBy === 'price_desc') {
              places.sort((a: Place, b: Place) => (b.priceInfo?.amount || 0) - (a.priceInfo?.amount || 0));
            }

            return places;
          }
        } catch (err) {
          console.warn('[PlacesService] Supabase fallback failed, returning mock data:', err);
        }
      }
    }

    // 3. Default Mock Data logic
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
        const place = await request<Place>(`/places/${id}`);
        if (place) {
          return {
            ...place,
            photos: Array.isArray(place.photos) ? place.photos.map(formatPhotoUrl) : [],
          };
        }
      } catch (err) {
        console.warn('[PlacesService] Backend getPlaceById error, falling back:', err);
      }

      if (supabase) {
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
          console.warn('[PlacesService] Supabase getPlaceById error:', err);
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 30));
    return MOCK_PLACES.find((p) => p.id === id) || null;
  },

  /**
   * Create a new place (Supports "Chấm vào bản đồ" - Map Pinning!)
   */
  async createPlace(placeData: CreatePlaceDto | any): Promise<Place> {
    if (!USE_MOCK_DATA) {
      try {
        const created = await request<Place>('/places', {
          method: 'POST',
          body: JSON.stringify(placeData),
        });
        if (created) {
          return {
            ...created,
            photos: Array.isArray(created.photos) ? created.photos.map(formatPhotoUrl) : [],
          };
        }
      } catch (err) {
        console.warn('[PlacesService] Backend createPlace error, falling back to local mock:', err);
      }
    }

    // Mock local creation
    const newId = `pin-${Date.now()}`;
    const newPlace: Place = {
      id: newId,
      name: placeData.name || 'Địa điểm mới',
      slug: `pin-${Date.now()}`,
      category: placeData.category || 'food_drink',
      categoryLabel: CATEGORY_MAP[placeData.category]?.label || 'Ẩm thực',
      categoryColor: CATEGORY_MAP[placeData.category]?.color || '#ea580c',
      iconName: CATEGORY_MAP[placeData.category]?.icon || 'MapPin',
      shortDescription: placeData.address || 'Địa điểm vừa được chấm trên bản đồ',
      fullDescription: placeData.reviewContent || 'Thông tin vừa được thêm.',
      address: placeData.address || 'Hòa Lạc, Thạch Thất, Hà Nội',
      areaName: placeData.areaName || 'Hòa Lạc',
      coordinates: {
        lat: placeData.coordinates?.lat || placeData.latitude || 21.0185,
        lng: placeData.coordinates?.lng || placeData.longitude || 105.5345,
      },
      distanceToFPT: 'Gần FPTU',
      distanceToVNU: 'Gần VNU',
      priceInfo: placeData.priceInfo,
      phone: placeData.phone,
      photos: placeData.photos || ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
      tags: placeData.amenities || [],
      amenities: (placeData.amenities || []).map((label: string) => ({
        icon: 'Check',
        label,
        available: true,
      })),
      rating: placeData.rating || 5,
      reviewCount: 1,
      reviews: placeData.reviewContent
        ? [
            {
              id: `rev-${Date.now()}`,
              authorName: placeData.contributorName || 'Sinh viên khảo sát',
              rating: placeData.rating || 5,
              comment: placeData.reviewContent,
              createdAt: new Date().toISOString().split('T')[0],
            },
          ]
        : [],
      isVerified: true,
      isAvailable: true,
    };

    MOCK_PLACES.unshift(newPlace);
    return newPlace;
  },

  /**
   * Get categories metadata with counts
   */
  async getCategories(): Promise<CategoryMeta[]> {
    if (!USE_MOCK_DATA) {
      try {
        const cats = await request<CategoryMeta[]>('/categories');
        if (Array.isArray(cats) && cats.length > 0) return cats;
      } catch (err) {
        console.warn('[PlacesService] Backend getCategories error:', err);
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
        return await request<{ success: boolean; message: string }>('/reports', {
          method: 'POST',
          body: JSON.stringify(dto),
        });
      } catch (err) {
        console.warn('[PlacesService] Backend reportPlace error:', err);
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
        return await request<Review>(`/places/${dto.placeId}/reviews`, {
          method: 'POST',
          body: JSON.stringify(dto),
        });
      } catch (err) {
        console.warn('[PlacesService] Backend addReview error:', err);
      }
    }

    const place = MOCK_PLACES.find((p) => p.id === dto.placeId);
    if (place) {
      place.reviews.unshift(newReview);
      place.reviewCount += 1;
    }

    return newReview;
  },

  /**
   * Fetch survey metadata & 14-question options
   */
  async getSurveyTemplate(): Promise<SurveyTemplate> {
    if (!USE_MOCK_DATA) {
      try {
        const tmpl = await request<SurveyTemplate>('/places/template');
        if (tmpl) return tmpl;
      } catch (err) {
        console.warn('[PlacesService] Backend getSurveyTemplate error, falling back:', err);
      }
    }

    return {
      surveyors: [
        'Đặng Cao Cường',
        'Đào Thế Việt',
        'Trần Đức Thịnh',
        'Phạm Mạnh Giang',
        'Ngô Quang Huy',
        'Mai Xuân Dương',
      ],
      categories: await this.getCategories(),
      areas: ['Tân Xã', 'Thạch Hòa', 'Bình Yên', 'Khu Công Nghệ Cao Hòa Lạc', 'Khác'],
      commonAmenities: [
        'Có điều hòa',
        'Wifi miễn phí',
        'Chỗ để xe miễn phí / rộng rãi',
        'Thanh toán Chuyển khoản / Quét mã QR',
        'Thang máy',
        'Khóa vân tay / Camera an ninh',
        'Đạt chuẩn an toàn PCCC',
        'Không chung chủ',
        'Phục vụ thông trưa',
      ],
    };
  },

  /**
   * Upload field survey photo (supports mobile camera)
   */
  async uploadImage(dataUri: string): Promise<string> {
    if (!USE_MOCK_DATA) {
      try {
        const res = await request<{ success: boolean; url: string }>('/upload', {
          method: 'POST',
          body: JSON.stringify({ data: dataUri }),
        });
        if (res?.url) return res.url;
      } catch (err) {
        console.warn('[PlacesService] Backend uploadImage error, fallback to dataUri:', err);
      }
    }
    return dataUri;
  },

  /**
   * Auto-detect area from GPS coordinates
   */
  async detectArea(lat: number, lng: number): Promise<string> {
    if (!USE_MOCK_DATA) {
      try {
        const res = await request<{ area: string }>('/places/detect-area', {
          method: 'POST',
          body: JSON.stringify({ lat, lng }),
        });
        if (res?.area) return res.area;
      } catch (err) {
        console.warn('[PlacesService] Backend detectArea error:', err);
      }
    }

    // Client-side fallback detection
    const spots = [
      { name: 'Tân Xã', lat: 21.0185, lng: 105.5345 },
      { name: 'Thạch Hòa', lat: 21.0135, lng: 105.5252 },
      { name: 'Bình Yên', lat: 21.0300, lng: 105.5100 },
      { name: 'Khu Công Nghệ Cao Hòa Lạc', lat: 21.0050, lng: 105.5450 },
    ];
    let closest = spots[0];
    let minD = Infinity;
    for (const s of spots) {
      const d = Math.hypot(lat - s.lat, lng - s.lng);
      if (d < minD) {
        minD = d;
        closest = s;
      }
    }
    return closest.name;
  },

  /**
   * Get contributor ranking and survey KPI progress
   */
  async getContributors(): Promise<ContributorProgress[]> {
    if (!USE_MOCK_DATA) {
      try {
        const contribs = await request<ContributorProgress[]>('/contributions');
        if (Array.isArray(contribs) && contribs.length > 0) return contribs;
      } catch (err) {
        console.warn('[PlacesService] Backend getContributors error:', err);
      }
    }

    const defaultNames = [
      'Đặng Cao Cường',
      'Đào Thế Việt',
      'Trần Đức Thịnh',
      'Phạm Mạnh Giang',
      'Ngô Quang Huy',
      'Mai Xuân Dương',
    ];
    return defaultNames.map((name, idx) => ({
      id: idx + 1,
      name,
      placeCount: 0,
      target: 10,
      progressPercentage: 0,
      recentPlaces: [],
    }));
  },

  /**
   * Get overall survey statistics and KPIs
   */
  async getSurveyStats(): Promise<SurveyStats> {
    if (!USE_MOCK_DATA) {
      try {
        const stats = await request<SurveyStats>('/stats');
        if (stats) return stats;
      } catch (err) {
        console.warn('[PlacesService] Backend getSurveyStats error:', err);
      }
    }
    return {
      totalPlaces: MOCK_PLACES.length,
      targetPlaces: 50,
      progressPercentage: Math.min(100, Math.round((MOCK_PLACES.length / 50) * 100)),
      totalReviews: 12,
      totalCategories: CATEGORIES.length,
      totalContributors: 6,
      byCategory: {},
      byArea: {},
      bySurveyor: [],
    };
  },

  /**
   * Delete place (Admin only)
   */
  async deletePlace(id: string): Promise<boolean> {
    if (!USE_MOCK_DATA) {
      try {
        const res = await request<{ success: boolean }>(`/places/${id}`, {
          method: 'DELETE',
        });
        return res?.success ?? true;
      } catch (err) {
        console.warn('[PlacesService] Backend deletePlace error, trying fallback:', err);
        if (supabase) {
          try {
            await supabase.from('reviews').delete().eq('place_id', id);
            await supabase.from('reports').delete().eq('place_id', id);
            const { error: supaErr } = await supabase.from('places').delete().eq('id', id);
            if (!supaErr) {
              return true;
            }
          } catch (supaCatch) {
            console.error('[PlacesService] Supabase delete fallback failed:', supaCatch);
          }
        }
        throw err;
      }
    }
    const idx = MOCK_PLACES.findIndex((p) => p.id === id);
    if (idx !== -1) {
      MOCK_PLACES.splice(idx, 1);
    }
    return true;
  },
};

