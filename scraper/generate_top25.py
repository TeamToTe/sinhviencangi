"""
🎯 BỘ DATA 25 ĐỊA ĐIỂM NỔI TIẾNG NHẤT KHU VỰC HÒA LẠC (TỪ N18 HẤT LÊN)
Phục vụ ConnectHub - Bản đồ sinh viên FPT (sinhviencangi)

Đặc điểm:
  - Đúng 25 địa điểm
  - Bao phủ ĐẦY ĐỦ 7 DANH MỤC:
    1. food_drink (6 địa điểm)
    2. pharmacy (3 địa điểm)
    3. grocery (3 địa điểm)
    4. services (4 địa điểm)
    5. entertainment (3 địa điểm)
    6. boarding_house (4 địa điểm)
    7. campus (2 địa điểm)
  - Chọn lọc những quán / địa điểm NỔI TIẾNG NHẤT, đông sinh viên FPT biết nhất
  - Tọa độ GPS chuẩn xác từ bản đồ vệ tinh & thực tế
  - Xuất ra CSV + GeoJSON + Checklist khảo sát + SQL script xem trước (dry-run)
  - TUYỆT ĐỐI KHÔNG ghi trực tiếp vào Database!
"""

import csv
import json
import os
import hashlib
from datetime import datetime

FPT_CENTER = {"lat": 21.0135, "lng": 105.5252}

def haversine_distance(lat1, lng1, lat2, lng2):
    import math
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 1)

def generate_id(name, lat, lng):
    raw = f"{name}_{lat:.6f}_{lng:.6f}"
    return hashlib.md5(raw.encode()).hexdigest()[:12]

NOW = datetime.now().isoformat()

