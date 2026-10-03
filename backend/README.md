# 🚀 ConnectHub Backend API (Sinh Viên Cần Gì? - Hola Map)

Backend REST API hiệu năng cao phục vụ ứng dụng bản đồ tương tác tra cứu phòng trọ, ẩm thực, tiện ích sinh viên quanh khu vực Hòa Lạc (Đại học FPT Hà Nội & ĐHQGHN).

---

## 🏗️ 1. Kiến Trúc & Thiết Kế Hệ Thống

- **Runtime**: Node.js v20+ / v24+ & TypeScript
- **Framework**: Express.js
- **Database Engine kép (Dual-Engine)**:
  1. **SQLite Embedded (Mặc định)**: Tự động khởi tạo và chạy ngay lập tức mà không cần cài đặt Docker hay PostgreSQL. Lưu trữ file tại `backend/data/connecthub.sqlite`.
  2. **PostgreSQL / Supabase (Production)**: Kích hoạt tức thì khi truyền biến môi trường `DATABASE_URL`. Áp dụng 100% chuẩn cấu trúc bảng từ migration `supabase/migrations/20261001000100_create_connecthub.sql`.
- **Dữ liệu Khảo sát thực địa (Field Survey)**:
  Tích hợp cấu trúc dữ liệu theo đúng bản đặc tả Google Form trong `Read_me.txt`:
  - 6 Điều tra viên khảo sát thực tế: *Đặng Cao Cường, Đào Thế Việt, Trần Đức Thịnh, Phạm Mạnh Giang, Ngô Quang Huy, Mai Xuân Dương*.
  - Đầy đủ thông tin: Tọa độ GPS Google Maps, Tên biển hiệu, Danh mục dịch vụ, Giá cả (thấp nhất, cao nhất, giá thuê phòng, điện, nước), Tình trạng phòng, Tiện ích, Ảnh thực tế, Đánh giá sao & Nhận xét.

---

## ⚡ 2. Hướng Dẫn Cài Đặt & Chạy Nhanh

### Bước 1: Cài đặt dependencies
```bash
cd backend
npm install
```

### Bước 2: Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Server sẽ tự động:
- Kiểm tra & tạo cấu trúc database (`categories`, `contributions`, `places`, `reviews`, `reports`).
- Tự động seed danh mục chuẩn, danh sách điều tra viên và các địa điểm thực tế quanh Hòa Lạc.
- Chạy tại: `http://localhost:8080`

### Bước 3: Chạy Integration Tests
```bash
npm test
```
Bộ kiểm thử tự động 10 kịch bản API bao gồm cả tính năng **Chấm vào bản đồ**, lọc Bounding Box, kiểm tra khoảng cách và tính toán tọa độ GPS.

### Bước 4: Build Production
```bash
npm run build
npm start
```

---

## 📍 3. Tính Năng Mới Dành Cho Frontend: "Chấm Vào Bản Đồ" (Map Pinning)

Đội ngũ Frontend khi triển khai tính năng click/chấm điểm trên bản đồ tương tác để người dùng/điều tra viên thêm địa điểm mới hoặc khảo sát vị trí sẽ sử dụng 2 endpoints:

### A. Kiểm tra địa điểm xung quanh vị trí vừa chấm (`GET /api/places/nearby`)
Tránh tạo trùng địa điểm hoặc hiển thị các quán gần điểm chấm:
```http
GET /api/places/nearby?lat=21.0185&lng=105.5345&radius=500
```
- `lat`, `lng`: Tọa độ vị trí người dùng vừa click trên Leaflet Map.
- `radius`: Bán kính tính theo mét (mặc định 1000m = 1km). Tính toán bằng công thức Haversine chuẩn xác.

### B. Thêm địa điểm mới từ điểm vừa chấm (`POST /api/places`)
Lưu địa điểm mới vào Database và trả về định dạng `Place` hoàn chỉnh để hiển thị ngay lập tức lên bản đồ:
```http
POST /api/places
Content-Type: application/json

{
  "name": "Tiệm Trà Sữa Đóm Đóm Tân Xã",
  "category": "food_drink",
  "coordinates": {
    "lat": 21.0195,
    "lng": 105.5350
  },
  "address": "Số 9 ngõ 2 Tân Xã, Thạch Thất, Hà Nội",
  "areaName": "Tân Xã",
  "priceInfo": {
    "amount": 30000,
    "unit": "ly"
  },
  "phone": "0988112233",
  "openingHours": "08:00 - 23:00",
  "amenities": ["Có điều hòa", "Wifi miễn phí", "Thanh toán QR", "View hồ Tân Xã"],
  "photos": ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"],
  "contributorName": "Đặng Cao Cường",
  "rating": 5,
  "reviewContent": "Quán mới mở view hồ cực chill, trà sữa thơm ngon giá sinh viên!"
}
```

---

## 📡 4. Danh Sách Các REST API Endpoints

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra tình trạng server, uptime & loại DB đang kết nối |
| `GET` | `/api/stats` | Thống kê số lượng địa điểm, đánh giá, danh mục, người đóng góp |
| `GET` | `/api/places` | Lấy danh sách địa điểm (hỗ trợ `q`, `category`, `area`, `minPrice`, `maxPrice`, `sortBy`, `bbox`) |
| `GET` | `/api/places/:id` | Xem chi tiết 1 địa điểm kèm tất cả reviews |
| `GET` | `/api/places/nearby` | Tìm kiếm các địa điểm gần tọa độ GPS cho tính năng chấm bản đồ |
| `POST` | `/api/places` | Tạo/Ghim địa điểm mới vào database |
| `POST` | `/api/places/:id/reviews` | Thêm đánh giá & xếp hạng sao cho địa điểm |
| `GET` | `/api/categories` | Lấy danh sách danh mục và số lượng địa điểm thực tế |
| `POST` | `/api/reports` | Tiếp nhận báo cáo thông tin sai lệch từ sinh viên |
| `GET` | `/api/contributions` | Danh sách điều tra viên / người đóng góp dữ liệu |

---

## 🔌 5. Kết Nối Frontend Với Backend Thật

1. Trong thư mục `frontend/`, tạo file `.env`:
```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080/api
```
2. Chạy backend tại cổng 8080: `npm run dev` trong `backend/`.
3. Chạy frontend: `npm run dev` trong `frontend/`. Toàn bộ dữ liệu trên bản đồ sẽ được truy vấn trực tiếp từ cơ sở dữ liệu thật!
