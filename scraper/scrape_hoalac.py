"""
🗺️ Hòa Lạc POI Scraper - Pipeline cào & chuẩn hóa dữ liệu địa điểm Hòa Lạc
Phục vụ bản đồ sinh viên FPT (sinhviencangi)

Khu vực quét:
  - Bắt đầu từ trục đường N18 hất lên phía bắc
  - Bao gồm: Thôn 4 & 5 Thạch Hòa, Chợ Hòa Lạc, trục ĐT420, Tân Xã, Bình Yên, khu vực Đại học FPT / HV Tài chính / ĐH Điện lực
  
Nguồn dữ liệu:
  1. OpenStreetMap (Overpass API) - tọa độ chuẩn, tên điểm, tiện ích công cộng
  2. Dữ liệu địa phương & nhóm sinh viên FPT (FB, reviews, thực địa từ ảnh vệ tinh)
  
Chiến lược dữ liệu:
  - KHÔNG ghi trực tiếp vào Database!
  - Xuất ra CSV + GeoJSON + Checklist khảo sát
  - Hỗ trợ chế độ TEST (3 quán) để kiểm tra định dạng
  - Sau khi kiểm tra/verify xong mới dùng script `import_to_db.py` để nạp vào DB

Usage:
  python scraper/scrape_hoalac.py --mode test    # Lệnh test (3 quán mẫu đa dạng)
  python scraper/scrape_hoalac.py --mode full    # Cào toàn bộ khu vực khoanh vùng
"""

import argparse
import csv
import json
import os
import sys
import time
import hashlib
from datetime import datetime
from dataclasses import dataclass, field, asdict
from typing import Optional

import requests

# ── Khu vực bounding box từ đường N18 hất lên (từ ảnh khoanh vùng) ────
# Tâm: FPT University Hòa Lạc = 21.0135, 105.5252
BBOX = {
    "south": 20.9980,   # N18 road phía nam (ranh giới FPT, ĐH Điện Lực, HVTC)
    "north": 21.0320,   # Phía bắc (trục ĐT420, Chợ Hòa Lạc, Kỳ Ngàn, Phú Hữu)
    "west":  105.4950,  # Phía tây (Thôn 5 Hòa Lạc, các xóm trọ phía tây)
    "east":  105.5580,  # Phía đông (Bình Yên, Tân Xã, Nhà thờ Phú Hữu)
}

FPT_CENTER = {"lat": 21.0135, "lng": 105.5252}

# Overpass API endpoints (sắp xếp theo độ ổn định)
OVERPASS_ENDPOINTS = [
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
]

OVERPASS_HEADERS = {
    "User-Agent": "FPTStudentMapBot/1.0 (Educational Project; contact: student@fpt.edu.vn)",
    "Accept": "application/json"
}

# ── Mapping danh mục OSM → ConnectHub category ──────────────────────
CATEGORY_MAP = {
    "food_drink": {
        "label": "Ăn uống & Cafe",
        "tags": [
            'node["amenity"="restaurant"]',
            'way["amenity"="restaurant"]',
            'node["amenity"="cafe"]',
            'way["amenity"="cafe"]',
            'node["amenity"="fast_food"]',
            'node["amenity"="bar"]',
            'node["amenity"="pub"]',
            'node["amenity"="food_court"]',
        ],
    },
    "pharmacy": {
        "label": "Hiệu thuốc & Y tế",
        "tags": [
            'node["amenity"="pharmacy"]',
            'way["amenity"="pharmacy"]',
            'node["amenity"="clinic"]',
            'node["amenity"="hospital"]',
        ],
    },
    "grocery": {
        "label": "Siêu thị & Tạp hóa",
        "tags": [
            'node["shop"="supermarket"]',
            'node["shop"="convenience"]',
            'node["shop"="general"]',
            'node["amenity"="marketplace"]',
        ],
    },
    "services": {
        "label": "Sửa xe & Dịch vụ",
        "tags": [
            'node["shop"="motorcycle_repair"]',
            'node["shop"="car_repair"]',
            'node["amenity"="fuel"]',
            'node["shop"="copyshop"]',
            'node["shop"="laundry"]',
        ],
    },
    "entertainment": {
        "label": "Giải trí & Thể thao",
        "tags": [
            'node["leisure"="sports_centre"]',
            'node["amenity"="internet_cafe"]',
            'node["amenity"="karaoke"]',
        ],
    },
    "campus": {
        "label": "Trường & Điểm đón Bus",
        "tags": [
            'node["amenity"="university"]',
            'way["amenity"="university"]',
            'node["amenity"="college"]',
            'node["highway"="bus_stop"]',
        ],
    },
}


