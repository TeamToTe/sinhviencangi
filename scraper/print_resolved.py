import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('output/resolved_google_maps_cids.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

print(f"=== TỔNG CỘNG {len(places)} ĐỊA ĐIỂM CHÍNH CHỦ GOOGLE MAPS 100% ===")
for i, p in enumerate(places, 1):
    print(f"{i:2d}. [{p['ward']}] {p['name_google_maps']} | GPS: ({p['latitude']}, {p['longitude']}) | Giá: {p['price']:,.0f}đ")
    print(f"    Google Maps: {p['google_maps_url']}")
