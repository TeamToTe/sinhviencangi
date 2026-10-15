"""
Tách điểm đã insert vào DB ra khỏi file danh sách (còn lại 24 điểm trong file)
"""

import csv
import json
import os
import sqlite3

script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(script_dir, "output")
db_path = os.path.join(os.path.dirname(script_dir), "backend", "data", "connecthub.sqlite")

# 1. Query điểm vừa insert từ DB
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("SELECT * FROM places WHERE name LIKE '%Hola Hotpot%';")
db_row = cur.fetchone()
if db_row:
    inserted_dict = dict(db_row)
    print(f"Đã tìm thấy điểm trong DB: ID={inserted_dict['id']} - {inserted_dict['name']}")
else:
    inserted_dict = {}
    print("Chưa tìm thấy trong DB!")
conn.close()

# Lưu thông tin điểm đã insert vào file riêng
inserted_info_path = os.path.join(output_dir, "inserted_place_info.json")
with open(inserted_info_path, 'w', encoding='utf-8') as f:
    json.dump({
        "status": "INSERTED_INTO_DB",
        "target_database": "SQLite (backend/data/connecthub.sqlite)",
        "db_record": inserted_dict,
        "note": "Địa điểm này đã được nạp thử nghiệm vào Database để kiểm tra hiển thị và tọa độ GPS."
    }, f, ensure_ascii=False, indent=2)
print(f"✅ Đã lưu thông tin điểm đã insert vào: {inserted_info_path}")

# 2. Đọc file CSV top25 hiện tại và lọc bỏ điểm 'Hola Hotpot'
csv_path = os.path.join(output_dir, "hoalac_places_top25.csv")
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    all_rows = list(reader)

remaining_rows = [r for r in all_rows if "Hola Hotpot" not in r["name"]]
print(f"Tổng điểm ban đầu: {len(all_rows)} -> Sau khi bỏ điểm đã insert: {len(remaining_rows)} điểm")

# Ghi đè file CSV (chỉ còn 24 điểm)
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.DictWriter(f, fieldnames=reader.fieldnames, extrasaction='ignore')
    writer.writeheader()
    for r in remaining_rows:
        writer.writerow(r)
print(f"✅ Đã cập nhật CSV (24 điểm): {csv_path}")

# 3. Cập nhật file GeoJSON (chỉ còn 24 điểm)
geojson_path = os.path.join(output_dir, "hoalac_places_top25.geojson")
features = []
for r in remaining_rows:
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
            "rating": float(r.get("rating", 0)),
            "min_price": int(r.get("min_price", 0)),
            "max_price": int(r.get("max_price", 0)),
            "notes": r.get("notes", ""),
        }
    })

with open(geojson_path, 'w', encoding='utf-8') as f:
    json.dump({
        "type": "FeatureCollection",
        "metadata": {
            "title": "Top 24 Địa Điểm Nổi Bật Hòa Lạc (Đã trừ 1 điểm vừa insert)",
            "total_places": len(features),
            "excluded_place": "Hola Hotpot - Lẩu Sinh Viên (Đã nạp vào DB)",
        },
        "features": features
    }, f, ensure_ascii=False, indent=2)
print(f"✅ Đã cập nhật GeoJSON (24 điểm): {geojson_path}")

# 4. Cập nhật file Checklist (chỉ còn 24 điểm)
chk_path = os.path.join(output_dir, "hoalac_verify_checklist_top25.csv")
with open(chk_path, 'r', encoding='utf-8-sig') as f:
    chk_reader = csv.DictReader(f)
    chk_rows = [r for r in chk_reader if "Hola Hotpot" not in r["name"]]

with open(chk_path, 'w', newline='', encoding='utf-8-sig') as f:
    chk_writer = csv.DictWriter(f, fieldnames=chk_reader.fieldnames, extrasaction='ignore')
    chk_writer.writeheader()
    for r in chk_rows:
        chk_writer.writerow(r)
print(f"✅ Đã cập nhật Checklist (24 điểm): {chk_path}")

# 5. Cập nhật file SQL Insert (chỉ còn 24 câu lệnh)
sql_path = os.path.join(output_dir, "import_top25_places.sql")
with open(sql_path, 'w', encoding='utf-8') as f:
    f.write("-- ==========================================================\n")
    f.write("-- TOP 24 ĐỊA ĐIỂM CÒN LẠI (ĐÃ TRỪ 1 ĐIỂM HOLA HOTPOT ĐÃ INSERT)\n")
    f.write("-- ==========================================================\n\n")

    for p in remaining_rows:
        tags_list = [t.strip() for t in p.get("tags_str", "").split(",") if t.strip()]
        tags_sql = "ARRAY[" + ",".join(f"'{t}'" for t in tags_list) + "]" if tags_list else "NULL"
        clean_name = p['name'].replace("'", "''")
        clean_area = p['area_name'].replace("'", "''")
        clean_addr = p['address'].replace("'", "''")
        phone_val = f"'{p['phone']}'" if p.get('phone') else "NULL"
        hours_val = f"'{p['opening_hours']}'" if p.get('opening_hours') else "NULL"
        min_p = p['min_price'] if int(p.get('min_price', 0)) > 0 else "NULL"
        max_p = p['max_price'] if int(p.get('max_price', 0)) > 0 else "NULL"

        f.write(f"""INSERT INTO places (category_id, name, area, address, latitude, longitude, min_price, max_price, opening_hours, phone, amenities)
VALUES ({p['category_id']}, '{clean_name}', '{clean_area}', '{clean_addr}', {p['lat']}, {p['lng']}, {min_p}, {max_p}, {hours_val}, {phone_val}, {tags_sql});\n\n""")
print(f"✅ Đã cập nhật SQL Insert (24 câu lệnh): {sql_path}")
