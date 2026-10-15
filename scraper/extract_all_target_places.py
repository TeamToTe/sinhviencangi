import re
import json
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

all_places = {}

# 1. SQLite DB places
try:
    conn = sqlite3.connect('backend/data/connecthub.sqlite')
    cursor = conn.cursor()
    places_db = cursor.execute('SELECT id, name, category_id, area, address, latitude, longitude, images FROM places').fetchall()
    for row in places_db:
        pid = f"db-{row[0]}"
        name = row[1].strip()
        # Avoid duplicate mock trà sữa test entries if any
        if name not in all_places:
            all_places[name] = {
                "source": "sqlite",
                "id": pid,
                "name": name,
                "category": row[2],
                "area": row[3],
                "address": row[4],
                "lat": float(row[5]) if row[5] else None,
                "lng": float(row[6]) if row[6] else None,
                "existing_images": json.loads(row[7]) if row[7] else []
            }
except Exception as e:
    print(f"Error reading SQLite: {e}")

# 2. Seed data (backend/src/db/seedData.ts)
try:
    with open('backend/src/db/seedData.ts', 'r', encoding='utf-8') as f:
        seed_txt = f.read()
    # Extract only inside INITIAL_PLACES block
    places_part = seed_txt.split('INITIAL_PLACES = [')[-1]
    seed_matches = re.findall(
        r'name:\s*[\'"]([^\'"]+)[\'"].*?categoryName:\s*[\'"]([^\'"]+)[\'"].*?area:\s*[\'"]([^\'"]+)[\'"].*?address:\s*[\'"]([^\'"]+)[\'"].*?latitude:\s*([0-9.]+).*?longitude:\s*([0-9.]+)',
        places_part,
        re.DOTALL
    )
    for name, cat, area, addr, lat, lng in seed_matches:
        name = name.strip()
        if name not in all_places and name not in ['boarding_house', 'food_drink', 'campus', 'grocery', 'pharmacy', 'services', 'entertainment']:
            all_places[name] = {
                "source": "seedData.ts",
                "id": f"seed-{name}",
                "name": name,
                "category": cat,
                "area": area,
                "address": addr,
                "lat": float(lat),
                "lng": float(lng),
                "existing_images": []
            }
except Exception as e:
    print(f"Error reading seedData.ts: {e}")

# 3. Mock places (frontend/src/data/mockPlaces.ts)
try:
    with open('frontend/src/data/mockPlaces.ts', 'r', encoding='utf-8') as f:
        mock_txt = f.read()
    # Match places
    place_blocks = re.findall(
        r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"].*?category:\s*[\'"]([^\'"]+)[\'"].*?address:\s*[\'"]([^\'"]+)[\'"].*?coordinates:\s*\{\s*lng:\s*([0-9.]+),\s*lat:\s*([0-9.]+)\s*\}',
        mock_txt,
        re.DOTALL
    )
    for pid, name, cat, addr, lng, lat in place_blocks:
        name = name.strip()
        if name not in all_places:
            all_places[name] = {
                "source": "mockPlaces.ts",
                "id": pid,
                "name": name,
                "category": cat,
                "area": "",
                "address": addr,
                "lat": float(lat),
                "lng": float(lng),
                "existing_images": []
            }
        else:
            # Add mock id reference
            all_places[name]["mock_id"] = pid
except Exception as e:
    print(f"Error reading mockPlaces.ts: {e}")

targets = list(all_places.values())
print(f"=== TỔNG CỘNG {len(targets)} ĐỊA ĐIỂM CẦN QUÉT ẢNH ===")
for i, p in enumerate(targets, 1):
    print(f"{i:2d}. [{p['category']}] {p['name']} | ({p['lat']}, {p['lng']}) | {p.get('address', '')}")

with open('scraper/output/places_to_crawl.json', 'w', encoding='utf-8') as f:
    json.dump(targets, f, ensure_ascii=False, indent=2)

print("Đã lưu danh sách vào scraper/output/places_to_crawl.json")
