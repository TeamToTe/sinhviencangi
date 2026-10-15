# 🗺️ Hòa Lạc POI Pipeline - Bản Đồ Sinh Viên FPT

Pipeline cào dữ liệu, lọc và chuẩn hóa địa điểm (POI) khu vực Hòa Lạc phục vụ bản đồ sinh viên FPT (`sinhviencangi`).

## Vùng bao phủ
Từ **trục đường N18 hất lên phía bắc** bao gồm:
- Thôn 4 & Thôn 5 Thạch Hòa
- Trục ĐT420 & Chợ Hòa Lạc
- Ngã tư Tân Xã, ven Hồ Tân Xã
- Bình Yên, Phú Hữu
- Khu vực Đại học FPT, Học viện Tài chính, ĐH Điện Lực

---

## 3 Chế độ chạy dữ liệu (KHÔNG đụng vào Database)

```powershell
# Chế độ 1: TEST NHANH (3 quán mẫu kiểm tra định dạng)
python scraper/scrape_hoalac.py --mode test

# Chế độ 2: TOP 25 ĐỊA ĐIỂM NỔI TIẾNG NHẤT (Đủ 7 danh mục sinh viên)
python scraper/scrape_hoalac.py --mode top25

# Chế độ 3: QUÉT FULL TOÀN BỘ VÙNG N18 HẤT LÊN (68 địa điểm)
python scraper/scrape_hoalac.py --mode full
```

---

## Phân bổ 25 địa điểm nổi bật theo 7 danh mục:

| Danh mục | Số lượng | Địa điểm tiêu biểu |
|---|---|---|
| **Ăn uống & Cafe (`food_drink`)** | 6 | Hola Hotpot (cổng phụ), Cơm Tấm Bảo Uyên, Bánh Mì Bamimo, Layla Cafe, The Study Station 24/7, Nhà Hàng 379 Minh Nga |
| **Hiệu thuốc & Y tế (`pharmacy`)** | 3 | Pharmacity Hòa Lạc, Phương Nam Pharmacy, Nhà Thuốc Mỹ Lệ |
| **Siêu thị & Tạp hóa (`grocery`)** | 3 | Chợ Hòa Lạc, WinMart+ Tân Xã, Minimart 79 Cổng Phụ FPT |
| **Sửa xe & Dịch vụ (`services`)** | 4 | Sửa Xe Tuấn Cường 24/7 (cứu hộ đêm), In Ấn & Photo Đồ Án Thôn 3, Kỳ Ngàn Building, Sửa Xe Duẩn An |
| **Giải trí & Thể thao (`entertainment`)** | 3 | King Gaming Cyber Hòa Lạc (RTX 4070), CLB Bida Tân Xã, Sân Bóng Đá Mini Hòa Lạc |
| **Nhà trọ & CCMN (`boarding_house`)** | 4 | CCMN Happy House Tân Xã, Nhà Trọ Minh Cương, Khu Trọ Thanh Phượng (Thôn 5), Lotus House Thạch Hòa |
| **Trường & Bus (`campus`)** | 2 | Đại học FPT Campus Hòa Lạc, Trạm Xe Buýt 107 & 74 Cổng Chính FPT |

---

## Thư mục Output

* `scraper/output/hoalac_places_top25.csv`: Dữ liệu bảng cho Excel/Sheets
* `scraper/output/hoalac_places_top25.geojson`: Dữ liệu GeoJSON tích hợp thẳng vào bản đồ MapLibre
* `scraper/output/hoalac_verify_checklist_top25.csv`: Checklist cầm đi thực địa hoặc mở điện thoại khảo sát
* `scraper/output/import_top25_places.sql`: File SQL lệnh INSERT xem trước an toàn

---

## Nạp vào Supabase (Khi đã sẵn sàng)

```powershell
# 1. Xem trước (Dry Run - Không ghi vào DB):
python scraper/import_to_db.py --csv scraper/output/hoalac_places_top25.csv --dry-run

# 2. Nạp thật qua Supabase REST API (Cần URL & Key):
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_KEY="your-service-role-key"
python scraper/import_to_db.py --csv scraper/output/hoalac_places_top25.csv
```
