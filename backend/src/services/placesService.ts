import { db } from '../db/index.js';
import type {
  Amenity,
  CategoryMeta,
  CreatePlaceDto,
  CreateReportDto,
  CreateReviewDto,
  FilterParams,
  Place,
  PlaceCategory,
  Review,
} from '../types/place.js';

// Coordinates of Reference Campuses in Hoa Lac
const FPT_CAMPUS = { lat: 21.0135, lng: 105.5252 };
const VNU_CAMPUS = { lat: 21.0162, lng: 105.5235 };

export const CATEGORY_MAP: Record<
  string,
  { id: PlaceCategory; label: string; color: string; bgColor: string; borderColor: string; icon: string }
> = {
  boarding_house: { id: 'boarding_house', label: 'Nhà trọ & CCMN', color: '#ea580c', bgColor: '#ffedd5', borderColor: '#fdba74', icon: 'Home' },
  food_drink: { id: 'food_drink', label: 'Ăn uống & Cafe', color: '#d97706', bgColor: '#fef3c7', borderColor: '#fcd34d', icon: 'UtensilsCrossed' },
  grocery: { id: 'grocery', label: 'Siêu thị & Tạp hóa', color: '#0284c7', bgColor: '#e0f2fe', borderColor: '#7dd3fc', icon: 'ShoppingBag' },
  pharmacy: { id: 'pharmacy', label: 'Hiệu thuốc & Y tế', color: '#dc2626', bgColor: '#fee2e2', borderColor: '#fca5a5', icon: 'Cross' },
  services: { id: 'services', label: 'Sửa xe & Dịch vụ', color: '#0891b2', bgColor: '#cffafe', borderColor: '#67e8f9', icon: 'Wrench' },
  entertainment: { id: 'entertainment', label: 'Giải trí & Thể thao', color: '#7c3aed', bgColor: '#ede9fe', borderColor: '#c4b5fd', icon: 'Gamepad2' },
  campus: { id: 'campus', label: 'Trường & Điểm đón Bus', color: '#16a34a', bgColor: '#dcfce7', borderColor: '#86efac', icon: 'GraduationCap' },
};

// Haversine distance in meters
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

function parseArrayField(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Postgres array string format {val1,val2}
      if (val.startsWith('{') && val.endsWith('}')) {
        return val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
      }
      return [val];
    }
  }
  return [];
}

export function mapRowToPlace(row: any, reviews: Review[] = []): Place {
  const catKey = (row.category_name || 'boarding_house') as PlaceCategory;
  const meta = CATEGORY_MAP[catKey] || CATEGORY_MAP['boarding_house'];

  const lat = Number(row.latitude) || 21.0185;
  const lng = Number(row.longitude) || 105.5345;

  const rawAmenities = parseArrayField(row.amenities);
  const rawImages = parseArrayField(row.images);

  const distFPT = calculateDistance(lat, lng, FPT_CAMPUS.lat, FPT_CAMPUS.lng);
  const distVNU = calculateDistance(lat, lng, VNU_CAMPUS.lat, VNU_CAMPUS.lng);

  const ratingAvg =
    reviews.length > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : 4.8;

  const amenitiesList: Amenity[] = rawAmenities.map((label: string) => ({
    icon: 'Check',
    label,
    available: true,
  }));

  const photosList =
    rawImages.length > 0
      ? rawImages
      : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'];

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
      lat,
      lng,
    },
    distanceToFPT: `${formatDistance(distFPT)} (Cổng ĐH FPT)`,
    distanceToVNU: `${formatDistance(distVNU)} (KTX ĐHQG)`,
    priceInfo:
      row.rent_price || row.min_price
        ? {
            amount: row.rent_price || row.min_price || 0,
            unit: 'tháng',
            electricity: row.electricity_price,
            water: row.water_price ? parseInt(String(row.water_price), 10) || undefined : undefined,
          }
        : undefined,
    phone: row.phone,
    zaloPhone: row.phone,
    photos: photosList,
    tags: rawAmenities,
    amenities: amenitiesList,
    rating: ratingAvg,
    reviewCount: reviews.length,
    reviews,
    isVerified: true,
    isAvailable: row.room_status ? row.room_status !== 'full' : true,
    openingHours: row.opening_hours,
    badgeText: row.room_status === 'available' ? 'Còn phòng' : undefined,
  };
}

