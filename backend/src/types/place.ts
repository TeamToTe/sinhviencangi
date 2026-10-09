export type PlaceCategory =
  | 'boarding_house'  // Nhà trọ / Chung cư mini
  | 'food_drink'      // Quán ăn / Trà sữa / Cafe
  | 'grocery'         // Siêu thị / Tạp hóa
  | 'pharmacy'        // Hiệu thuốc / Y tế
  | 'services'        // Sửa xe, giặt là, in ấn
  | 'entertainment'   // Bida, net, thể thao
  | 'campus';         // ĐH FPT, ĐHQG, Điểm đón xe bus

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  studentBatch?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PriceInfo {
  amount: number;
  unit: string;
  electricity?: number;
  water?: number;
  internet?: number;
  serviceFee?: number;
}

export interface Amenity {
  icon: string;
  label: string;
  available: boolean;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  category: PlaceCategory;
  categoryLabel: string;
  categoryColor: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  address: string;
  areaName: string;
  coordinates: Coordinates;
  distanceToFPT?: string;
  distanceToVNU?: string;
  priceInfo?: PriceInfo;
  phone?: string;
  zaloPhone?: string;
  facebookUrl?: string;
  photos: string[];
  tags: string[];
  amenities: Amenity[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  isVerified: boolean;
  isAvailable?: boolean;
  openingHours?: string;
  badgeText?: string;
  gpsAccuracy?: number;
  contributorName?: string;
}

export interface CategoryMeta {
  id: PlaceCategory;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  count?: number;
}

export interface FilterParams {
  category?: string;
  searchQuery?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  onlyAvailable?: boolean;
  onlyVerified?: boolean;
  sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'distance';
  bbox?: BoundingBox;
}

export interface CreatePlaceDto {
  name: string;
  category: PlaceCategory | string;
  categoryId?: number;
  address?: string;
  areaName?: string;
  area?: string;
  coordinates: Coordinates;
  // Alternative flat coordinates
  latitude?: number;
  longitude?: number;
  // Prices
  priceInfo?: Partial<PriceInfo>;
  minPrice?: number;
  maxPrice?: number;
  rentPrice?: number;
  electricityPrice?: number;
  waterPrice?: string | number;
  // Contact & details
  phone?: string;
  zaloPhone?: string;
  openingHours?: string;
  photos?: string[];
  images?: string[];
  tags?: string[];
  amenities?: string[] | Amenity[];
  roomStatus?: string;
  // Contributor / surveyor info (from Read_me.txt Google Form)
  contributorName?: string;
  // GPS metadata
  gpsAccuracy?: number;
  isGpsVerified?: boolean;
  // Initial rating & review from surveyor
  rating?: number;
  reviewContent?: string;
  shortDescription?: string;
  fullDescription?: string;
}

export interface CreateReviewDto {
  placeId: string | number;
  authorName: string;
  studentBatch?: string;
  rating: number;
  comment: string;
  contributorName?: string;
}

export interface CreateReportDto {
  placeId: string | number;
  reason: 'wrong_info' | 'wrong_price' | 'wrong_phone' | 'closed' | 'other' | string;
  note: string;
  contactEmail?: string;
}

export interface ContributorProgress {
  id: number;
  name: string;
  placeCount: number;
  target: number;
  progressPercentage: number;
  recentPlaces: string[];
}

export interface SurveyTemplate {
  surveyors: string[];
  categories: CategoryMeta[];
  areas: string[];
  commonAmenities: string[];
}

export interface SurveyStats {
  totalPlaces: number;
  targetPlaces: number;
  progressPercentage: number;
  totalReviews: number;
  totalCategories: number;
  totalContributors: number;
  byCategory: Record<string, number>;
  byArea: Record<string, number>;
  bySurveyor: { name: string; count: number }[];
}
