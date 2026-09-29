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

export interface CreateReviewDto {
  placeId: string;
  authorName: string;
  studentBatch?: string;
  rating: number;
  comment: string;
}