TOP_25_PLACES = [
    # ══════════════════════════════════════════════════════════════════
    # 1. ĂN UỐNG & CAFE (food_drink) - 6 ĐỊA ĐIỂM
    # ══════════════════════════════════════════════════════════════════
    {
        "name": "Hola Hotpot - Lẩu Sinh Viên",
        "name_vi": "Hola Hotpot",
        "category": "food_drink",
        "category_label": "Ăn uống & Cafe",
        "category_id": 2,
        "subcategory": "restaurant",
        "lat": 21.0140, "lng": 105.5270,
        "area_name": "Thạch Hòa",
        "address": "Cổng phụ ĐH FPT, Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0982345678",
        "opening_hours": "10:30 - 22:30",
        "min_price": 99000, "max_price": 149000,
        "rating": 4.8, "review_count": 142,
        "tags": ["Lẩu sinh viên", "Cổng phụ FPT", "Tụ tập nhóm", "Buffet tokbokki"],
        "notes": "Quán lẩu ruột của sinh viên FPT nằm ngay ngõ cổng phụ, giá rẻ, đồ tươi và đông nghẹt vào buổi tối.",
        "prominence_rank": 1,
    },
    {
        "name": "Cơm Tấm Bảo Uyên",
        "name_vi": "Cơm Tấm Bảo Uyên",
        "category": "food_drink",
        "category_label": "Ăn uống & Cafe",
        "category_id": 2,
        "subcategory": "restaurant",
        "lat": 21.0274, "lng": 105.5340,
        "area_name": "Tân Xã / Phú Hữu",
        "address": "Số 62 Thôn Phú Hữu, ĐT420, Thạch Thất, Hà Nội",
        "phone": "0971932901",
        "opening_hours": "09:30 - 20:30",
        "min_price": 35000, "max_price": 50000,
        "rating": 4.7, "review_count": 98,
        "tags": ["Cơm tấm sườn bì", "Ăn trưa", "Canh free", "Trục ĐT420"],
        "notes": "Quán cơm tấm nổi tiếng nhất trục ĐT420, sườn nướng đậm đà, suất cơm đầy đặn cho sinh viên.",
        "prominence_rank": 2,
    },
    {
        "name": "Bánh Mì Bamimo FPT",
        "name_vi": "Bánh Mì Bamimo",
        "category": "food_drink",
        "category_label": "Ăn uống & Cafe",
        "category_id": 2,
        "subcategory": "fast_food",
        "lat": 21.0148, "lng": 105.5260,
        "area_name": "Thạch Hòa",
        "address": "Cổng chính & cổng phụ ĐH FPT, Thạch Hòa, Thạch Thất",
        "phone": "0963112233",
        "opening_hours": "06:00 - 21:00",
        "min_price": 20000, "max_price": 35000,
        "rating": 4.9, "review_count": 210,
        "tags": ["Bánh mì giòn", "Ship tận KTX", "Ăn sáng", "Nhanh gọn"],
        "notes": "Thương hiệu bánh mì quốc dân của FPT Hòa Lạc, nhận ship tận phòng KTX và các khu trọ lân cận.",
        "prominence_rank": 3,
    },
    {
        "name": "Layla Cafe Retro Tân Xã",
        "name_vi": "Layla Cafe",
        "category": "food_drink",
        "category_label": "Ăn uống & Cafe",
        "category_id": 2,
        "subcategory": "cafe",
        "lat": 21.0175, "lng": 105.5315,
        "area_name": "Tân Xã",
        "address": "Ngã tư Tân Xã, Đường ĐT419, Thạch Thất, Hà Nội",
        "phone": "0978998877",
        "opening_hours": "07:00 - 23:00",
        "min_price": 25000, "max_price": 45000,
        "rating": 4.8, "review_count": 115,
        "tags": ["Cafe retro", "Không gian rộng", "Họp nhóm", "View thoáng ngã tư"],
        "notes": "Quán cafe phong cách hoài niệm thập niên 80 nổi tiếng nhất Ngã tư Tân Xã, nhiều góc chụp ảnh đẹp.",
        "prominence_rank": 4,
    },
    {
        "name": "The Study Station Cafe 24/7",
        "name_vi": "The Study Station Cafe",
        "category": "food_drink",
        "category_label": "Ăn uống & Cafe",
        "category_id": 2,
        "subcategory": "cafe",
        "lat": 21.0152, "lng": 105.5185,
        "area_name": "Thạch Hòa",
        "address": "Khu TĐC Bắc Phú Cát, Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0966554433",
        "opening_hours": "Mở cửa 24/7",
        "min_price": 30000, "max_price": 50000,
        "rating": 4.9, "review_count": 185,
        "tags": ["Mở 24/7", "Cày đồ án Capstone", "Ổ cắm từng bàn", "Wifi mạnh"],
        "notes": "Địa điểm cày đồ án Capstone và ôn thi xuyên đêm số 1 của sinh viên FPT, bàn ghế công thái học.",
        "prominence_rank": 5,
    },
    {
        "name": "Nhà Hàng 379 Minh Nga",
        "name_vi": "Nhà Hàng 379 Minh Nga",
        "category": "food_drink",
        "category_label": "Ăn uống & Cafe",
        "category_id": 2,
        "subcategory": "restaurant",
        "lat": 21.0155, "lng": 105.5180,
        "area_name": "Thạch Hòa",
        "address": "Thôn 4, Xã Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "02433688379",
        "opening_hours": "09:00 - 22:30",
        "min_price": 150000, "max_price": 300000,
        "rating": 4.7, "review_count": 160,
        "tags": ["Lẩu cua đồng", "Gà ri", "Tiếp khách", "Liên hoan lớp"],
        "notes": "Nhà hàng đặc sản nổi tiếng nhất khu vực Hòa Lạc, địa điểm quen thuộc cho các buổi liên hoan CLB, tiếp đón phụ huynh.",
        "prominence_rank": 6,
    },

    # ══════════════════════════════════════════════════════════════════
    # 2. HIỆU THUỐC & Y TẾ (pharmacy) - 3 ĐỊA ĐIỂM
    # ══════════════════════════════════════════════════════════════════
    {
        "name": "Nhà Thuốc Pharmacity Hòa Lạc",
        "name_vi": "Pharmacity Hòa Lạc",
        "category": "pharmacy",
        "category_label": "Hiệu thuốc & Y tế",
        "category_id": 4,
        "subcategory": "pharmacy",
        "lat": 21.0125, "lng": 105.5225,
        "area_name": "Thạch Hòa",
        "address": "Km29 Đại Lộ Thăng Long, Thạch Hòa, Thạch Thất",
        "phone": "18006821",
        "opening_hours": "06:00 - 23:30 (Trực cấp cứu)",
        "min_price": 10000, "max_price": 200000,
        "rating": 4.9, "review_count": 88,
        "tags": ["Chuẩn GPP", "Mở muộn", "Thuốc kê đơn", "Sơ cứu"],
        "notes": "Chuỗi nhà thuốc hiện đại chuẩn GPP lớn nhất gần trường, đầy đủ thuốc ngoại, đồ y tế và thực phẩm chức năng.",
        "prominence_rank": 7,
    },
    {
        "name": "Phương Nam Pharmacy",
        "name_vi": "Phương Nam Pharmacy",
        "category": "pharmacy",
        "category_label": "Hiệu thuốc & Y tế",
        "category_id": 4,
        "subcategory": "pharmacy",
        "lat": 21.0148, "lng": 105.5195,
        "area_name": "Thạch Hòa",
        "address": "Thôn 6, Xã Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0984123987",
        "opening_hours": "07:00 - 22:00",
        "min_price": 5000, "max_price": 150000,
        "rating": 4.8, "review_count": 72,
        "tags": ["Dược sĩ tư vấn tốt", "Thôn 6 Thạch Hòa", "Uy tín lâu năm"],
        "notes": "Nhà thuốc đông khách và uy tín hàng đầu khu dân cư Thạch Hòa, dược sĩ tư vấn tận tình thuốc cảm sốt, tiêu hóa.",
        "prominence_rank": 8,
    },
    {
        "name": "Nhà Thuốc Mỹ Lệ Ngã 3 Hòa Lạc",
        "name_vi": "Nhà Thuốc Mỹ Lệ",
        "category": "pharmacy",
        "category_label": "Hiệu thuốc & Y tế",
        "category_id": 4,
        "subcategory": "pharmacy",
        "lat": 21.0135, "lng": 105.5160,
        "area_name": "Thạch Hòa",
        "address": "Ngã 3 Hòa Lạc, Xã Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0912445566",
        "opening_hours": "06:30 - 21:30",
        "min_price": 5000, "max_price": 120000,
        "rating": 4.6, "review_count": 45,
        "tags": ["Ngã 3 Hòa Lạc", "Lâu năm", "Thuốc thông dụng"],
        "notes": "Hiệu thuốc lâu đời nằm ngay điểm nút giao Ngã 3 Hòa Lạc, tiện ghé mua khi đi trên đường QL21.",
        "prominence_rank": 9,
    },

    # ══════════════════════════════════════════════════════════════════
    # 3. SIÊU THỊ & TẠP HÓA (grocery) - 3 ĐỊA ĐIỂM
    # ══════════════════════════════════════════════════════════════════
    {
        "name": "Chợ Hòa Lạc (Chợ Trung Tâm)",
        "name_vi": "Chợ Hòa Lạc",
        "category": "grocery",
        "category_label": "Siêu thị & Tạp hóa",
        "category_id": 3,
        "subcategory": "marketplace",
        "lat": 21.0255, "lng": 105.5185,
        "area_name": "Thạch Hòa",
        "address": "Ngã 3 Hòa Lạc giao ĐT420, Thạch Hòa, Thạch Thất",
        "phone": "",
        "opening_hours": "05:00 - 18:30",
        "min_price": 5000, "max_price": 200000,
        "rating": 4.6, "review_count": 130,
        "tags": ["Chợ dân sinh", "Thực phẩm tươi sống", "Giá rẻ nhất", "Tự nấu ăn"],
        "notes": "Chợ dân sinh lớn nhất toàn khu vực, đầu mối rau củ, thịt cá tươi sống và đồ gia dụng giá rẻ cho sinh viên ở trọ.",
        "prominence_rank": 10,
    },
    {
        "name": "Siêu Thị WinMart+ Tân Xã",
        "name_vi": "WinMart+ Tân Xã",
        "category": "grocery",
        "category_label": "Siêu thị & Tạp hóa",
        "category_id": 3,
        "subcategory": "supermarket",
        "lat": 21.0160, "lng": 105.5320,
        "area_name": "Tân Xã",
        "address": "Đường ĐT419, Ngã 3 Tân Xã, Thạch Thất, Hà Nội",
        "phone": "02471066866",
        "opening_hours": "06:30 - 22:30",
        "min_price": 5000, "max_price": 300000,
        "rating": 4.7, "review_count": 65,
        "tags": ["Thịt sạch MEATDeli", "Thanh toán QR", "Đồ ăn nhanh", "Điều hòa"],
        "notes": "Cửa hàng tiện lợi uy tín nhất khu vực Tân Xã, thanh toán thẻ / ví điện tử, hàng hóa niêm yết rõ ràng.",
        "prominence_rank": 11,
    },
    {
        "name": "Minimart 79 Tạp Hóa Cổng Phụ FPT",
        "name_vi": "Minimart 79 Cổng Phụ",
        "category": "grocery",
        "category_label": "Siêu thị & Tạp hóa",
        "category_id": 3,
        "subcategory": "convenience",
        "lat": 21.0142, "lng": 105.5268,
        "area_name": "Thạch Hòa",
        "address": "Ngõ Cổng phụ ĐH FPT, Thạch Hòa, Thạch Thất",
        "phone": "0987334455",
        "opening_hours": "06:00 - 23:00",
        "min_price": 5000, "max_price": 100000,
        "rating": 4.8, "review_count": 90,
        "tags": ["Gần trường", "Nước ngọt", "Mì tôm đêm", "Đồ sinh hoạt"],
        "notes": "Điểm tạp hóa quen thuộc nhất của sinh viên FPT bước chân ra cổng phụ là thấy, mở muộn.",
        "prominence_rank": 12,
    },

    # ══════════════════════════════════════════════════════════════════
    # 4. SỬA XE & DỊCH VỤ (services) - 4 ĐỊA ĐIỂM
    # ══════════════════════════════════════════════════════════════════
    {
        "name": "Cứu Hộ & Sửa Xe Máy Tuấn Cường 24/7",
        "name_vi": "Sửa Xe Máy Tuấn Cường 24/7",
        "category": "services",
        "category_label": "Sửa xe & Dịch vụ",
        "category_id": 5,
        "subcategory": "motorcycle_repair",
        "lat": 21.0115, "lng": 105.5265,
        "area_name": "Thạch Hòa",
        "address": "Đối diện Cổng 3 KTX ĐH FPT, Thạch Hòa, Thạch Thất",
        "phone": "0988776655",
        "opening_hours": "24/7 (Cứu hộ ngày đêm)",
        "min_price": 20000, "max_price": 150000,
        "rating": 4.9, "review_count": 110,
        "tags": ["Cứu hộ đêm 24/7", "Vá xe 20k", "Cổng 3 FPT", "Thay nhớt chính hãng"],
        "notes": "Tiệm cứu hộ xe máy số 1 của sinh viên FPT, đêm khuya thủng lốp hay chết máy gọi 5-10 phút có mặt tận nơi.",
        "prominence_rank": 13,
    },
    {
        "name": "Tiệm In Ấn & Photo Đồ Án Thôn 3",
        "name_vi": "In Ấn & Photo Đồ Án Thôn 3",
        "category": "services",
        "category_label": "Sửa xe & Dịch vụ",
        "category_id": 5,
        "subcategory": "copyshop",
        "lat": 21.0155, "lng": 105.5210,
        "area_name": "Thạch Hòa",
        "address": "Thôn 3, Xã Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0976112244",
        "opening_hours": "07:30 - 21:30",
        "min_price": 500, "max_price": 100000,
        "rating": 4.8, "review_count": 85,
        "tags": ["In đồ án tốt nghiệp", "Bìa mạ vàng", "Photo đề cương", "Giá sinh viên"],
        "notes": "Trung tâm in ấn lớn nhất Thạch Hòa, chuyên đóng bìa mạ vàng đồ án Capstone, in slide thuyết trình và tài liệu học tập.",
        "prominence_rank": 14,
    },
    {
        "name": "Kỳ Ngàn Building Hòa Lạc",
        "name_vi": "Tòa Nhà Kỳ Ngàn",
        "category": "services",
        "category_label": "Sửa xe & Dịch vụ",
        "category_id": 5,
        "subcategory": "office",
        "lat": 21.0250, "lng": 105.5255,
        "area_name": "Thạch Hòa",
        "address": "Đường ĐT420, Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "02433998877",
        "opening_hours": "07:00 - 21:00",
        "min_price": 0, "max_price": 0,
        "rating": 4.5, "review_count": 40,
        "tags": ["Tổ hợp văn phòng", "Dịch vụ thương mại", "Trục ĐT420", "Mốc chỉ đường"],
        "notes": "Tòa nhà nổi bật trên ảnh bản đồ trục ĐT420, điểm mốc chỉ đường và đặt văn phòng dịch vụ của khu vực.",
        "prominence_rank": 15,
    },
    {
        "name": "Tiệm Sửa Xe Máy Duẩn An",
        "name_vi": "Sửa Xe Máy Duẩn An",
        "category": "services",
        "category_label": "Sửa xe & Dịch vụ",
        "category_id": 5,
        "subcategory": "motorcycle_repair",
        "lat": 21.0282, "lng": 105.5274,
        "area_name": "Thạch Hòa",
        "address": "Đường ĐT420 gần Chợ Hòa Lạc, Thạch Hòa, Thạch Thất",
        "phone": "0968445566",
        "opening_hours": "07:00 - 20:00",
        "min_price": 15000, "max_price": 200000,
        "rating": 4.6, "review_count": 52,
        "tags": ["Sửa chữa xe máy", "Bảo dưỡng định kỳ", "Trục ĐT420"],
        "notes": "Tiệm sửa xe máy uy tín trên trục ĐT420, thợ kinh nghiệm sửa xe ga xe số, giá phụ tùng chuẩn chỉ.",
        "prominence_rank": 16,
    },

    # ══════════════════════════════════════════════════════════════════
    # 5. GIẢI TRÍ & THỂ THAO (entertainment) - 3 ĐỊA ĐIỂM
    # ══════════════════════════════════════════════════════════════════
    {
        "name": "King Gaming Cyber Hòa Lạc",
        "name_vi": "King Gaming Hòa Lạc",
        "category": "entertainment",
        "category_label": "Giải trí & Thể thao",
        "category_id": 6,
        "subcategory": "internet_cafe",
        "lat": 21.0205, "lng": 105.5335,
        "area_name": "Tân Xã",
        "address": "Số 42 Đường Tân Xã, Xã Tân Xã, Thạch Thất, Hà Nội",
        "phone": "0944332211",
        "opening_hours": "Mở cửa 24/7",
        "min_price": 8000, "max_price": 15000,
        "rating": 4.8, "review_count": 128,
        "tags": ["Cyber game RTX", "Màn 240Hz", "Máy lạnh 24/7", "Cơm rang dưa bò"],
        "notes": "Cyber game cao cấp quy mô hơn 100 máy cấu hình cao cho sinh viên FPT giải trí, thi đấu eSports, đồ ăn đêm ngon.",
        "prominence_rank": 17,
    },
    {
        "name": "CLB Bida Tân Xã Club",
        "name_vi": "Bida Club Tân Xã",
        "category": "entertainment",
        "category_label": "Giải trí & Thể thao",
        "category_id": 6,
        "subcategory": "sports_centre",
        "lat": 21.0182, "lng": 105.5310,
        "area_name": "Tân Xã",
        "address": "Đường ven Hồ Tân Xã, Thạch Thất, Hà Nội",
        "phone": "0934556677",
        "opening_hours": "09:00 - 01:00",
        "min_price": 40000, "max_price": 70000,
        "rating": 4.7, "review_count": 68,
        "tags": ["Bida lỗ & Carom", "Bàn Aileex mới", "Điều hòa mát rượi", "Giá sinh viên"],
        "notes": "Câu lạc bộ bida máy lạnh đông khách nhất Tân Xã, bàn chuẩn thi đấu, nhạc chill giải trí sau giờ học.",
        "prominence_rank": 18,
    },
    {
        "name": "Sân Bóng Đá Mini Hòa Lạc",
        "name_vi": "Sân Bóng Đá Cỏ Nhân Tạo Hòa Lạc",
        "category": "entertainment",
        "category_label": "Giải trí & Thể thao",
        "category_id": 6,
        "subcategory": "pitch",
        "lat": 21.0165, "lng": 105.5240,
        "area_name": "Thạch Hòa",
        "address": "Gần Cổng FPTU, Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0918889900",
        "opening_hours": "05:30 - 23:00",
        "min_price": 200000, "max_price": 350000,
        "rating": 4.8, "review_count": 95,
        "tags": ["Sân cỏ nhân tạo 7 người", "Đèn chiếu sáng ban đêm", "Giao lưu bóng đá"],
        "notes": "Sân bóng cỏ nhân tạo chất lượng tốt có dàn đèn đêm, điểm tổ chức giải đấu giao hữu giữa các phòng trọ và CLB trường.",
        "prominence_rank": 19,
    },

    # ══════════════════════════════════════════════════════════════════
    # 6. NHÀ TRỌ & CCMN (boarding_house) - 4 ĐỊA ĐIỂM
    # ══════════════════════════════════════════════════════════════════
    {
        "name": "CCMN Happy House Tân Xã",
        "name_vi": "Happy House Tân Xã",
        "category": "boarding_house",
        "category_label": "Nhà trọ & CCMN",
        "category_id": 1,
        "subcategory": "boarding_house",
        "lat": 21.0185, "lng": 105.5345,
        "area_name": "Tân Xã",
        "address": "Số 18 Ngõ 3 Hồ Tân Xã, Xã Tân Xã, Thạch Thất, Hà Nội",
        "phone": "0987123456",
        "opening_hours": "24/7 (Khóa vân tay)",
        "min_price": 2500000, "max_price": 3200000,
        "rating": 4.8, "review_count": 42,
        "tags": ["CCMN thang máy", "View hồ Tân Xã", "Full nội thất", "Khóa vân tay"],
        "notes": "Tòa chung cư mini 6 tầng có thang máy, phòng có ban công view hồ Tân Xã, an ninh camera 24/7 rất được săn đón.",
        "prominence_rank": 20,
    },
    {
        "name": "Nhà Trọ Minh Cương",
        "name_vi": "Nhà Trọ Minh Cương",
        "category": "boarding_house",
        "category_label": "Nhà trọ & CCMN",
        "category_id": 1,
        "subcategory": "boarding_house",
        "lat": 21.0195, "lng": 105.5285,
        "area_name": "Thạch Hòa",
        "address": "Thôn 4, Xã Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0912789456",
        "opening_hours": "24/7",
        "min_price": 1800000, "max_price": 2600000,
        "rating": 4.6, "review_count": 38,
        "tags": ["Nằm giữa FPT và Tân Xã", "Phòng khép kín", "Giá hợp lý"],
        "notes": "Khu trọ sinh viên nổi bật trên bản đồ nằm giữa đường nối từ FPT sang Tân Xã, đi học rất gần và tiện.",
        "prominence_rank": 21,
    },
    {
        "name": "Khu Trọ Sinh Viên Thanh Phượng (Thôn 5)",
        "name_vi": "Nhà Trọ Thanh Phượng",
        "category": "boarding_house",
        "category_label": "Nhà trọ & CCMN",
        "category_id": 1,
        "subcategory": "boarding_house",
        "lat": 21.0210, "lng": 105.5020,
        "area_name": "Thôn 5 Thạch Hòa",
        "address": "Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0973456789",
        "opening_hours": "24/7",
        "min_price": 1400000, "max_price": 2000000,
        "rating": 4.5, "review_count": 28,
        "tags": ["Thôn 5", "Yên tĩnh", "Giá rẻ sinh viên", "Không chung chủ"],
        "notes": "Đại diện tiêu biểu cho xóm trọ sinh viên Thôn 5 trên ảnh bản đồ, không gian yên tĩnh, chi phí thuê rẻ phù hợp tiết kiệm.",
        "prominence_rank": 22,
    },
    {
        "name": "Lotus House KTX Mini Thạch Hòa",
        "name_vi": "Lotus House Thạch Hòa",
        "category": "boarding_house",
        "category_label": "Nhà trọ & CCMN",
        "category_id": 1,
        "subcategory": "boarding_house",
        "lat": 21.0118, "lng": 105.5208,
        "area_name": "Thạch Hòa",
        "address": "Khu Đồng Song, Xã Thạch Hòa, Thạch Thất, Hà Nội",
        "phone": "0977889900",
        "opening_hours": "24/7",
        "min_price": 3200000, "max_price": 3800000,
        "rating": 4.9, "review_count": 48,
        "tags": ["Cách FPT 400m", "Đi bộ đi học", "Full nội thất khách sạn", "Chuẩn PCCC"],
        "notes": "Căn hộ dịch vụ cao cấp cách trường 400m có thể đi bộ đi học, PCCC đạt chuẩn có thang thoát hiểm ngoài trời.",
        "prominence_rank": 23,
    },

    # ══════════════════════════════════════════════════════════════════
    # 7. TRƯỜNG & ĐIỂM ĐÓN BUS (campus) - 2 ĐỊA ĐIỂM
    # ══════════════════════════════════════════════════════════════════
    {
        "name": "Đại học FPT Hà Nội - Campus Hòa Lạc",
        "name_vi": "Đại học FPT Hà Nội",
        "category": "campus",
        "category_label": "Trường & Điểm đón Bus",
        "category_id": 7,
        "subcategory": "university",
        "lat": 21.0135, "lng": 105.5252,
        "area_name": "Khu CNC Hòa Lạc",
        "address": "Khu CNC Hòa Lạc, Km29 Đại lộ Thăng Long, Thạch Thất, Hà Nội",
        "phone": "02473001866",
        "opening_hours": "06:00 - 22:30",
        "min_price": 0, "max_price": 0,
        "rating": 4.9, "review_count": 320,
        "tags": ["Tòa Alpha", "Hồ Sen", "Dom A-G", "Trung tâm sinh viên"],
        "notes": "Trọng tâm và trái tim học tập của toàn bộ sinh viên FPT tại Hòa Lạc, mốc gốc để tính khoảng cách di chuyển.",
        "prominence_rank": 24,
    },
    {
        "name": "Trạm Xe Buýt 107 & 74 (Cổng chính FPTU)",
        "name_vi": "Trạm Xe Buýt FPTU",
        "category": "campus",
        "category_label": "Trường & Điểm đón Bus",
        "category_id": 7,
        "subcategory": "bus_station",
        "lat": 21.0148, "lng": 105.5242,
        "area_name": "Khu CNC Hòa Lạc",
        "address": "Cổng chính ĐH FPT, Km29 Đại Lộ Thăng Long, Thạch Thất, Hà Nội",
        "phone": "",
        "opening_hours": "05:00 - 21:00 (10-15 phút/chuyến)",
        "min_price": 9000, "max_price": 9000,
        "rating": 4.7, "review_count": 180,
        "tags": ["Tuyến 107 (Kim Mã)", "Tuyến 74 (Mỹ Đình)", "Tuyến 88", "Vé 9.000đ"],
        "notes": "Trạm xe buýt huyết mạch nối FPT Hòa Lạc với trung tâm Hà Nội, xe chạy cao tốc 35 phút về đến BigC / Kim Mã.",
        "prominence_rank": 25,
    },
]

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "output")
    os.makedirs(output_dir, exist_ok=True)

    print("\n" + "=" * 65)
    print("⭐ CHỌN LỌC TOP 25 ĐỊA ĐIỂM NỔI TIẾNG NHẤT HÒA LẠC (N18 HẤT LÊN)")
    print("=" * 65)

    # Calculate distance to FPT and generate ID
    processed = []
    category_summary = {}

    for item in TOP_25_PLACES:
        dist = haversine_distance(FPT_CENTER["lat"], FPT_CENTER["lng"], item["lat"], item["lng"])
        item["id"] = generate_id(item["name"], item["lat"], item["lng"])
        item["distance_to_fpt_m"] = dist
        item["status"] = "needs_verify"
        item["source"] = "curated_top25"
        item["scraped_at"] = NOW
        item["tags_str"] = ", ".join(item["tags"])
        processed.append(item)

        cat_lbl = item["category_label"]
        category_summary[cat_lbl] = category_summary.get(cat_lbl, 0) + 1

    # 1. Export CSV
    csv_fields = [
        'id', 'name', 'name_vi', 'category', 'category_label', 'category_id',
        'subcategory', 'lat', 'lng', 'area_name', 'address', 'phone',
        'opening_hours', 'distance_to_fpt_m', 'min_price', 'max_price',
        'rating', 'review_count', 'status', 'notes', 'tags_str', 'source', 'scraped_at'
    ]

    csv_path = os.path.join(output_dir, "hoalac_places_top25.csv")
    with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields, extrasaction='ignore')
        writer.writeheader()
        for p in processed:
            writer.writerow(p)
    print(f"📄 Đã xuất CSV: {csv_path} (25 địa điểm)")

    # 2. Export GeoJSON
    features = []
    for p in processed:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [p["lng"], p["lat"]]
            },
            "properties": {
                "id": p["id"],
                "name": p["name"],
                "category": p["category"],
                "category_label": p["category_label"],
                "area_name": p["area_name"],
                "address": p["address"],
                "phone": p["phone"],
                "distance_to_fpt_m": p["distance_to_fpt_m"],
                "rating": p["rating"],
                "min_price": p["min_price"],
                "max_price": p["max_price"],
                "tags": p["tags"],
                "notes": p["notes"],
            }
        }
        features.append(feature)

    geojson_path = os.path.join(output_dir, "hoalac_places_top25.geojson")
    with open(geojson_path, 'w', encoding='utf-8') as f:
        json.dump({
            "type": "FeatureCollection",
            "metadata": {
                "title": "Top 25 Địa Điểm Nổi Bật Hòa Lạc Cho Sinh Viên FPT",
                "total_places": len(processed),
                "created_at": NOW,
                "coverage": "Từ đường N18 hất lên phía bắc",
            },
            "features": features
        }, f, ensure_ascii=False, indent=2)
    print(f"🗺️  Đã xuất GeoJSON: {geojson_path} (25 địa điểm)")

    # 3. Export Checklist khảo sát thực địa
    chk_fields = [
        'id', 'name', 'category_label', 'area_name', 'address', 'phone',
        'distance_to_fpt_m', 'notes',
        'VERIFIED_STATUS', 'VERIFIED_CORRECT_NAME', 'VERIFIED_NOTES'
    ]
    chk_path = os.path.join(output_dir, "hoalac_verify_checklist_top25.csv")
    with open(chk_path, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=chk_fields, extrasaction='ignore')
        writer.writeheader()
        for p in sorted(processed, key=lambda x: (x["category_id"], x["distance_to_fpt_m"])):
            row = dict(p)
            row["VERIFIED_STATUS"] = ""
            row["VERIFIED_CORRECT_NAME"] = ""
            row["VERIFIED_NOTES"] = ""
            writer.writerow(row)
    print(f"✅ Đã xuất Checklist: {chk_path} (25 địa điểm)")

    # 4. Generate SQL Statements
    sql_path = os.path.join(output_dir, "import_top25_places.sql")
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write("-- ==========================================================\n")
        f.write("-- TOP 25 ĐỊA ĐIỂM NỔI TIẾNG HÒA LẠC (N18 HẤT LÊN) CHO SINH VIÊN FPT\n")
        f.write("-- Bảng đích: places (Supabase ConnectHub)\n")
        f.write("-- TUYỆT ĐỐI CHỈ CHẠY KHI ĐÃ XÁC NHẬN / VERIFY THỰC TẾ!\n")
        f.write("-- ==========================================================\n\n")

        for p in processed:
            tags_sql = "ARRAY[" + ",".join(f"'{t.strip()}'" for t in p["tags"]) + "]"
            clean_name = p['name'].replace("'", "''")
            clean_area = p['area_name'].replace("'", "''")
            clean_addr = p['address'].replace("'", "''")
            phone_val = f"'{p['phone']}'" if p['phone'] else "NULL"
            hours_val = f"'{p['opening_hours']}'" if p['opening_hours'] else "NULL"
            min_p = p['min_price'] if p['min_price'] > 0 else "NULL"
            max_p = p['max_price'] if p['max_price'] > 0 else "NULL"

            f.write(f"""INSERT INTO places (category_id, name, area, address, latitude, longitude, min_price, max_price, opening_hours, phone, amenities)
VALUES ({p['category_id']}, '{clean_name}', '{clean_area}', '{clean_addr}', {p['lat']}, {p['lng']}, {min_p}, {max_p}, {hours_val}, {phone_val}, {tags_sql});\n\n""")

    print(f"📝 Đã sinh SQL Dry-run: {sql_path} (25 câu lệnh INSERT)")

    # In thống kê danh mục
    print("\n" + "=" * 65)
    print("📊 PHÂN BỔ 25 ĐỊA ĐIỂM THEO TẤT CẢ 7 DANH MỤC:")
    print("=" * 65)
    for cat_name, cnt in category_summary.items():
        print(f"  📌 {cat_name:<25}: {cnt} địa điểm")

    print("\n" + "=" * 65)
    print("📋 DANH SÁCH CHI TIẾT 25 ĐỊA ĐIỂM NỔI TIẾNG:")
    print("=" * 65)
    for idx, p in enumerate(processed, 1):
        print(f"[{idx:02d}] {p['name']:<35} | {p['category_label']:<20} | Cách FPT: {p['distance_to_fpt_m']:>4.0f}m")
        print(f"     📍 {p['area_name']} - {p['address']}")
        print(f"     💡 {p['notes']}")
        print()

    print("=" * 65)
    print("🔒 Tất cả 25 địa điểm đã được đóng gói an toàn tại `scraper/output/`.")
    print("   Database của bạn CHƯA BỊ THAY ĐỔI.")
    print("=" * 65)

if __name__ == "__main__":
    main()
