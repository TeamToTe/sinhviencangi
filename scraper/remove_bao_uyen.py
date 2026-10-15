import csv
import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(script_dir, "output")

csv_path = os.path.join(output_dir, "hoalac_places_top25.csv")
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# Remove Com Tam Bao Uyen
remaining = [r for r in rows if "Bảo Uyên" not in r["name"]]
print(f"Ban đầu: {len(rows)} -> Sau khi bỏ Cơm Tấm Bảo Uyên: {len(remaining)} dòng")

# Ghi lại CSV
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.DictWriter(f, fieldnames=reader.fieldnames, extrasaction='ignore')
    writer.writeheader()
    for r in remaining:
        writer.writerow(r)

# Ghi lại GeoJSON
geojson_path = os.path.join(output_dir, "hoalac_places_top25.geojson")
features = []
for r in remaining:
    features.append({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [float(r["lng"]), float(r["lat"])]
        },
        "properties": {
            "id": r["id"],
            "name": r["name"],
            "category": r["category"],
            "category_label": r["category_label"],
            "area_name": r["area_name"],
            "address": r["address"],
            "phone": r.get("phone", ""),
            "distance_to_fpt_m": float(r.get("distance_to_fpt_m", 0)),
            "notes": r.get("notes", ""),
        }
    })

with open(geojson_path, 'w', encoding='utf-8') as f:
    json.dump({
        "type": "FeatureCollection",
        "metadata": {
            "title": "Top Địa Điểm Nổi Bật Hòa Lạc (Đã trừ các điểm test đã nạp)",
            "total_places": len(features)
        },
        "features": features
    }, f, ensure_ascii=False, indent=2)

# Ghi lại Checklist
chk_path = os.path.join(output_dir, "hoalac_verify_checklist_top25.csv")
with open(chk_path, 'r', encoding='utf-8-sig') as f:
    chk_reader = csv.DictReader(f)
    chk_rows = [r for r in chk_reader if "Bảo Uyên" not in r["name"]]

with open(chk_path, 'w', newline='', encoding='utf-8-sig') as f:
    chk_writer = csv.DictWriter(f, fieldnames=chk_reader.fieldnames, extrasaction='ignore')
    chk_writer.writeheader()
    for r in chk_rows:
        chk_writer.writerow(r)

print("✅ Đã cập nhật xong toàn bộ file dữ liệu!")
