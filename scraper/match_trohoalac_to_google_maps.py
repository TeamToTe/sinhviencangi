import json
import re
import time
import urllib.parse
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

# Bounding box của khu vực Hòa Lạc
HOALAC_BOUNDS = {
    "min_lat": 20.985,
    "max_lat": 21.045,
    "min_lng": 105.495,
    "max_lng": 105.565
}

def is_in_hoalac(lat, lng):
    if not lat or not lng:
        return False
    return (HOALAC_BOUNDS["min_lat"] <= lat <= HOALAC_BOUNDS["max_lat"] and
            HOALAC_BOUNDS["min_lng"] <= lng <= HOALAC_BOUNDS["max_lng"])

def extract_gps_from_embed(maps_url):
    if not maps_url:
        return None, None
    # Google Maps embed format: !2d105.55205!3d21.023568
    m = re.search(r'!2d(105\.\d+)!3d(21\.\d+)', maps_url)
    if m:
        return float(m.group(2)), float(m.group(1))
    m2 = re.search(r'!3d(21\.\d+)!4d(105\.\d+)', maps_url)
    if m2:
        return float(m2.group(1)), float(m2.group(2))
    return None, None

def search_google_maps(page, title, ward):
    query = f"{title} {ward} Hòa Lạc Thạch Thất"
    encoded = urllib.parse.quote(query)
    url = f"https://www.google.com/maps/search/{encoded}"
    try:
        page.goto(url, timeout=20000)
        page.wait_for_timeout(3500)
        curr_url = page.url
        
        # Check first result if list
        if "/search/" in curr_url and not re.search(r'!3d[0-9]', curr_url):
            first = page.locator('div[role="feed"] a[href*="/place/"]').first
            if first.count() > 0:
                first.click()
                page.wait_for_timeout(3000)
                curr_url = page.url
                
        m = re.search(r'!3d([0-9]+\.[0-9]+)!4d([0-9]+\.[0-9]+)', curr_url)
        if m:
            lat = float(m.group(1))
            lng = float(m.group(2))
            if is_in_hoalac(lat, lng):
                return lat, lng, curr_url
        else:
            m_at = re.search(r'@([0-9]+\.[0-9]+),([0-9]+\.[0-9]+)', curr_url)
            if m_at:
                lat = float(m_at.group(1))
                lng = float(m_at.group(2))
                if is_in_hoalac(lat, lng):
                    return lat, lng, curr_url
    except Exception as e:
        pass
    return None, None, None

def main():
    with open('output/trohoalac_full_scraped.json', 'r', encoding='utf-8') as f:
        rooms = json.load(f)
        
    print(f"Tổng số phòng từ trohoalac.com: {len(rooms)}")
    
    # Gom nhóm theo tên trọ chính (ví dụ YoungHouse 1, YoungHouse 2...) để tránh trùng tòa
    properties = {}
    for r in rooms:
        # Chuẩn hóa tên tòa
        raw_title = r.get('title', '').strip()
        # Loại bỏ các hậu tố số phòng nhỏ như "- P101", "P.202" nếu có
        clean_name = re.sub(r'[\s-]+(?:P|Phòng)\.?\s*\d+.*$', '', raw_title, flags=re.IGNORECASE).strip()
        if not clean_name:
            clean_name = raw_title
            
        if clean_name not in properties:
            properties[clean_name] = {
                "name": clean_name,
                "ward": r.get('ward') or 'Thạch Hòa',
                "address": r.get('address') or r.get('ward'),
                "min_price": r.get('price'),
                "max_price": r.get('price_max') or r.get('price'),
                "area_sqm": r.get('area_sqm'),
                "maps_embed": r.get('maps_embed'),
                "banner": r.get('banner'),
                "images": list(r.get('images', [])),
                "amenities": list(r.get('amenities', [])),
                "descriptions": [r.get('description')] if r.get('description') else [],
                "status": r.get('status') or 'available',
                "room_count": 1
            }
        else:
            p = properties[clean_name]
            p["room_count"] += 1
            if r.get('price') and (not p["min_price"] or r['price'] < p["min_price"]):
                p["min_price"] = r['price']
            if r.get('price') and (not p["max_price"] or r['price'] > p["max_price"]):
                p["max_price"] = r['price']
            for img in r.get('images', []):
                if img not in p["images"]:
                    p["images"].append(img)
            for a in r.get('amenities', []):
                if a not in p["amenities"]:
                    p["amenities"].append(a)
            if not p["maps_embed"] and r.get('maps_embed'):
                p["maps_embed"] = r['maps_embed']
                
    print(f"Đã gom nhóm thành {len(properties)} khu trọ/tòa nhà riêng biệt.")
    
    matched_from_embed = 0
    needs_search = []
    final_places = []
    
    for name, p in properties.items():
        lat, lng = extract_gps_from_embed(p.get('maps_embed'))
        if lat and lng and is_in_hoalac(lat, lng):
            p['lat'] = lat
            p['lng'] = lng
            p['source_gps'] = 'maps_embed'
            matched_from_embed += 1
            final_places.append(p)
        else:
            needs_search.append(p)
            
    print(f"✅ Có sẵn GPS chuẩn Hòa Lạc từ Google Maps Embed: {matched_from_embed} khu trọ.")
    print(f"🔍 Cần tra cứu Google Maps tiếp: {len(needs_search)} khu trọ.")
    
    # Dùng Playwright tìm kiếm sang Google Maps
    # "từ tên của nó tìm sang gg map, ra thì ra k ra thì thôi"
    print("\n🚀 Đang khởi động Playwright tra cứu Google Maps...")
    matched_from_search = 0
    not_found = 0
    
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        page = browser.new_page()
        
        # Thử tìm kiếm top các khu trọ nổi tiếng nhất trước (giới hạn 30 điểm đầu)
        for idx, p in enumerate(needs_search[:35], 1):
            name = p['name']
            ward = p['ward']
            print(f"[{idx}/{min(len(needs_search), 35)}] Tìm: '{name}' ({ward})...")
            lat, lng, gmaps_url = search_google_maps(page, name, ward)
            if lat and lng:
                print(f"   🎉 TÌM THẤY TRÊN GOOGLE MAPS: ({lat}, {lng})")
                p['lat'] = lat
                p['lng'] = lng
                p['maps_url'] = gmaps_url
                p['source_gps'] = 'google_maps_search'
                matched_from_search += 1
                final_places.append(p)
            else:
                print("   ❌ Không thấy trên Google Maps (bỏ qua theo yêu cầu)")
                not_found += 1
            time.sleep(1)
            
        browser.close()
        
    print(f"\n==========================================")
    print(f"TỔNG KẾT KẾT QUẢ TÌM KIẾM:")
    print(f" • Có sẵn tọa độ Google Maps Embed: {matched_from_embed}")
    print(f" • Tìm thấy mới trên Google Maps: {matched_from_search}")
    print(f" • Không thấy trên Google Maps: {not_found}")
    print(f" • Tổng số trọ CHUẨN GOOGLE MAPS được chọn: {len(final_places)}")
    print(f"==========================================")
    
    with open('output/trohoalac_google_maps_matched.json', 'w', encoding='utf-8') as f:
        json.dump(final_places, f, ensure_ascii=False, indent=2)
    print("Đã lưu kết quả vào output/trohoalac_google_maps_matched.json")

if __name__ == '__main__':
    main()
