import cv2
import numpy as np
import sys
sys.stdout.reconfigure(encoding='utf-8')

img = cv2.imread('C:/Users/ROG_Zephyrus_G14/.gemini/antigravity/brain/3cd44322-9da7-43c6-a36c-623fbb5fbfc2/.user_uploaded/media_1791622667617_241a6b0f.png')

# Reference: Cơm Tấm Bảo Uyên
# x0 = 786, y0 = 77
# lat0 = 21.0270298, lng0 = 105.5337274
# scale_lng = 0.0000288186 deg/px
# scale_lat = 0.0000269046 deg/px

def px_to_gps(x, y):
    lng = 105.5337274 + (x - 786) * 0.0000288186
    lat = 21.0270298 - (y - 77) * 0.0000269046
    return round(lat, 7), round(lng, 7)

points = [
    # Food
    ("Nhà Hàng 379 Minh Nga 1", 321, 310, "food_drink", "QL21 Thôn 4"),
    ("Quán Ăn / Lẩu QL21", 318, 174, "food_drink", "QL21 Thôn 4"),
    ("Quán Ăn Thôn 5", 160, 169, "food_drink", "Thôn 5 Thạch Hòa"),
    ("Quán Cơm / Phở Ngã 3 Chợ Hòa Lạc", 290, 100, "food_drink", "Ngã 3 QL21 / ĐT420"),
    # Shopping / Grocery
    ("Chợ Hòa Lạc", 271, 78, "grocery", "QL21 Thôn 4"),
    ("Siêu Thị / Tạp Hóa Chợ Hòa Lạc", 310, 91, "grocery", "QL21"),
    # Community & Lodging
    ("Nhà Văn Hóa Thôn 4 Hòa Lạc", 374, 257, "services", "Thôn 4 Thạch Hòa"),
    ("Nhà Văn Hóa Thôn 5 - Hoà Lạc", 162, 135, "services", "Thôn 5 Thạch Hòa"),
    ("Nhà Trọ Trạng Nguyên", 144, 245, "boarding_house", "Thôn 5 Thạch Hòa"),
    ("Nhà Trọ Minh Cương", 466, 172, "boarding_house", "Trục ĐT420 / Thôn 4"),
    ("Kỳ Ngàn Building", 475, 66, "services", "Trục ĐT420"),
    ("Nhà Trọ Hoàng Nam 2", 505, 18, "boarding_house", "ĐT420"),
    # Bus stops
    ("Điểm Dừng Xe Buýt QL21 (Minh Nga)", 335, 298, "campus", "QL21 Thôn 4"),
    ("Điểm Dừng Xe Buýt QL21 (Chợ Hòa Lạc)", 331, 98, "campus", "QL21 Thôn 4"),
    # Sports
    ("Sân Cầu Lông 368 Badminton", 652, 11, "entertainment", "Trục ĐT420"),
    # Tattoo / Services
    ("Henna Tattoo Thôn 5", 46, 245, "services", "Thôn 5 Thạch Hòa"),
]

print("=== CALCULATED GPS FOR DETECTED POIS ===")
for name, x, y, cat, area in points:
    lat, lng = px_to_gps(x, y)
    print(f"{name:38s} | ({lat}, {lng}) | {cat:15s} | {area}")
