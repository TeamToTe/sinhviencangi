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

### 2.6. Chấm địa điểm thực địa bằng GPS (`POST /api/places`)
Endpoint cốt lõi để anh em trong nhóm đi khảo sát thực tế quanh Hòa Lạc bấm **"Chấm vào bản đồ"** trực tiếp trên điện thoại:

- **Method**: `POST`
- **Path**: `/api/places`
- **Body**:
```json
{
  "contributorName": "Đặng Cao Cường",
  "name": "Quán Cơm Tấm K18",
  "category": "food_drink",
  "areaName": "Tân Xã",
  "address": "Số 20 Ngõ 3 Thôn 2 Tân Xã, Thạch Thất, Hà Nội",
  "coordinates": {
    "lat": 21.01852,
    "lng": 105.53451
  },
  "gpsAccuracy": 5.2,
  "minPrice": 30000,
  "maxPrice": 45000,
  "openingHours": "09:00 - 21:00",
  "phone": "0987654321",
  "amenities": ["Có điều hòa", "Wifi miễn phí", "Thanh toán Chuyển khoản / Quét mã QR"],
  "photos": ["/uploads/img_bien_hieu.jpg"],
  "rating": 5,
  "reviewContent": "Bác chủ thân thiện, cơm thêm miễn phí, quán đông vào giờ trưa."
}
```
- **Sample Response** (`201 Created`): Trả về đầy đủ đối tượng `Place` kèm khoảng cách tính tự động tới ĐH FPT và KTX ĐHQG.

---

### 2.7. Tải lên ảnh thực tế từ điện thoại (`POST /api/upload`)
Hỗ trợ chụp trực tiếp từ camera điện thoại hoặc thư viện ảnh:

- **Method**: `POST`
- **Path**: `/api/upload`
- **Body**:
```json
{
  "data": "data:image/jpeg;base64,...",
  "name": "bien_hieu.jpg"
}
```
- **Sample Response** (`201 Created`):
```json
{
  "success": true,
  "url": "/uploads/img_1715000000_abc123.jpg"
}
```

---

### 2.8. Lấy danh sách mẫu câu hỏi khảo sát (`GET /api/places/template`)
- **Method**: `GET`
- **Path**: `/api/places/template`
- **Response**: Trả về danh sách 6 người khảo sát (`Đặng Cao Cường`, `Đào Thế Việt`, `Trần Đức Thịnh`, `Phạm Mạnh Giang`, `Ngô Quang Huy`, `Mai Xuân Dương`), danh mục dịch vụ, danh sách khu vực và 9 tiện ích chuẩn.

---

### 2.9. Tự động nhận diện khu vực từ GPS (`POST /api/places/detect-area`)
- **Method**: `POST`
- **Path**: `/api/places/detect-area`
- **Body**: `{ "lat": 21.0185, "lng": 105.5345 }`
- **Response**: `{ "area": "Tân Xã", "lat": 21.0185, "lng": 105.5345 }`

---

### 2.10. Tiến độ & KPI khảo sát của thành viên (`GET /api/contributions` & `GET /api/stats`)
- **GET `/api/contributions`**: Bảng xếp hạng KPI của từng thành viên (số địa điểm đã chấm, % hoàn thành KPI 10 địa điểm/người).
- **GET `/api/stats`**: Thống kê tổng số địa điểm đã chấm trên mục tiêu 50 địa điểm thực địa.

---

### 2.11. Hướng dẫn FE kích hoạt GPS chuẩn xác trên Điện Thoại
Để điện thoại Android / iOS hỏi quyền truy cập vị trí và đo tọa độ có độ chính xác cao nhất:
```typescript
navigator.geolocation.getCurrentPosition(
  (pos) => {
    const lat = Number(pos.coords.latitude.toFixed(6));
    const lng = Number(pos.coords.longitude.toFixed(6));
    const accuracy = Math.round(pos.coords.accuracy); // mét
    console.log(`Đã khóa GPS: [${lat}, ${lng}] sai số ±${accuracy}m`);
  },
  (err) => {
    if (err.code === 1) {
      alert("Vui lòng mở cài đặt trình duyệt và cấp quyền Vị trí (GPS) để chấm tọa độ chính xác!");
    }
  },
  {
    enableHighAccuracy: true, // BẮT BUỘC để kích hoạt chip GPS điện thoại
    timeout: 12000,
    maximumAge: 0,
  }
```

---

### 2.12. Xóa địa điểm dành cho Quản trị viên (`DELETE /api/places/:id` hoặc `POST /api/places/:id/delete`)
Endpoint cho phép tài khoản Admin xóa vĩnh viễn một địa điểm cùng các đánh giá (reviews) và báo cáo vi phạm (reports) liên quan.

- **Method**: `DELETE` (hoặc `POST /api/places/:id/delete`)
- **Path**: `/api/places/{id}`
- **Yêu cầu bảo mật**: Bearer Token trong Header (`Authorization: Bearer <JWT_TOKEN>`) của tài khoản có role `admin`.
- **Headers**:
  ```http
  Authorization: Bearer <admin_jwt_token>
  ```
- **Phản hồi thành công** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Đã xóa địa điểm 24a3148e-83b5-4d87-a7dd-dccd364cbe69 thành công."
  }
  ```
- **Phản hồi lỗi**:
  - `401 Unauthorized`: Chưa truyền Bearer token hoặc token đã hết hạn.
  - `403 Forbidden`: Người dùng không có vai trò `admin`.
  - `404 Not Found`: Không tìm thấy địa điểm với ID chỉ định.

- **Ví dụ lệnh cURL**:
  ```bash
  # 1. Đăng nhập lấy JWT Admin
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "hola@2026"}'

  # 2. Xóa địa điểm bằng DELETE
  curl -X DELETE http://localhost:8080/api/places/<PLACE_ID> \
    -H "Authorization: Bearer <TOKEN_ADMIN>"

  # 3. Hoặc xóa bằng POST alias
  curl -X POST http://localhost:8080/api/places/<PLACE_ID>/delete \
    -H "Authorization: Bearer <TOKEN_ADMIN>"
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
