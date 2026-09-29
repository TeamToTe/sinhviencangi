# 🗺️ Sinh Viên Cần Gì? (HOLA MAP)

> **Web App Bản Đồ Tương Tác Tra Cứu Dịch Vụ, Phòng Trọ & Tiện Ích Sinh Viên Khu Vực Hòa Lạc (Đại học FPT Hà Nội & ĐHQGHN)**

Visual & Thiết kế UI/UX theo phong cách **Flat-Vector / Festival Map** rực rỡ, hiện đại, tối ưu tốc độ phản hồi thấp (Low Latency) và phục vụ nhiều người dùng cùng lúc.

---

## 🌟 Tính Năng Nổi Bật (Frontend MVP)

- 📍 **Bản đồ 3 Cột Hiện Đại**:
  - Cột trái: Danh sách gợi ý phòng trọ, quán ăn, siêu thị, dịch vụ quanh trường.
  - Cột giữa: Bản đồ tương tác mượt mà, định vị GPS, điều hướng nhanh.
  - Cột phải: Bảng chi tiết phòng trọ (ảnh chụp thực tế, bảng giá điện/nước, hotline gọi điện, nhắn Zalo, chỉ đường Google Maps, đánh giá từ sinh viên).
- 🏷️ **Speech Bubble Markers**: Marker ghim bản đồ thiết kế dạng bong bóng hội thoại bo tròn với icon, badge phân loại màu sắc và hiệu ứng pop-up nảy (bounce).
- ⚡ **Tìm kiếm & Lọc Tức thì (0ms Latency)**: Tìm theo tên, khu vực (Tân Xã, Thạch Hòa, Bình Yên, Khu CNC), khoảng giá (`< 2tr`, `2tr - 3.5tr`, `> 3.5tr`), tiện ích (Điều hòa, Thang máy, Khóa vân tay, PCCC...).
- 💖 **Lưu địa điểm yêu thích**: Tích hợp lưu trữ LocalStorage kèm hiệu ứng pháo hoa (Confetti).
- 🔌 **Kiến trúc Adapter sẵn sàng cho Backend**: Chuyển đổi 1-click giữa Mock Data và Real Backend API qua file `.env`.

---

## 🛠️ Tech Stack

- **Core Framework**: React 19 + TypeScript + Vite
- **Map Engine**: Leaflet (HTML5 Canvas & DivIcon Speech-Bubble Pins)
- **Map Tiles**: OpenStreetMap Humanitarian (HOT) & Esri World Street (100% Free & No API Key Required)
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans
- **State Management**: Zustand
- **Icons**: Lucide React
- **Container**: Docker + Nginx (Gzip compression)

---

## 🚀 Khởi Chạy Dự Án

### Yêu cầu:
- Node.js >= 18
- npm >= 9

### Cài đặt và chạy:
```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy môi trường Development
npm run dev
```
Trình duyệt sẽ tự động mở tại: `http://localhost:3000`

### Build Production:
```bash
cd frontend
npm run build
```

---

## 📖 Hướng Dẫn Tích Hợp Cho Đội Ngũ Backend

Xem chi tiết đặc tả 5 REST API Endpoints, JSON Schema mẫu và gợi ý thiết kế Database tối ưu tại:
👉 **[README_BACKEND.md](./README_BACKEND.md)**

---

## 👥 Nhóm Phát Triển
Dự án được xây dựng bởi **TeamToTe** cho cộng đồng sinh viên FPTU & VNU Hòa Lạc.
