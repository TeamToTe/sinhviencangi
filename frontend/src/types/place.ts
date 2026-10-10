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
  studentBatch?: string; // e.g., 'K17 FPTU', 'QH-2022 VNU'
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface PriceInfo {
  amount: number; // in VND
  unit: string;   // 'tháng', 'lần', 'món', 'giờ'
  electricity?: number; // VND / kWh
  water?: number;       // VND / m3 or month
  internet?: number;    // VND / month
  serviceFee?: number;  // Phí dịch vụ chung
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  category: PlaceCategory;
  categoryLabel: string;
  categoryColor: string; // Hex color or Tailwind color token
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  address: string;
  areaName: string; // e.g., 'Tân Xã', 'Bình Yên', 'Thạch Hòa', 'Khu CNC Hòa Lạc'
  coordinates: Coordinates;
  distanceToFPT?: string; // e.g., '600m'
  distanceToVNU?: string; // e.g., '1.2km'
  priceInfo?: PriceInfo;
  phone?: string;
  zaloPhone?: string;
  facebookUrl?: string;
  photos: string[];
  tags: string[]; // e.g., ['Có điều hòa', 'Gác xép', 'Vệ sinh khép kín', 'Free Wifi', 'Không chung chủ']
  amenities: {
    icon: string;
    label: string;
    available: boolean;
  }[];
  rating: number; // 1.0 - 5.0
  reviewCount: number;
  reviews: Review[];
  isVerified: boolean;
  isAvailable?: boolean; // Còn phòng hay hết phòng
  openingHours?: string; // e.g., '07:00 - 22:00' or '24/7'
  badgeText?: string;    // e.g., 'HOT', 'Mới xây', 'Giá rẻ', 'FPT Pick'
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
  category?: PlaceCategory | 'all';
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

export interface CreateReportDto {
  placeId: string;
  reason: 'wrong_info' | 'wrong_price' | 'wrong_phone' | 'closed' | 'other';
  note: string;
  contactEmail?: string;
}

export interface ReportItem {
  id: string;
  placeId: string;
  placeName?: string;
  reason: 'wrong_info' | 'wrong_price' | 'wrong_phone' | 'closed' | 'other';
  reasonLabel?: string;
  note: string;
  contactEmail?: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  adminNote?: string;
}

export interface CreateReviewDto {
  placeId: string;
  authorName: string;
  studentBatch?: string;
  rating: number;
  comment: string;
}

export interface CreatePlaceDto {
  name: string;
  category: PlaceCategory;
  address?: string;
  areaName?: string;
  area?: string;
  coordinates: Coordinates;
  latitude?: number;
  longitude?: number;
  gpsAccuracy?: number;
  minPrice?: number;
  maxPrice?: number;
  rentPrice?: number;
  electricityPrice?: number;
  waterPrice?: string | number;
  roomStatus?: string;
  phone?: string;
  openingHours?: string;
  photos?: string[];
  images?: string[];
  amenities?: string[];
  tags?: string[];
  contributorName?: string;
  rating?: number;
  reviewContent?: string;
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