@dataclass
class POI:
    """Point of Interest - Địa điểm trên bản đồ."""
    id: str = ""
    name: str = ""
    name_vi: str = ""
    name_en: str = ""
    category: str = ""          # ConnectHub category key
    category_label: str = ""    # Label hiển thị tiếng Việt
    subcategory: str = ""       # Phân loại phụ (cafe, restaurant, bus_stop...)
    
    lat: float = 0.0
    lng: float = 0.0
    
    address: str = ""
    area_name: str = ""         # Thạch Hòa, Tân Xã, Bình Yên, Hòa Lạc...
    
    phone: str = ""
    website: str = ""
    opening_hours: str = ""
    
    osm_id: str = ""
    source: str = "osm"         # osm | web_research | map_inspection
    scraped_at: str = ""
    
    distance_to_fpt_m: float = 0.0
    
    status: str = "needs_verify" # needs_verify | verified | closed
    notes: str = ""
    
    min_price: int = 0
    max_price: int = 0
    rating: float = 0.0
    review_count: int = 0
    tags: str = ""


def haversine_distance(lat1, lng1, lat2, lng2):
    """Tính khoảng cách (mét) giữa 2 tọa độ GPS."""
    import math
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def determine_area(lat, lng):
    """Xác định xã / khu vực dựa vào tọa độ."""
    if lng >= 105.545:
        return "Bình Yên / Phú Hữu"
    elif lng >= 105.530 and lat >= 21.015:
        return "Tân Xã"
    elif lng < 105.512 and lat >= 21.010:
        return "Thôn 5 Thạch Hòa"
    elif lng < 105.525 and lat >= 21.018:
        return "Thôn 4 Thạch Hòa"
    elif lat < 21.005:
        return "Khu CNC Hòa Lạc"
    else:
        return "Thạch Hòa"


def generate_id(name, lat, lng):
    """Tạo ID duy nhất từ tên + tọa độ."""
    raw = f"{name}_{lat:.6f}_{lng:.6f}"
    return hashlib.md5(raw.encode()).hexdigest()[:12]


# ══════════════════════════════════════════════════════════════════════
# SCRAPER 1: OpenStreetMap (Overpass API)
# ══════════════════════════════════════════════════════════════════════

def build_category_query(bbox_str: str, tags: list[str]) -> str:
    inner = "\n  ".join([f"{t}({bbox_str});" for t in tags])
    return f"""[out:json][timeout:25];
(
  {inner}
);
out center tags;
"""


def scrape_osm(categories_to_scrape: list[str] = None) -> list[POI]:
    """Cào POIs từ OpenStreetMap Overpass API với cơ chế dự phòng endpoint."""
    if categories_to_scrape is None:
        categories_to_scrape = list(CATEGORY_MAP.keys())
    
    bbox_str = f"{BBOX['south']},{BBOX['west']},{BBOX['north']},{BBOX['east']}"
    all_pois = []
    seen_ids = set()
    
    for cat_key in categories_to_scrape:
        cat_info = CATEGORY_MAP[cat_key]
        print(f"\n🔍 Cào danh mục [{cat_info['label']}] từ OSM...")
        query = build_category_query(bbox_str, cat_info["tags"])
        
        data = None
        for endpoint in OVERPASS_ENDPOINTS:
            try:
                resp = requests.post(
                    endpoint,
                    data={"data": query},
                    headers=OVERPASS_HEADERS,
                    timeout=25
                )
                if resp.status_code == 200:
                    data = resp.json()
                    print(f"  ✅ Thành công từ {endpoint.split('/')[2]}")
                    break
                else:
                    print(f"  ⚠️ {endpoint.split('/')[2]} trả mã {resp.status_code}, thử endpoint khác...")
            except Exception as e:
                print(f"  ⚠️ Lỗi kết nối {endpoint.split('/')[2]}: {e}")
        
        if not data:
            print(f"  ❌ Không lấy được dữ liệu cho danh mục {cat_key}")
            continue
            
        elements = data.get("elements", [])
        count = 0
        for elem in elements:
            tags = elem.get("tags", {})
            lat = elem.get("lat") or elem.get("center", {}).get("lat")
            lng = elem.get("lon") or elem.get("center", {}).get("lon")
            if not lat or not lng:
                continue
                
            name = (
                tags.get("name:vi") or 
                tags.get("name") or 
                tags.get("name:en") or
                tags.get("brand") or
                tags.get("operator") or
                ""
            )
            if not name:
                continue
                
            subcategory = (
                tags.get("amenity") or 
                tags.get("shop") or 
                tags.get("leisure") or 
                tags.get("highway") or 
                ""
            )
            
            osm_id = f"{elem.get('type', 'node')}_{elem.get('id', '')}"
            if osm_id in seen_ids:
                continue
            seen_ids.add(osm_id)
            
            poi = POI(
                id=generate_id(name, lat, lng),
                name=name,
                name_vi=tags.get("name:vi", name),
                name_en=tags.get("name:en", ""),
                category=cat_key,
                category_label=cat_info["label"],
                subcategory=subcategory,
                lat=lat,
                lng=lng,
                address=_build_address(tags),
                area_name=determine_area(lat, lng),
                phone=tags.get("phone", "") or tags.get("contact:phone", ""),
                website=tags.get("website", ""),
                opening_hours=tags.get("opening_hours", ""),
                osm_id=osm_id,
                source="osm",
                scraped_at=datetime.now().isoformat(),
                distance_to_fpt_m=round(haversine_distance(
                    FPT_CENTER["lat"], FPT_CENTER["lng"], lat, lng
                ), 1),
                status="needs_verify",
            )
            all_pois.append(poi)
            count += 1
            
        print(f"  📦 Lấy được {count} địa điểm hợp lệ")
        time.sleep(1)
        
    return all_pois


