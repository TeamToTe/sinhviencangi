# 🗺️ HOLA MAP - Hướng Dẫn Tích Hợp Cho Đội Ngũ Backend (API Specification)

Tài liệu này cung cấp toàn bộ thông tin chuẩn hóa về **Data Schema**, **REST API Endpoints**, **Cấu hình tích hợp** và **Gợi ý thiết kế Database tối ưu độ trễ thấp** cho ứng dụng bản đồ dịch vụ sinh viên Hòa Lạc (ĐH FPT & ĐHQGHN).

---

## 🚀 1. Cách Kết Nối Frontend Với Backend Thật

Frontend được thiết kế theo mô hình **Adapter Service**, cho phép chuyển đổi tức thì giữa **Mock Data** và **Real Backend API** chỉ qua 1 biến môi trường:

1. Mở file [frontend/.env](file:///d:/FPT/FA26/SSG/frontend/.env) (hoặc copy từ [frontend/.env.example](file:///d:/FPT/FA26/SSG/frontend/.env.example)):
   ```env
   # Chuyển thành false để kết nối Backend thật
   VITE_USE_MOCK=false

   # URL trỏ tới API Backend của bạn (VD: Spring Boot, Go, Node.js, FastAPI, NestJS)
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
2. Khởi động Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📡 2. Danh Sách REST API Endpoints Chi Tiết

### 2.1. Lấy danh sách địa điểm (`GET /api/places`)
Endpoint chính để truy vấn các địa điểm trên bản đồ và hiển thị danh sách bên thanh điều hướng.

- **Method**: `GET`
- **Path**: `/api/places`
- **Query Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- | :--- |
| `q` | `string` | Không | Từ khóa tìm kiếm (tên, địa chỉ, tag) | `q=tân xã` |
| `category` | `string` | Không | Mã danh mục (`boarding_house`, `food_drink`, `grocery`, `pharmacy`, `services`, `entertainment`, `campus`) | `category=boarding_house` |
| `area` | `string` | Không | Khu vực (`Tân Xã`, `Thạch Hòa`, `Bình Yên`, `Khu CNC Hòa Lạc`) | `area=Tân Xã` |
| `minPrice` | `number` | Không | Giá tối thiểu (VND) | `minPrice=2000000` |
| `maxPrice` | `number` | Không | Giá tối đa (VND) | `maxPrice=3500000` |
| `sortBy` | `string` | Không | Sắp xếp: `rating`, `price_asc`, `price_desc`, `distance` | `sortBy=rating` |
| `minLng` | `float` | Không | Kinh độ góc Tây Nam (Bounding box) | `minLng=105.5100` |
| `minLat` | `float` | Không | Vĩ độ góc Tây Nam (Bounding box) | `minLat=21.0000` |
| `maxLng` | `float` | Không | Kinh độ góc Đông Bắc (Bounding box) | `maxLng=105.5400` |
| `maxLat` | `float` | Không | Vĩ độ góc Đông Bắc (Bounding box) | `maxLat=21.0300` |

- **Sample Response** (`200 OK`):
```json
[
  {
    "id": "tro-happy-house-tan-xa",
    "name": "Chung Cư Mini Happy House Tân Xã",
    "slug": "ccmn-happy-house-tan-xa",
    "category": "boarding_house",
    "categoryLabel": "Nhà trọ & CCMN",
    "categoryColor": "#ea580c",
    "iconName": "Home",
    "shortDescription": "Phòng mới xây 100%, có ban công view hồ Tân Xã mát mẻ, thang máy thẻ từ.",
    "fullDescription": "Tòa nhà CCMN 6 tầng mới tinh tại Tân Xã. Đầy đủ tiện nghi: điều hòa Inverter, nóng lạnh...",
    "address": "Số 18 Ngõ 3 Hồ Tân Xã, Xã Tân Xã, Thạch Thất, Hà Nội",
    "areaName": "Tân Xã",
    "coordinates": {
      "lng": 105.5345,
      "lat": 21.0185
    },
    "distanceToFPT": "850m (3 phút xe máy)",
    "distanceToVNU": "2.1km",
    "priceInfo": {
      "amount": 2800000,
      "unit": "tháng",
      "electricity": 3500,
      "water": 25000,
      "internet": 100000,
      "serviceFee": 120000
    },
    "phone": "0987123456",
    "zaloPhone": "0987123456",
    "photos": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
    ],
    "tags": ["Có điều hòa", "Gác xép cao", "Thang máy", "Khóa vân tay"],
    "amenities": [
      { "icon": "AirVent", "label": "Điều hòa Inverter", "available": true },
      { "icon": "Flame", "label": "Bình nóng lạnh 30L", "available": true },
      { "icon": "Wifi", "label": "Wifi cáp quang riêng", "available": true }
    ],
    "rating": 4.7,
    "reviewCount": 23,
    "reviews": [],
    "isVerified": true,
    "isAvailable": true,
    "badgeText": "Còn 2 phòng"
  }
]
```

---

### 2.2. Lấy chi tiết 1 địa điểm (`GET /api/places/:id`)
- **Method**: `GET`
- **Path**: `/api/places/{id}`
- **Sample Response** (`200 OK`): Trả về toàn bộ object `Place` kèm mảng `reviews` chi tiết.

---

### 2.3. Lấy danh sách danh mục & số lượng (`GET /api/categories`)
- **Method**: `GET`
- **Path**: `/api/categories`
- **Sample Response** (`200 OK`):
```json
[
  {
    "id": "boarding_house",
    "label": "Nhà trọ & CCMN",
    "icon": "Home",
    "color": "#ea580c",
    "bgColor": "#ffedd5",
    "borderColor": "#fdba74",
    "count": 48
  }
]
```

---

### 2.4. Thêm đánh giá sinh viên (`POST /api/places/:id/reviews`)
- **Method**: `POST`
- **Path**: `/api/places/{id}/reviews`
- **Body**:
```json
{
  "placeId": "tro-happy-house-tan-xa",
  "authorName": "Nguyễn Văn A",
  "studentBatch": "K18 FPTU",
  "rating": 5,
  "comment": "Phòng sạch sẽ, bác chủ thân thiện!"
}
```
- **Sample Response** (`201 Created`):
```json
{
  "id": "rev-1715000000",
  "authorName": "Nguyễn Văn A",
  "studentBatch": "K18 FPTU",
  "rating": 5,
  "comment": "Phòng sạch sẽ, bác chủ thân thiện!",
  "createdAt": "2026-09-29"
}
```

---

### 2.5. Báo cáo thông tin sai lệch (`POST /api/reports`)
- **Method**: `POST`
- **Path**: `/api/reports`
- **Body**:
```json
{
  "placeId": "tro-happy-house-tan-xa",
  "reason": "wrong_price",
  "note": "Chủ nhà đã tăng giá lên 3.000.000đ từ tháng trước",
  "contactEmail": "sinhvien@fpt.edu.vn"
}
```
- **Sample Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Cảm ơn bạn! Báo cáo đã được ghi nhận."
}
```

