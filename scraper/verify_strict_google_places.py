import json
import re
import urllib.parse
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('output/trohoalac_full_scraped.json', 'r', encoding='utf-8') as f:
    rooms = json.load(f)

verified_real_places = []
seen = set()

for r in rooms:
    maps_str = r.get('maps_embed') or ''
    # A real Google Maps POI has a hex Place ID / CID like !1s0x...:0x...
    m_cid = re.search(r'!1s(0x[0-9a-fA-F]+(?:%3A|:)[0-9a-fA-F]+)', maps_str)
    
    # Coordinates in Google Maps embed
    m_coord = re.search(r'!2d(105\.\d+)!3d(21\.\d+)', maps_str)
    if not m_coord:
        m_coord = re.search(r'!3d(21\.\d+)!4d(105\.\d+)', maps_str)
    
    # Place Name registered on Google Maps
    m_name = re.search(r'!2s([^!]+)', maps_str)
    gg_place_name = urllib.parse.unquote(m_name.group(1)) if m_name else None
    
    if m_cid and m_coord and gg_place_name:
        lat = float(m_coord.group(2) if '!2d' in maps_str else m_coord.group(1))
        lng = float(m_coord.group(1) if '!2d' in maps_str else m_coord.group(2))
        
        # Check if coordinates fall within Hoa Lac
        if 20.985 <= lat <= 21.05 and 105.495 <= lng <= 105.565:
            key = (round(lat, 5), round(lng, 5))
            if key not in seen:
                seen.add(key)
                verified_real_places.append({
                    "title_trohoalac": r['title'],
                    "name_on_google_maps": gg_place_name,
                    "cid": m_cid.group(1),
                    "lat": lat,
                    "lng": lng,
                    "ward": r['ward'],
                    "price": r['price'],
                    "banner": r['banner'],
                    "images": r['images'][:6],
                    "amenities": r['amenities'][:8],
                    "embed_url": maps_str
                })

print(f"🎉 TÌM THẤY {len(verified_real_places)} KHU TRỌ CÓ POI CHÍNH THỨC 100% TRÊN GOOGLE MAPS!")
print("=" * 70)
for i, p in enumerate(verified_real_places, 1):
    print(f"{i:2d}. [trohoalac.com: '{p['title_trohoalac']}']")
    print(f"    -> Tên chính chủ trên Google Maps: '{p['name_on_google_maps']}'")
    print(f"    -> Tọa độ: ({p['lat']}, {p['lng']}) | {p['ward']} | Giá: {p['price']:,.0f}đ")
    print(f"    -> Ảnh thật: {len(p['images'])} ảnh | Tiện ích: {p['amenities'][:4]}")

with open('output/trohoalac_strict_verified.json', 'w', encoding='utf-8') as f:
    json.dump(verified_real_places, f, ensure_ascii=False, indent=2)