def _build_address(tags: dict) -> str:
    parts = []
    if tags.get("addr:housenumber"):
        parts.append(tags["addr:housenumber"])
    if tags.get("addr:street"):
        parts.append(tags["addr:street"])
    if tags.get("addr:suburb") or tags.get("addr:subdistrict"):
        parts.append(tags.get("addr:suburb") or tags["addr:subdistrict"])
    if tags.get("addr:district"):
        parts.append(tags["addr:district"])
    return ", ".join(parts) or tags.get("addr:full", "")


# ══════════════════════════════════════════════════════════════════════
# SCRAPER 2: POI Curated (Nhóm sinh viên FPT + Trích xuất từ ảnh bản đồ)
# ══════════════════════════════════════════════════════════════════════

def get_curated_places() -> list[POI]:
    """
    Dữ liệu curated kết hợp:
      - Các địa điểm có mặt trực tiếp trên ảnh Google Maps user khoanh
      - Các quán ruột, tiệm sửa xe, hiệu thuốc nổi tiếng sinh viên FPT thường lui tới
    """
    now = datetime.now().isoformat()
    curated = [
        # ── 1. ĐỊA ĐIỂM TRỰC TIẾP TRÊN ẢNH KHOANH VÙNG (TỪ N18 HẤT LÊN) ──
        POI(
            id=generate_id("Chợ Hòa Lạc", 21.0255, 105.5185),
            name="Chợ Hòa Lạc",
            name_vi="Chợ Hòa Lạc", category="grocery",
            category_label="Siêu thị & Tạp hóa", subcategory="marketplace",
            lat=21.0255, lng=105.5185,
            address="Ngã 3 Hòa Lạc giao ĐT420, Thạch Hòa, Thạch Thất",
            area_name="Thạch Hòa",
            notes="Chợ dân sinh lớn nhất khu vực, bán đầy đủ thực phẩm tươi sống, hoa quả, đồ gia dụng giá rẻ cho sinh viên",
            tags="chợ dân sinh,thực phẩm tươi,đồ gia dụng,giá rẻ",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0255, 105.5185),
        ),
        POI(
            id=generate_id("Trọ Thanh Phượng", 21.0210, 105.5020),
            name="Nhà Trọ Thanh Phượng",
            name_vi="Nhà Trọ Thanh Phượng", category="boarding_house",
            category_label="Nhà trọ & CCMN", subcategory="boarding_house",
            lat=21.0210, lng=105.5020,
            address="Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thôn 5 Thạch Hòa",
            notes="Khu trọ sinh viên Thôn 5, yên tĩnh, khép kín",
            tags="nhà trọ,thôn 5,sinh viên",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0210, 105.5020),
        ),
        POI(
            id=generate_id("Nhà Trọ Happy", 21.0185, 105.5010),
            name="Nhà Trọ Happy",
            name_vi="Nhà Trọ Happy", category="boarding_house",
            category_label="Nhà trọ & CCMN", subcategory="boarding_house",
            lat=21.0185, lng=105.5010,
            address="Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thôn 5 Thạch Hòa",
            notes="Phòng trọ sinh viên khép kín, an ninh tốt",
            tags="nhà trọ,phòng khép kín,an ninh",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0185, 105.5010),
        ),
        POI(
            id=generate_id("Nhà Trọ Chú Bốn", 21.0160, 105.4965),
            name="Nhà Trọ Chú Bốn",
            name_vi="Nhà Trọ Chú Bốn", category="boarding_house",
            category_label="Nhà trọ & CCMN", subcategory="boarding_house",
            lat=21.0160, lng=105.4965,
            address="Thôn 5, Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thôn 5 Thạch Hòa",
            notes="Trọ bình dân giá rẻ cho sinh viên",
            tags="trọ bình dân,giá rẻ,chủ trọ thân thiện",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0160, 105.4965),
        ),
        POI(
            id=generate_id("Nhà Trọ Tràng Nguyên", 21.0145, 105.5110),
            name="Nhà Trọ Tràng Nguyên",
            name_vi="Nhà Trọ Tràng Nguyên", category="boarding_house",
            category_label="Nhà trọ & CCMN", subcategory="boarding_house",
            lat=21.0145, lng=105.5110,
            address="Thôn 5, Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thôn 5 Thạch Hòa",
            notes="Dãy trọ sinh viên khép kín gần bờ sông",
            tags="nhà trọ,khép kín,thoáng mát",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0145, 105.5110),
        ),
        POI(
            id=generate_id("Nhà Trọ Minh Cương", 21.0195, 105.5285),
            name="Nhà Trọ Minh Cương",
            name_vi="Nhà Trọ Minh Cương", category="boarding_house",
            category_label="Nhà trọ & CCMN", subcategory="boarding_house",
            lat=21.0195, lng=105.5285,
            address="Thôn 4, Xã Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thạch Hòa",
            notes="Nằm giữa trục FPT đi Tân Xã, trọ CCMN nhiều tầng",
            tags="nhà trọ,CCMN,gần FPT",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0195, 105.5285),
        ),
        POI(
            id=generate_id("Henna Tattoo Thôn 5", 21.0140, 105.5045),
            name="Henna Tattoo Hòa Lạc",
            name_vi="Henna Tattoo Hòa Lạc", category="services",
            category_label="Sửa xe & Dịch vụ", subcategory="beauty",
            lat=21.0140, lng=105.5045,
            address="Thôn 5, Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thôn 5 Thạch Hòa",
            notes="Dịch vụ xăm nghệ thuật, vẽ henna giới trẻ",
            tags="xăm nghệ thuật,tattoo,làm đẹp",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0140, 105.5045),
        ),
        POI(
            id=generate_id("Kỳ Ngàn Building", 21.0250, 105.5255),
            name="Kỳ Ngàn Building",
            name_vi="Tòa Nhà Kỳ Ngàn", category="services",
            category_label="Sửa xe & Dịch vụ", subcategory="office",
            lat=21.0250, lng=105.5255,
            address="Đường ĐT420, Thạch Hòa, Thạch Thất",
            area_name="Thạch Hòa",
            notes="Tòa nhà dịch vụ & văn phòng trên trục ĐT420",
            tags="tòa nhà,dịch vụ,trục ĐT420",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0250, 105.5255),
        ),
        POI(
            id=generate_id("Cơm Tấm Bảo Uyên", 21.0258, 105.5520),
            name="Cơm Tấm Bảo Uyên",
            name_vi="Cơm Tấm Bảo Uyên", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="restaurant",
            lat=21.0258, lng=105.5520,
            address="Trục ĐT420 gần Nhà Thờ Phú Hữu, Thạch Thất",
            area_name="Bình Yên / Phú Hữu",
            notes="Quán cơm tấm, cơm bình dân quen thuộc trục ĐT420",
            tags="cơm tấm,cơm bình dân,ăn trưa,giá sinh viên",
            min_price=35000, max_price=45000,
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0258, 105.5520),
        ),
        POI(
            id=generate_id("Mixue Phú Hữu", 21.0262, 105.5580),
            name="Mixue Phú Hữu",
            name_vi="Mixue Phú Hữu", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="fast_food",
            lat=21.0262, lng=105.5580,
            address="Khu vực Phú Hữu, Bình Yên, Thạch Thất",
            area_name="Bình Yên / Phú Hữu",
            notes="Trà sữa & kem Mixue giá rẻ học sinh, sinh viên",
            tags="trà sữa,kem,mixue,giá rẻ",
            min_price=10000, max_price=25000,
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0262, 105.5580),
        ),
        POI(
            id=generate_id("Nhà Thờ Phú Hữu", 21.0235, 105.5550),
            name="Nhà Thờ Giáo Xứ Phú Hữu",
            name_vi="Nhà Thờ Phú Hữu", category="services",
            category_label="Sửa xe & Dịch vụ", subcategory="place_of_worship",
            lat=21.0235, lng=105.5550,
            address="Thôn Phú Hữu, Tân Xã, Thạch Thất, Hà Nội",
            area_name="Bình Yên / Phú Hữu",
            notes="Địa điểm sinh hoạt cộng đồng & landmark mốc chỉ đường quan trọng",
            tags="nhà thờ,mốc chỉ đường,landmark",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0235, 105.5550),
        ),
        POI(
            id=generate_id("Học viện Tài chính Hòa Lạc", 21.0080, 105.5410),
            name="Học viện Tài chính - Cơ sở Hòa Lạc",
            name_vi="Học viện Tài chính - Cơ sở Hòa Lạc", category="campus",
            category_label="Trường & Điểm đón Bus", subcategory="university",
            lat=21.0080, lng=105.5410,
            address="Đường N18, Khu CNC Hòa Lạc, Thạch Thất, Hà Nội",
            area_name="Khu CNC Hòa Lạc",
            notes="Cơ sở đào tạo mới của Học viện Tài chính tại Hòa Lạc trên trục N18",
            tags="đại học,học viện tài chính,trục N18",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0080, 105.5410),
        ),
        POI(
            id=generate_id("Trường ĐH Điện Lực Cơ Sở 4", 21.0100, 105.5390),
            name="Trường Đại học Điện Lực - Cơ sở 4",
            name_vi="Trường Đại học Điện Lực - Cơ sở 4", category="campus",
            category_label="Trường & Điểm đón Bus", subcategory="university",
            lat=21.0100, lng=105.5390,
            address="Đường N18, Khu CNC Hòa Lạc, Thạch Thất, Hà Nội",
            area_name="Khu CNC Hòa Lạc",
            notes="Cơ sở thực hành và đào tạo của ĐH Điện Lực",
            tags="đại học,điện lực,trục N18",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0100, 105.5390),
        ),
        POI(
            id=generate_id("Nhà Văn Hóa Thôn 4 Hòa Lạc", 21.0125, 105.5205),
            name="Nhà Văn Hóa Thôn 4 Hòa Lạc",
            name_vi="Nhà Văn Hóa Thôn 4 Hòa Lạc", category="services",
            category_label="Sửa xe & Dịch vụ", subcategory="community_centre",
            lat=21.0125, lng=105.5205,
            address="Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thạch Hòa",
            notes="Nhà sinh hoạt cộng đồng Thôn 4, gần trục QL21",
            tags="nhà văn hóa,cộng đồng,thôn 4",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0125, 105.5205),
        ),
        POI(
            id=generate_id("Nhà Văn Hóa Thôn 5 Hòa Lạc", 21.0205, 105.5080),
            name="Nhà Văn Hóa Thôn 5 - Hoà Lạc",
            name_vi="Nhà Văn Hóa Thôn 5 - Hoà Lạc", category="services",
            category_label="Sửa xe & Dịch vụ", subcategory="community_centre",
            lat=21.0205, lng=105.5080,
            address="Thôn 5, Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thôn 5 Thạch Hòa",
            notes="Nhà sinh hoạt cộng đồng Thôn 5",
            tags="nhà văn hóa,cộng đồng,thôn 5",
            source="map_inspection", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0205, 105.5080),
        ),

        # ── 2. QUÁN ĂN & CAFE NỔI TIẾNG QUANH FPT HOÀ LẠC ──
        POI(
            id=generate_id("Hola Hotpot", 21.0140, 105.5270),
            name="Hola Hotpot",
            name_vi="Hola Hotpot - Lẩu Sinh Viên", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="restaurant",
            lat=21.0140, lng=105.5270,
            address="Gần cổng phụ ĐH FPT, Thạch Hòa, Thạch Thất",
            area_name="Thạch Hòa",
            notes="Quán lẩu cực quen thuộc của sinh viên FPT ngay cổng phụ, giá sinh viên",
            tags="lẩu,cổng phụ FPT,sinh viên,tụ tập",
            min_price=99000, max_price=150000,
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0140, 105.5270),
        ),
        POI(
            id=generate_id("Bánh mì Bamimo", 21.0148, 105.5260),
            name="Bánh mì Bamimo",
            name_vi="Bánh mì Bamimo", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="fast_food",
            lat=21.0148, lng=105.5260,
            address="Cổng trường ĐH FPT, Thạch Hòa, Thạch Thất",
            area_name="Thạch Hòa",
            notes="Bánh mì kẹp giòn, ship tận phòng ký túc xá FPT & các xóm trọ",
            tags="bánh mì,ship tận KTX,ăn sáng,nhanh gọn",
            min_price=20000, max_price=35000,
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0148, 105.5260),
        ),
        POI(
            id=generate_id("Nhà hàng 379 Minh Nga", 21.0155, 105.5180),
            name="Nhà hàng 379 Minh Nga",
            name_vi="Nhà hàng 379 Minh Nga", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="restaurant",
            lat=21.0155, lng=105.5180,
            address="Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thạch Hòa",
            notes="Chuyên đặc sản lẩu cua đồng, gà ri, cá tầm, không gian rộng rãi tiếp khách",
            tags="lẩu cua đồng,gà ri,tiếp khách,liên hoan",
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0155, 105.5180),
        ),
        POI(
            id=generate_id("Gà Ri Thành Luân", 21.0160, 105.5200),
            name="Gà Ri Thành Luân",
            name_vi="Gà Ri Thành Luân", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="restaurant",
            lat=21.0160, lng=105.5200,
            address="Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thạch Hòa",
            notes="Gà rang muối đậm đà, giá mềm phù hợp nhóm bạn",
            tags="gà ri,gà rang muối,nhóm bạn",
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0160, 105.5200),
        ),
        POI(
            id=generate_id("Layla Cafe Tân Xã", 21.0175, 105.5315),
            name="Layla Cafe",
            name_vi="Layla Cafe Tân Xã", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="cafe",
            lat=21.0175, lng=105.5315,
            address="Ngã tư Tân Xã, Thạch Thất, Hà Nội",
            area_name="Tân Xã",
            notes="Cafe phong cách retro những năm 80, không gian rộng thoáng họp nhóm",
            tags="cafe,retro,họp nhóm,chill",
            min_price=25000, max_price=45000,
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0175, 105.5315),
        ),
        POI(
            id=generate_id("M.O.C Tea & Coffee", 21.0152, 105.5188),
            name="M.O.C Tea & Coffee",
            name_vi="M.O.C Tea & Coffee", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="cafe",
            lat=21.0152, lng=105.5188,
            address="225 Thôn 4, Thạch Hòa, Thạch Thất",
            area_name="Thạch Hòa",
            notes="Trà sữa, trà hoa quả có ship tận nơi cho sinh viên trọ",
            tags="trà sữa,cafe,ship tận phòng",
            min_price=20000, max_price=40000,
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0152, 105.5188),
        ),
        POI(
            id=generate_id("Young Food & Drink", 21.0180, 105.5325),
            name="Young Food & Drink",
            name_vi="Young Food & Drink Tân Xã", category="food_drink",
            category_label="Ăn uống & Cafe", subcategory="cafe",
            lat=21.0180, lng=105.5325,
            address="68 Mục Uyên Công Nghệ, Tân Xã, Thạch Thất",
            area_name="Tân Xã",
            notes="Trang trí tối giản phong cách gen Z, đồ ăn vặt & trà sữa",
            tags="sống ảo,đồ ăn vặt,trà sữa,tân xã",
            min_price=20000, max_price=40000,
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0180, 105.5325),
        ),

        # ── 3. NHÀ THUỐC & Y TẾ KHẨN CẤP ──
        POI(
            id=generate_id("Phương Nam Pharmacy", 21.0148, 105.5195),
            name="Phương Nam Pharmacy",
            name_vi="Nhà thuốc Phương Nam", category="pharmacy",
            category_label="Hiệu thuốc & Y tế", subcategory="pharmacy",
            lat=21.0148, lng=105.5195,
            address="Thôn 6, Xã Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thạch Hòa",
            notes="Hiệu thuốc lớn, dược sĩ tư vấn tận tình, đầy đủ thuốc cảm, tiêu hóa, sơ cứu",
            tags="nhà thuốc,dược sĩ tư vấn,sơ cứu",
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0148, 105.5195),
        ),
        POI(
            id=generate_id("Nhà thuốc Mỹ Lệ", 21.0135, 105.5160),
            name="Nhà thuốc Mỹ Lệ",
            name_vi="Nhà thuốc Mỹ Lệ", category="pharmacy",
            category_label="Hiệu thuốc & Y tế", subcategory="pharmacy",
            lat=21.0135, lng=105.5160,
            address="Ngã 3 Hòa Lạc, Xã Thạch Hòa, Thạch Thất",
            area_name="Thạch Hòa",
            notes="Nhà thuốc quen thuộc tại điểm giao Ngã 3 Hòa Lạc",
            tags="nhà thuốc,ngã 3 hòa lạc,thuốc kê đơn",
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0135, 105.5160),
        ),
        POI(
            id=generate_id("Quầy thuốc Anh Phương", 21.0200, 105.5380),
            name="Quầy thuốc Anh Phương",
            name_vi="Quầy thuốc Anh Phương", category="pharmacy",
            category_label="Hiệu thuốc & Y tế", subcategory="pharmacy",
            lat=21.0200, lng=105.5380,
            address="Bình Yên, Thạch Thất, Hà Nội",
            area_name="Bình Yên / Phú Hữu",
            notes="Quầy thuốc khu vực Bình Yên",
            tags="nhà thuốc,bình yên",
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0200, 105.5380),
        ),

        # ── 4. SỬA XE & IN ẤN TIỆN ÍCH ──
        POI(
            id=generate_id("Cứu hộ Sửa xe máy Tuấn Cường", 21.0115, 105.5265),
            name="Cứu Hộ & Sửa Xe Máy Tuấn Cường 24/7",
            name_vi="Sửa Xe Máy Tuấn Cường 24/7", category="services",
            category_label="Sửa xe & Dịch vụ", subcategory="motorcycle_repair",
            lat=21.0115, lng=105.5265,
            address="Đối diện Cổng 3 KTX ĐH FPT, Thạch Hòa, Thạch Thất",
            area_name="Thạch Hòa",
            phone="0988776655",
            notes="Cứu hộ vá xe đêm khuya, thay săm lốp, bảo dưỡng xe máy cho sinh viên FPT",
            tags="sửa xe máy,cứu hộ đêm 24/7,vá xe,cổng 3 FPT",
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0115, 105.5265),
        ),
        POI(
            id=generate_id("Tiệm In ấn Photocopy Thôn 3", 21.0155, 105.5210),
            name="Tiệm Photo & In Ấn Đồ Án Thôn 3",
            name_vi="Photo & In Ấn Đồ Án Thôn 3", category="services",
            category_label="Sửa xe & Dịch vụ", subcategory="copyshop",
            lat=21.0155, lng=105.5210,
            address="Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội",
            area_name="Thạch Hòa",
            notes="Chuyên in ấn tài liệu, đóng bìa mạ vàng đồ án tốt nghiệp, photo đề cương",
            tags="photo,in đồ án,bìa mạ vàng,giá sinh viên",
            source="web_research", scraped_at=now, status="needs_verify",
            distance_to_fpt_m=haversine_distance(21.0135, 105.5252, 21.0155, 105.5210),
        ),
    ]
    return curated


