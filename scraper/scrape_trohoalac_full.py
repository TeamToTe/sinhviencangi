import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscWtlY3F3ZnZreW1zemtxb29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDIyNTgsImV4cCI6MjA3MjkxODI1OH0.wYXBVr3nBFVtCk1lezMKYRgprsiRJdGGEgdqXTQ5I1E"
BASE_URL = "https://vlqkecqwfvkymszkqooo.supabase.co/rest/v1"

headers = {
    'apikey': API_KEY,
    'Authorization': f'Bearer {API_KEY}'
}

def fetch_table(table_name, select="*"):
    url = f"{BASE_URL}/{table_name}?select={select}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())

def main():
    print("⏳ Đang tải toàn bộ dữ liệu từ trohoalac.com...")
    rooms = fetch_table("rooms")
    print(f"✅ Đã tải {len(rooms)} phòng trọ (bảng rooms).")
    
    try:
        images = fetch_table("room_images")
        print(f"✅ Đã tải {len(images)} hình ảnh (bảng room_images).")
    except Exception as e:
        print(f"Lỗi tải room_images: {e}")
        images = []
        
    try:
        room_amenities = fetch_table("room_amenities")
        amenities = fetch_table("amenities")
        amenity_map = {a['id']: a['name'] for a in amenities}
        print(f"✅ Đã tải {len(amenities)} danh mục tiện nghi, {len(room_amenities)} liên kết phòng.")
    except Exception as e:
        print(f"Lỗi tải amenities: {e}")
        room_amenities, amenity_map = [], {}

    # Map images & amenities to each room
    img_map = {}
    for img in images:
        rid = img.get('room_id')
        if rid:
            img_map.setdefault(rid, []).append(img.get('image_url'))
            
    amenity_by_room = {}
    for ra in room_amenities:
        rid = ra.get('room_id')
        aid = ra.get('amenity_id')
        if rid and aid in amenity_map:
            amenity_by_room.setdefault(rid, []).append(amenity_map[aid])

    enriched_rooms = []
    for r in rooms:
        rid = r.get('id')
        room_imgs = img_map.get(rid, [])
        if r.get('banner') and r.get('banner') not in room_imgs:
            room_imgs.insert(0, r['banner'])
            
        r_amenities = amenity_by_room.get(rid, [])
        
        enriched_rooms.append({
            "id": rid,
            "title": r.get('title'),
            "price": r.get('price'),
            "price_max": r.get('price_max'),
            "area_sqm": r.get('area'),
            "address": r.get('address'),
            "ward": r.get('ward'),
            "district": r.get('district'),
            "city": r.get('city'),
            "maps_embed": r.get('maps'),
            "status": r.get('status'),
            "banner": r.get('banner'),
            "images": room_imgs,
            "amenities": r_amenities,
            "description": r.get('description'),
            "zalo": r.get('zalo'),
            "created_at": r.get('created_at'),
        })

    with open("output/trohoalac_full_scraped.json", "w", encoding="utf-8") as f:
        json.dump(enriched_rooms, f, ensure_ascii=False, indent=2)
        
    print(f"\n🎉 Đã bóc tách và gộp thành công {len(enriched_rooms)} phòng trọ đầy đủ ảnh & tiện ích!")
    print("Mẫu 3 phòng đầu tiên:")
    for r in enriched_rooms[:3]:
        print(f" • [{r['ward']}] {r['title']} | Giá: {r['price']} | {len(r['images'])} ảnh | {r['amenities'][:4]}")

if __name__ == '__main__':
    main()