export const placesService = {
  /**
   * Get all places with multi-criteria filtering and spatial bounding box
   */
  async getPlaces(filters: FilterParams = {}): Promise<Place[]> {
    let sql = `
      SELECT p.*, c.name as category_name, cont.contributor_name
      FROM places p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN contributions cont ON p.contribution_id = cont.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let pIdx = 1;

    if (filters.category && filters.category !== 'all') {
      sql += ` AND c.name = $${pIdx++}`;
      params.push(filters.category);
    }

    if (filters.area && filters.area !== 'all') {
      sql += ` AND p.area LIKE $${pIdx++}`;
      params.push(`%${filters.area}%`);
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      sql += ` AND (p.min_price >= $${pIdx} OR p.rent_price >= $${pIdx++})`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      sql += ` AND (p.max_price <= $${pIdx} OR (p.rent_price > 0 AND p.rent_price <= $${pIdx++}))`;
      params.push(filters.maxPrice);
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = `%${filters.searchQuery.trim()}%`;
      sql += ` AND (p.name LIKE $${pIdx} OR p.address LIKE $${pIdx} OR p.area LIKE $${pIdx++})`;
      params.push(q);
    }

    if (filters.bbox) {
      sql += ` AND p.longitude >= $${pIdx++} AND p.longitude <= $${pIdx++} AND p.latitude >= $${pIdx++} AND p.latitude <= $${pIdx++}`;
      params.push(filters.bbox.minLng, filters.bbox.maxLng, filters.bbox.minLat, filters.bbox.maxLat);
    }

    // Default sorting
    sql += ` ORDER BY p.id DESC`;

    const res = await db.query(sql, params);

    // Fetch all reviews for these places
    const placeIds = res.rows.map((r) => r.id);
    let reviewsByPlace = new Map<number, Review[]>();

    if (placeIds.length > 0) {
      const revSql = `SELECT * FROM reviews ORDER BY id DESC`;
      const revRes = await db.query(revSql);
      for (const rev of revRes.rows) {
        const pId = Number(rev.place_id);
        if (!reviewsByPlace.has(pId)) {
          reviewsByPlace.set(pId, []);
        }
        reviewsByPlace.get(pId)!.push({
          id: String(rev.id),
          authorName: rev.author_name || 'Sinh viên Hòa Lạc',
          studentBatch: 'Sinh viên FPTU/VNU',
          rating: rev.rating,
          comment: rev.content,
          createdAt: rev.created_at ? new Date(rev.created_at).toISOString().split('T')[0] : '',
        });
      }
    }

    let places = res.rows.map((row) => {
      const revs = reviewsByPlace.get(Number(row.id)) || [];
      return mapRowToPlace(row, revs);
    });

    // Secondary sorting in memory if needed
    if (filters.sortBy === 'rating') {
      places.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'price_asc') {
      places.sort((a, b) => (a.priceInfo?.amount || 0) - (b.priceInfo?.amount || 0));
    } else if (filters.sortBy === 'price_desc') {
      places.sort((a, b) => (b.priceInfo?.amount || 0) - (a.priceInfo?.amount || 0));
    } else if (filters.sortBy === 'distance') {
      // Sort by distance to FPT campus
      places.sort((a, b) => {
        const dA = calculateDistance(a.coordinates.lat, a.coordinates.lng, FPT_CAMPUS.lat, FPT_CAMPUS.lng);
        const dB = calculateDistance(b.coordinates.lat, b.coordinates.lng, FPT_CAMPUS.lat, FPT_CAMPUS.lng);
        return dA - dB;
      });
    }

    return places;
  },

  /**
   * Get single place by ID with full reviews
   */
  async getPlaceById(id: string | number): Promise<Place | null> {
    const numId = Number(id);
    const sql = `
      SELECT p.*, c.name as category_name, cont.contributor_name
      FROM places p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN contributions cont ON p.contribution_id = cont.id
      WHERE p.id = $1
    `;
    const res = await db.query(sql, [numId]);
    if (res.rows.length === 0) {
      return null;
    }

    const revSql = `SELECT * FROM reviews WHERE place_id = $1 ORDER BY id DESC`;
    const revRes = await db.query(revSql, [numId]);
    const revs: Review[] = revRes.rows.map((rev) => ({
      id: String(rev.id),
      authorName: rev.author_name || 'Sinh viên Hòa Lạc',
      studentBatch: 'Sinh viên FPTU/VNU',
      rating: rev.rating,
      comment: rev.content,
      createdAt: rev.created_at ? new Date(rev.created_at).toISOString().split('T')[0] : '',
    }));

    return mapRowToPlace(res.rows[0], revs);
  },

  /**
   * Create a new place (Supports "Chấm vào bản đồ" - Map Pinning!)
   */
  async createPlace(dto: CreatePlaceDto): Promise<Place> {
    const lat = Number(dto.coordinates?.lat ?? dto.latitude);
    const lng = Number(dto.coordinates?.lng ?? dto.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Tọa độ GPS (latitude, longitude) là bắt buộc khi chấm vào bản đồ!');
    }

    if (!dto.name || !dto.name.trim()) {
      throw new Error('Tên địa điểm là bắt buộc!');
    }

    // 1. Resolve Category ID
    let categoryId = dto.categoryId;
    const catName = typeof dto.category === 'string' ? dto.category : 'boarding_house';
    if (!categoryId) {
      const catRes = await db.query('SELECT id FROM categories WHERE name = $1', [catName]);
      if (catRes.rows.length > 0) {
        categoryId = Number(catRes.rows[0].id);
      } else {
        // default to first category
        const firstCat = await db.query('SELECT id FROM categories LIMIT 1');
        categoryId = Number(firstCat.rows[0]?.id || 1);
      }
    }

    // 2. Resolve Contributor ID (from Read_me.txt surveyors or anonymous)
    let contributionId: number | null = null;
    if (dto.contributorName && dto.contributorName.trim()) {
      const contribName = dto.contributorName.trim();
      const contRes = await db.query('SELECT id FROM contributions WHERE contributor_name = $1', [contribName]);
      if (contRes.rows.length > 0) {
        contributionId = Number(contRes.rows[0].id);
      } else {
        const ins = await db.query(
          'INSERT INTO contributions (contributor_name) VALUES ($1) RETURNING id',
          [contribName]
        );
        contributionId = Number(ins.rows[0]?.id);
      }
    }

    // 3. Normalize amenities and images
    let amenitiesArr: string[] = [];
    if (Array.isArray(dto.amenities)) {
      amenitiesArr = dto.amenities.map((a: any) => (typeof a === 'string' ? a : a.label));
    } else if (Array.isArray(dto.tags)) {
      amenitiesArr = dto.tags;
    }

    let imagesArr: string[] = [];
    if (Array.isArray(dto.photos)) {
      imagesArr = dto.photos;
    } else if (Array.isArray(dto.images)) {
      imagesArr = dto.images;
    }

    const minPrice = dto.minPrice ?? dto.priceInfo?.amount ?? 0;
    const maxPrice = dto.maxPrice ?? dto.priceInfo?.amount ?? 0;
    const rentPrice = dto.rentPrice ?? (catName === 'boarding_house' ? minPrice : 0);
    const electricityPrice = dto.electricityPrice ?? dto.priceInfo?.electricity ?? 0;
    const waterPrice = dto.waterPrice ? String(dto.waterPrice) : dto.priceInfo?.water ? `${dto.priceInfo.water}/khối` : '';
    const roomStatus = dto.roomStatus || 'available';

    const amenitiesVal = db.isPostgres ? amenitiesArr : JSON.stringify(amenitiesArr);
    const imagesVal = db.isPostgres ? imagesArr : JSON.stringify(imagesArr);

    const insertSql = `
      INSERT INTO places (
        category_id, contribution_id, name, area, address,
        latitude, longitude, min_price, max_price, rent_price,
        electricity_price, water_price, room_status, opening_hours,
        phone, amenities, images
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id
    `;

    const insRes = await db.query(insertSql, [
      categoryId,
      contributionId,
      dto.name.trim(),
      dto.areaName || dto.area || 'Hòa Lạc',
      dto.address || 'Hòa Lạc, Thạch Thất, Hà Nội',
      lat,
      lng,
      minPrice,
      maxPrice,
      rentPrice,
      electricityPrice,
      waterPrice,
      roomStatus,
      dto.openingHours || '08:00 - 22:00',
      dto.phone || dto.zaloPhone || '',
      amenitiesVal,
      imagesVal,
    ]);

    const newId = Number(insRes.rows[0]?.id);

    // 4. If initial review provided by surveyor
    if (dto.rating || dto.reviewContent) {
      await db.query(
        `INSERT INTO reviews (place_id, contribution_id, author_name, rating, content)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          newId,
          contributionId,
          dto.contributorName || 'Người khảo sát',
          dto.rating || 5,
          dto.reviewContent || 'Địa điểm mới được khảo sát thực địa tại Hòa Lạc.',
        ]
      );
    }

    const createdPlace = await this.getPlaceById(newId);
    if (!createdPlace) {
      throw new Error('Lỗi khi lấy dữ liệu địa điểm vừa tạo.');
    }

    return createdPlace;
  },

  /**
   * Find places nearby a coordinate (Spatial Haversine calculation)
   */
  async getNearbyPlaces(lat: number, lng: number, radiusMeters: number = 1000): Promise<Place[]> {
    const all = await this.getPlaces();
    const nearby = all
      .map((p) => {
        const dist = calculateDistance(lat, lng, p.coordinates.lat, p.coordinates.lng);
        return { place: p, distance: dist };
      })
      .filter((item) => item.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.place);

    return nearby;
  },

  /**
   * Add student review
   */
  async addReview(placeId: string | number, dto: CreateReviewDto): Promise<Review> {
    const numPlaceId = Number(placeId);
    let contribId: number | null = null;

    if (dto.contributorName) {
      const cRes = await db.query('SELECT id FROM contributions WHERE contributor_name = $1', [dto.contributorName]);
      if (cRes.rows.length > 0) {
        contribId = Number(cRes.rows[0].id);
      }
    }

    const ins = await db.query(
      `INSERT INTO reviews (place_id, contribution_id, author_name, rating, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [numPlaceId, contribId, dto.authorName || 'Sinh viên Hòa Lạc', dto.rating, dto.comment]
    );

    const newRevId = ins.rows[0]?.id;
    const createdAt = ins.rows[0]?.created_at
      ? new Date(ins.rows[0].created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    return {
      id: String(newRevId || Date.now()),
      authorName: dto.authorName || 'Sinh viên Hòa Lạc',
      studentBatch: dto.studentBatch || 'Sinh viên FPTU/VNU',
      rating: dto.rating,
      comment: dto.comment,
      createdAt,
    };
  },

  /**
   * Submit report about incorrect place info
   */
  async createReport(dto: CreateReportDto): Promise<{ success: boolean; message: string }> {
    await db.query(
      `INSERT INTO reports (place_id, reason, note, contact_email)
       VALUES ($1, $2, $3, $4)`,
      [Number(dto.placeId) || null, dto.reason, dto.note, dto.contactEmail || null]
    );

    return {
      success: true,
      message: 'Cảm ơn bạn! Báo cáo đã được ghi nhận.',
    };
  },

  /**
   * Get categories with counts
   */
  async getCategories(): Promise<CategoryMeta[]> {
    const catRes = await db.query('SELECT id, name, description FROM categories');
    const countRes = await db.query(`
      SELECT c.name, COUNT(p.id) as place_count
      FROM categories c
      LEFT JOIN places p ON p.category_id = c.id
      GROUP BY c.name
    `);

    const countMap = new Map<string, number>();
    countRes.rows.forEach((r) => countMap.set(r.name, Number(r.place_count)));

    const result: CategoryMeta[] = Object.values(CATEGORY_MAP).map((meta) => ({
      ...meta,
      count: countMap.get(meta.id) || 0,
    }));

    return result;
  },

  /**
   * Get list of survey contributors
   */
  async getContributors(): Promise<{ id: number; name: string }[]> {
    const res = await db.query('SELECT id, contributor_name FROM contributions ORDER BY id ASC');
    return res.rows.map((r) => ({ id: Number(r.id), name: r.contributor_name }));
  },
};
