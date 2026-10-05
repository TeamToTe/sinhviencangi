# 🗺️ Sinh Viên Cần Gì? (ConnectHub - HOLA MAP)

> **Cẩm nang số & Bản đồ tương tác tra cứu dịch vụ, phòng trọ, quán ăn, tiện ích sinh viên quanh khu vực Hòa Lạc (Đại học FPT Hà Nội & ĐHQGHN)**

[![Frontend](https://img.shields.io/badge/Frontend-React_19_+_TypeScript_+_Vite-61dafb?logo=react)](./frontend)
[![Map Engine](https://img.shields.io/badge/Map_Engine-MapLibre_GL_JS-3388ff?logo=maplibre)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js_v20+_--_Express_+_TS-339933?logo=nodedotjs)](./backend)
[![Database](https://img.shields.io/badge/Database-SQLite_Embedded_|_PostgreSQL_Supabase-003b57?logo=postgresql)](./backend)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38bdf8?logo=tailwindcss)](./frontend)
[![Tests](https://img.shields.io/badge/Backend_Tests-10%2F10_Passing-brightgreen?logo=jest)](./backend/test)

---

## 📖 Giới Thiệu Dự Án

**"Sinh Viên Cần Gì?" (ConnectHub)** là nền tảng bản đồ số chuyên biệt dành cho tân sinh viên và sinh viên đang theo học tại **Đại học FPT Hà Nội (FPTU)** và **Đại học Quốc gia Hà Nội (VNU Hòa Lạc)**. 

Dự án giải quyết triệt để vấn đề thiếu thông tin minh bạch, khó tìm trọ uy tín, quán ăn ngon - bổ - rẻ và các tiện ích đời sống sinh viên tại các khu vực lân cận như **Tân Xã, Thạch Hòa, Bình Yên và Khu Công Nghệ Cao Hòa Lạc**.

---

## 🌟 Tính Năng Nổi Bật

### 💻 1. Frontend & Trải Nghiệm Người Dùng (UI/UX)
- 🧭 **Bản đồ Vector MapLibre GL JS**:
  - Tối ưu hóa GPU WebGL render mượt mà ở tốc độ 60fps.
  - Hỗ trợ xoay góc nhìn 3D (pitch & bearing) và zoom mượt mà.
  - Tiêu điểm mặc định bán kính **3.5km quanh Đại học FPT Hòa Lạc**.
- 🏷️ **Adaptive Speech-Bubble Markers**:
  - Ghim bản đồ dạng bong bóng hội thoại bo tròn kèm icon danh mục trực quan.
  - Hiệu ứng cascade entrance (nảy và xuất hiện so le mềm mại) khi load dữ liệu.
  - Tự động gom cụm hoặc co giãn theo mức độ phóng to (LOD - Level of Detail).
- ⚡ **Tìm kiếm & Bộ lọc Tức thì (0ms Latency)**:
  - Thanh filter dạng nổi 1 hàng (Single-row floating bar) gọn gàng.
  - Lọc theo danh mục: *Nhà trọ & CCMN, Ẩm thực & Cafe, Siêu thị & Tạp hóa, Hiệu thuốc & Y tế, Sửa xe & Dịch vụ, Giải trí & Thể thao, Điểm đón Bus*.
  - Lọc theo khu vực: *Tân Xã, Thạch Hòa, Bình Yên, Khu CNC Hòa Lạc*.
  - Lọc theo mức giá: *< 2tr, 2tr - 3.5tr, > 3.5tr*.
- 📐 **Layout 3 Cột Khoa Học**:
  - **Cột trái**: Danh sách địa điểm cuộn mượt, hiển thị khoảng cách đến FPTU/VNU, giá cả, trạng thái phòng trống.
  - **Cột giữa**: Bản đồ số toàn màn hình với các nút thao tác nhanh (định vị GPS, reset góc nhìn, chuyển layer).
  - **Cột phải**: Drawer chi tiết địa điểm — ảnh chụp thực tế, biểu phí điện/nước, số điện thoại, nút gọi Hotline / nhắn Zalo tức thì, chỉ đường Google Maps.
- 📱 **Tối ưu Mobile First**:
  - Bottom sheet kéo thả vuốt mượt (drag-to-scroll) trên điện thoại.
  - Tự động ẩn các thành phần thừa khi cuộn xem thông tin.
- 🐱 **Interactive Floating Cat**:
  - Widget hoạt ảnh nổi ở góc màn hình tạo điểm nhấn thân thiện, trẻ trung cho sinh viên.
- 💾 **Offline Map Tile Caching (PWA Ready)**:
  - Tích hợp Service Worker (`sw.js`) tự động lưu trước (pre-cache) các ô bản đồ quanh Hòa Lạc, giúp ứng dụng vẫn xem được bản đồ ngay cả khi mạng yếu hoặc offline.
- 🛡️ **Kiến trúc Dữ liệu 3 Lớp Siêu Bền Vững (3-Tier Resilience)**:
  - **Cấp 1**: Kết nối REST API Backend hiệu năng cao.
  - **Cấp 2**: Tự động chuyển đổi truy vấn trực tiếp Supabase Database nếu Backend REST bảo trì.
  - **Cấp 3**: Tự động fallback về Mock Data trong bộ nhớ (0ms downtime).

---

### ⚙️ 2. Backend REST API & Cở Sở Dữ Liệu
- 🚀 **Kiến trúc Node.js + TypeScript + Express.js**:
  - Thiết kế module hóa: Controllers, Routes, Services, Types chuẩn mực.
  - Xử lý CORS linh hoạt, kiểm soát lỗi tập trung (Global Error Handler).
- 🗄️ **Dual Database Engine (SQLite & PostgreSQL / Supabase)**:
  - **SQLite Embedded (Mặc định khi dev)**: Chạy tức thì không cần cài đặt Docker hay PostgreSQL, tự động lưu file tại `backend/data/connecthub.sqlite`.
  - **PostgreSQL / Supabase (Production)**: Kích hoạt tự động khi cấu hình biến môi trường `DATABASE_URL`. Đồng bộ 100% với file migration `supabase/migrations/20261001000100_create_connecthub.sql`.
- 📝 **Tích Hợp Dữ Liệu Khảo Sát Thực Địa (Field Survey)**:
  - Cấu trúc dữ liệu chuẩn hóa theo bản khảo sát thực tế trong `Read_me.txt`.
  - Theo dõi người đóng góp (6 điều tra viên: *Đặng Cao Cường, Đào Thế Việt, Trần Đức Thịnh, Phạm Mạnh Giang, Ngô Quang Huy, Mai Xuân Dương*).
  - Lưu trữ đầy đủ: Tọa độ GPS Google Maps, Khoảng giá thấp nhất/cao nhất, Giá phòng trọ, Giá điện/kWh, Giá nước, Tình trạng phòng, Tiện ích (Điều hòa, Thang máy, PCCC...).
- 📍 **Tính Năng "Chấm Vào Bản Đồ" (Map Pinning & Nearby Search)**:
  - Tính toán khoảng cách tọa độ GPS bằng công thức **Haversine** độ chính xác cao.
  - Endpoint `GET /api/places/nearby`: Tìm các quán/nhà trọ xung quanh tọa độ click chuột trên bản đồ trong bán kính `R` mét, tránh trùng lặp điểm khảo sát.
  - Endpoint `POST /api/places`: Thêm điểm khảo sát mới kèm đánh giá ban đầu và lưu trực tiếp vào cơ sở dữ liệu.
- ⭐ **Đánh giá Sinh viên & Báo cáo Sai lệch**:
  - `POST /api/places/:id/reviews`: Sinh viên chấm điểm sao và để lại nhận xét thực tế.
  - `POST /api/reports`: Tiếp nhận báo cáo khi phòng đã hết, quán đổi giá hoặc sai số điện thoại.
- 🧪 **Kiểm Thử Tự Động (Automated Testing)**:
  - Bộ test suite 10 kịch bản bao quát 100% các luồng API quan trọng (10/10 PASS).

---

## 📁 Cấu Trúc Dự Án

```
SSG/
├── Read_me.txt                   # Hướng dẫn tạo Google Form khảo sát thực địa 50+ địa điểm
├── sinhviencangi/
│   ├── package.json              # Monorepo root scripts (Chạy song song Backend + Frontend qua concurrently)
│   ├── backend/                  # REST API Server (Node.js + Express + TypeScript)
│   │   ├── src/
│   │   │   ├── db/               # Dual-Engine Database Manager (SQLite / Postgres)
│   │   │   │   ├── index.ts      # Database connection abstraction
│   │   │   │   ├── migrate.ts    # Auto-migration schema
│   │   │   │   └── seedData.ts   # Dữ liệu mẫu khảo sát Hòa Lạc & Điều tra viên
│   │   │   ├── routes/           # REST Endpoints (places, categories, reviews, reports, health)
│   │   │   ├── services/         # Business logic, Haversine distance, CRUD
│   │   │   ├── types/            # TypeScript Interfaces & DTOs
│   │   │   ├── app.ts            # Express app configuration & middleware
│   │   │   ├── config.ts         # Environment variables configuration
│   │   │   └── server.ts         # Server entry point
│   │   ├── test/                 # Integration test suite (tsx test/api.test.ts)
│   │   ├── .env.example          # Mẫu biến môi trường Backend
│   │   └── package.json
│   │
│   ├── frontend/                 # Client Web App (React 19 + MapLibre GL + Vite)
│   │   ├── public/
│   │   │   └── sw.js             # Service Worker pre-caching map tiles
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/       # Header, Modal, FloatingGif, FilterBar
│   │   │   │   ├── map/          # MapLibreView, Markers, Controls
│   │   │   │   ├── places/       # PlaceCard, PlaceDetail, ReviewList
│   │   │   │   └── report/       # ReportModal, SuggestModal
│   │   │   ├── data/             # Mock places fallback
│   │   │   ├── services/         # placesService, apiClient, supabaseClient, tileCacheService
│   │   │   ├── store/            # Zustand state management
│   │   │   ├── types/            # Place, Category, Filter types
│   │   │   └── App.tsx
│   │   ├── .env.example          # Mẫu biến môi trường Frontend
│   │   └── package.json
│   │
│   ├── supabase/
│   │   └── migrations/           # SQL Migrations cho Supabase / PostgreSQL
│   ├── README.md                 # Tài liệu tổng quan dự án (Bản bạn đang đọc)
│   └── README_BACKEND.md         # Đặc tả kỹ thuật chi tiết REST API cho Backend
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống:
- **Node.js**: v18.0.0 trở lên (khuyến nghị v20.x hoặc v22.x)
- **npm**: v9.0.0 trở lên

---

### 🔥 Cách 1: Khởi Chạy 1 Lệnh Duy Nhất (Khuyên Dùng - `concurrently`)

Không cần mở nhiều cửa sổ terminal và **không cần `cd frontend` hay `cd backend`**:

```bash
# 1. Đứng tại thư mục gốc dự án
cd sinhviencangi

# 2. Cài đặt dependencies (root, backend, frontend)
npm run install:all
# (hoặc chạy npm install nếu backend/frontend đã có node_modules)

# 3. Khởi chạy đồng thời cả Backend và Frontend!
npm run dev
```

🎯 **Kết quả tự động:**
- 🚀 **Backend REST API**: Chạy tại `http://localhost:8080` (tự động khởi tạo DB SQLite và nạp dữ liệu mẫu khảo sát).
- 🗺️ **Frontend Map App**: Chạy tại `http://localhost:3000` (Vector map MapLibre GL tương tác mượt mà).
- 🖥️ **Terminal đa luồng**: Hiển thị đồng thời log của cả 2 service với tiền tố màu trực quan: `[BACKEND]` (xanh dương) và `[FRONTEND]` (xanh lá).

#### 🛠️ Bảng các lệnh tiện ích tại thư mục gốc:

| Lệnh | Mô tả chi tiết |
| :--- | :--- |
| `npm run dev` | **Chạy song song cả Backend (8080) và Frontend (3000)** qua `concurrently` |
| `npm run dev:backend` | Chỉ khởi chạy riêng Backend API Server |
| `npm run dev:frontend` | Chỉ khởi chạy riêng Frontend Vite Dev Server |
| `npm test` | Chạy toàn bộ 10/10 bài test tự động backend (Health, Nearby, Pinning, Reviews...) |
| `npm run build` | Build Production cho cả Backend (`tsc`) và Frontend (`vite build`) |
| `npm run install:all` | Cài đặt dependencies cho cả root, backend và frontend |

---

### 📦 Cách 2: Khởi Chạy Thủ Công Từng Thư Mục (Truyền Thống)

Nếu bạn muốn debug riêng từng phần trên các tab terminal riêng biệt:

#### A. Khởi chạy Backend API:
```bash
cd sinhviencangi/backend
npm install
copy .env.example .env    # Tùy chọn, mặc định chạy SQLite không cần config
npm run dev
```
- Server chạy tại: `http://localhost:8080`

#### B. Khởi chạy Frontend:
```bash
cd sinhviencangi/frontend
npm install
copy .env.example .env    # Tùy chọn, trỏ VITE_API_BASE_URL=http://localhost:8080/api
npm run dev
```
- Ứng dụng chạy tại: `http://localhost:3000`

---

## 📡 Danh Sách REST API Endpoints

| Phương thức | Endpoint | Tham số chính | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | - | Kiểm tra trạng thái máy chủ, uptime và loại Database |
| `GET` | `/api/stats` | - | Thống kê số lượng địa điểm, đánh giá, danh mục |
| `GET` | `/api/places` | `q`, `category`, `area`, `minPrice`, `maxPrice`, `sortBy`, `bbox` | Lấy danh sách địa điểm theo bộ lọc đa tiêu chí |
| `GET` | `/api/places/:id` | `id` (Param) | Xem chi tiết 1 địa điểm kèm tất cả đánh giá |
| `GET` | `/api/places/nearby` | `lat`, `lng`, `radius` (m) | Tìm các địa điểm xung quanh điểm click trên bản đồ |
| `POST` | `/api/places` | `name`, `coordinates`, `category`, `priceInfo`, `phone`... | **Chấm vào bản đồ** - Thêm địa điểm mới |
| `POST` | `/api/places/:id/reviews` | `rating` (1-5), `comment`, `authorName` | Thêm đánh giá và nhận xét của sinh viên |
| `GET` | `/api/categories` | - | Danh sách danh mục kèm màu sắc, icon và số lượng |
| `POST` | `/api/reports` | `placeId`, `reason`, `note`, `contactEmail` | Gửi báo cáo thông tin sai lệch / phòng đã hết |
| `GET` | `/api/contributions` | - | Danh sách điều tra viên và lịch sử khảo sát thực địa |

> 📌 Chi tiết cấu trúc Request Body, JSON Schema và mã phản hồi cụ thể có thể tham khảo tại [README_BACKEND.md](./README_BACKEND.md) và [backend/README.md](./backend/README.md).

---

## 👥 Thành Viên Dự Án (TeamToTe - Nhóm 2 SSG)

Dự án môn SSG được thực hiện bởi các thành viên:
1. **Đặng Cao Cường**
2. **Đào Thế Việt**
3. **Trần Đức Thịnh**
4. **Phạm Mạnh Giang**
5. **Ngô Quang Huy**
6. **Mai Xuân Dương**

---

## 📄 Bản Quyền & Giấy Phép
Dự án được phân phối dưới giấy phép **MIT License**. Mọi đóng góp từ cộng đồng sinh viên FPTU & VNU Hòa Lạc đều được hoan nghênh!