# ══════════════════════════════════════════════════════════════════════
# DEDUP & MERGE
# ══════════════════════════════════════════════════════════════════════

def dedup_pois(pois: list[POI], distance_threshold_m: float = 60) -> list[POI]:
    """Deduplicate các điểm trùng lặp theo tọa độ gần nhau và tên tương đồng."""
    result = []
    used = set()
    
    for i, p1 in enumerate(pois):
        if i in used:
            continue
        best = p1
        for j, p2 in enumerate(pois[i+1:], start=i+1):
            if j in used:
                continue
            dist = haversine_distance(p1.lat, p1.lng, p2.lat, p2.lng)
            
            p1_n = p1.name.lower().replace(" ", "").replace("-", "")
            p2_n = p2.name.lower().replace(" ", "").replace("-", "")
            name_similar = (p1_n in p2_n or p2_n in p1_n)
            
            if dist < distance_threshold_m and (name_similar or p1.category == p2.category):
                score1 = len(p1.notes) + (10 if p1.phone else 0) + (10 if p1.tags else 0)
                score2 = len(p2.notes) + (10 if p2.phone else 0) + (10 if p2.tags else 0)
                if score2 > score1:
                    best = p2
                used.add(j)
        result.append(best)
    return result


# ══════════════════════════════════════════════════════════════════════
# EXPORT
# ══════════════════════════════════════════════════════════════════════