---

## 🗄️ 3. Gợi Ý Thiết Kế Database Cho Tốc Độ Truy Vấn Cực Cao (< 15ms)

Để đáp ứng phục vụ **nhiều sinh viên cùng truy cập cùng lúc** khi tìm trọ vào đầu kỳ học:

### 3.1. PostgreSQL + PostGIS (Khuyến nghị)
Sử dụng kiểu dữ liệu không gian `GEOMETRY(Point, 4326)` hoặc `GEOGRAPHY(Point, 4326)` kèm Spatial Index (GIST):

```sql
-- Kích hoạt extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Bảng địa điểm
CREATE TABLE places (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    category VARCHAR(50) NOT NULL,
    category_label VARCHAR(100),
    category_color VARCHAR(20),
    icon_name VARCHAR(50),
    short_description TEXT,
    full_description TEXT,
    address VARCHAR(255),
    area_name VARCHAR(100),
    location GEOGRAPHY(Point, 4326) NOT NULL, -- Tọa độ GPS [lng, lat]
    distance_to_fpt VARCHAR(50),
    distance_to_vnu VARCHAR(50),
    price_amount BIGINT,
    price_unit VARCHAR(50),
    electricity_price INT,
    water_price INT,
    internet_price INT,
    service_fee INT,
    phone VARCHAR(20),
    zalo_phone VARCHAR(20),
    photos TEXT[], -- Mảng URL ảnh
    tags TEXT[],   -- Mảng từ khóa
    rating NUMERIC(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    opening_hours VARCHAR(100),
    badge_text VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index không gian cực nhanh cho Bounding Box query
CREATE INDEX idx_places_location ON places USING GIST (location);
CREATE INDEX idx_places_category ON places (category);
CREATE INDEX idx_places_area ON places (area_name);
```

### 3.2. Query Bounding Box Query mẫu (PostGIS):
```sql
-- Lấy tất cả địa điểm trong khung nhìn map hiện tại của người dùng
SELECT id, name, category, ST_X(location::geometry) AS lng, ST_Y(location::geometry) AS lat, price_amount
FROM places
WHERE location && ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)
  AND (:category IS NULL OR category = :category);
```

---

## 🐳 4. Chạy Frontend Production Bằng Docker

```bash
cd frontend
docker build -t holamap-frontend:latest .
docker run -d -p 80:80 holamap-frontend:latest
```

---
*Bản quyền phát triển: Nhóm FPTU - VNU Hòa Lạc Community.*
