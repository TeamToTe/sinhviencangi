# 🗺️ HOLA MAP - Frontend Application

Web app bản đồ tra cứu dịch vụ, phòng trọ, quán xá cho sinh viên khu vực Hòa Lạc (Đại học FPT Hà Nội & ĐHQGHN). Thiết kế visual theo phong cách phẳng, vector sinh động (tham khảo `docs/style.jpg`).

---

## 🛠️ Tech Stack Đã Triển Khai

- **Core Framework**: React 19 + TypeScript + Vite
- **Map Engine**: MapLibre GL JS (WebGL / GPU Accelerated 60fps)
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans Font
- **State Management**: Zustand (Map Viewport, Filters, Bookmarks/Favorites)
- **Icons**: Lucide React
- **Micro-interactions**: Canvas Confetti, animated speech-bubble pins

---

## 🚀 Hướng Dẫn Chạy Project

### 1. Cài đặt dependencies:
```bash
cd frontend
npm install
```

### 2. Chạy môi trường Development (Mặc định dùng Mock Data):
```bash
npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:3000`.

### 3. Build Production:
```bash
npm run build
```

---

## 🔌 Tích hợp Backend

Xem hướng dẫn chi tiết tại [README_BACKEND.md](../README_BACKEND.md).

Chỉ cần cập nhật cấu hình trong `.env`:
```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080/api
```