def export_csv(pois: list[POI], filepath: str):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    fields = [
        'id', 'name', 'name_vi', 'category', 'category_label', 'subcategory',
        'lat', 'lng', 'address', 'area_name', 'phone', 'opening_hours',
        'distance_to_fpt_m', 'status', 'notes', 'tags', 'source', 'scraped_at'
    ]
    with open(filepath, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        writer.writeheader()
        for poi in pois:
            writer.writerow(asdict(poi))
    print(f"📄 Exported CSV: {filepath} ({len(pois)} địa điểm)")


def export_geojson(pois: list[POI], filepath: str):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    features = []
    for poi in pois:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [poi.lng, poi.lat]
            },
            "properties": {
                k: v for k, v in asdict(poi).items()
                if k not in ('lat', 'lng')
            }
        }
        features.append(feature)
    
    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "title": "Hòa Lạc Student Map POI Dataset",
            "bbox_from_n18_up": [BBOX["west"], BBOX["south"], BBOX["east"], BBOX["north"]],
            "total_places": len(pois),
            "created_at": datetime.now().isoformat(),
        },
        "features": features,
    }
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)
    print(f"🗺️  Exported GeoJSON: {filepath} ({len(pois)} địa điểm)")


def export_verify_checklist(pois: list[POI], filepath: str):
    """File checklist tiện dụng để mang đi thực địa hoặc mở xem trên điện thoại."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    fields = [
        'id', 'name', 'category_label', 'area_name', 'lat', 'lng',
        'distance_to_fpt_m', 'phone', 'notes',
        'VERIFIED_STATUS', 'VERIFIED_CORRECT_NAME', 'VERIFIED_NOTES'
    ]
    with open(filepath, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        writer.writeheader()
        for poi in sorted(pois, key=lambda p: (p.area_name, p.category)):
            row = asdict(poi)
            row['VERIFIED_STATUS'] = ''         # Còn mở / Đã đóng / Đổi chủ / Đã chuyển
            row['VERIFIED_CORRECT_NAME'] = ''   # Tên biển hiệu thực tế
            row['VERIFIED_NOTES'] = ''          # Ghi chú giá cả, dịch vụ thêm
            writer.writerow(row)
    print(f"✅ Exported Checklist: {filepath} ({len(pois)} địa điểm)")


# ══════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="Hòa Lạc POI Scraper Pipeline")
    parser.add_argument(
        '--mode', choices=['test', 'top25', 'full'], default='top25',
        help='test: lấy 3 quán mẫu; top25: 25 địa điểm nổi tiếng nhất đủ 7 danh mục; full: cào toàn bộ'
    )
    parser.add_argument(
        '--skip-osm', action='store_true',
        help='Chỉ dùng curated data, bỏ qua OSM'
    )
    args = parser.parse_args()

    if args.mode == 'top25':
        from generate_top25 import main as gen_top25_main
        gen_top25_main()
        return
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "output")
    
    print("\n" + "=" * 65)
    print("📍 HÒA LẠC POI SCRAPER - BẢN ĐỒ SINH VIÊN FPT (CONNECT HUB)")
    print(f"🔹 Chế độ: {args.mode.upper()}")
    print(f"🔹 Vùng quét: Từ đường N18 hất lên phía bắc {BBOX}")
    print(f"🔹 Thư mục xuất file: {output_dir}")
    print("=" * 65)
    
    all_pois = []
    
    # BƯỚC 1: OpenStreetMap (Overpass)
    if not args.skip_osm:
        print("\n🚀 BƯỚC 1: Quét dữ liệu tọa độ thực tế từ OpenStreetMap...")
        if args.mode == 'test':
            # Ở test mode chỉ quét danh mục ăn uống để demo tốc độ
            osm_pois = scrape_osm(['food_drink'])
        else:
            osm_pois = scrape_osm()
        all_pois.extend(osm_pois)
        print(f"   -> Đã lấy {len(osm_pois)} điểm từ OSM")
    
    # BƯỚC 2: Dữ liệu Curated (từ ảnh map khoanh vùng & research)
    print("\n📋 BƯỚC 2: Tích hợp dữ liệu đặc thù địa phương (Ảnh bản đồ + Nhóm FPT)...")
    curated_pois = get_curated_places()
    all_pois.extend(curated_pois)
    print(f"   -> Đã tích hợp {len(curated_pois)} điểm đặc thù")
    
    # BƯỚC 3: Dedup
    print("\n🔄 BƯỚC 3: Khử trùng lặp và đồng bộ thông tin...")
    before = len(all_pois)
    all_pois = dedup_pois(all_pois)
    after = len(all_pois)
    print(f"   -> Trước: {before} điểm -> Sau khi lọc: {after} điểm")
    
    # BƯỚC 4: Chế độ TEST (Chọn 3 quán mẫu theo yêu cầu)
    suffix = ""
    if args.mode == 'test':
        suffix = "_test"
        # Chọn 3 quán đại diện: 1 Quán ăn, 1 Hiệu thuốc, 1 Trọ/Tiện ích
        sample_food = next((p for p in all_pois if p.category == 'food_drink'), None)
        sample_pharmacy = next((p for p in all_pois if p.category == 'pharmacy'), None)
        sample_other = next((p for p in all_pois if p.category in ('boarding_house', 'services')), None)
        
        test_samples = [p for p in [sample_food, sample_pharmacy, sample_other] if p]
        if len(test_samples) < 3:
            test_samples = all_pois[:3]
        all_pois = test_samples
        print(f"\n🧪 [CHẾ ĐỘ TEST]: Thu gọn danh sách xuống đúng {len(all_pois)} quán mẫu theo yêu cầu!")
    
    # BƯỚC 5: Xuất dữ liệu (CHƯA VÀO DATABASE)
    print("\n💾 BƯỚC 5: Xuất tệp dữ liệu kiểm định...")
    export_csv(all_pois, os.path.join(output_dir, f"hoalac_places{suffix}.csv"))
    export_geojson(all_pois, os.path.join(output_dir, f"hoalac_places{suffix}.geojson"))
    export_verify_checklist(all_pois, os.path.join(output_dir, f"hoalac_verify_checklist{suffix}.csv"))
    
    print("\n" + "=" * 65)
    print("📊 KẾT QUẢ ĐÃ SẴN SÀNG:")
    for idx, p in enumerate(all_pois, 1):
        print(f" [{idx}] {p.name}")
        print(f"     📍 Vị trí: ({p.lat:.4f}, {p.lng:.4f}) - Khu vực: {p.area_name}")
        print(f"     🏷️  Danh mục: {p.category_label} | Khoảng cách tới FPT: {p.distance_to_fpt_m:.0f}m")
        if p.notes:
            print(f"     💡 Ghi chú: {p.notes}")
        if p.phone:
            print(f"     📞 Điện thoại: {p.phone}")
            
    print("\n🔒 Lưu ý: Dữ liệu hiện được lưu trữ an toàn trong `scraper/output/`.")
    print("   Database của bạn CHƯA BỊ THAY ĐỔI.")
    if args.mode == 'test':
        print("\n👉 Để quét TOÀN BỘ khu vực N18 hất lên, chạy lệnh:")
        print("   python scraper/scrape_hoalac.py --mode full")
    print("=" * 65)


if __name__ == "__main__":
    main()
