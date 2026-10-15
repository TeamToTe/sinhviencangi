import json
import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('output/curated_24_places_checked.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

# Export to CSV
csv_file = 'output/hoalac_places_24.csv'
fieldnames = [
    'id', 'name', 'category', 'category_vn', 'location_type',
    'lat', 'lng', 'area', 'address', 'min_price', 'max_price',
    'phone', 'opening_hours', 'description', 'tags'
]

with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for p in places:
        row = dict(p)
        row['tags'] = ', '.join(p['tags'])
        row.pop('px', None)
        writer.writerow(row)
print(f"Exported CSV: {csv_file}")

# Export GeoJSON
geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [p['lng'], p['lat']]
            },
            "properties": {
                "id": p['id'],
                "name": p['name'],
                "category": p['category'],
                "location_type": p['location_type'],
                "area": p['area'],
                "address": p['address'],
                "min_price": p['min_price'],
                "max_price": p['max_price'],
                "opening_hours": p['opening_hours']
            }
        }
        for p in places
    ]
}

with open('output/hoalac_places_24.geojson', 'w', encoding='utf-8') as f:
    json.dump(geojson, f, ensure_ascii=False, indent=2)
print("Exported GeoJSON: output/hoalac_places_24.geojson")

# Export Supabase UUID SQL
sql_file = 'output/import_24_places_supabase.sql'
with open(sql_file, 'w', encoding='utf-8') as f:
    f.write("-- ====================================================================\n")
    f.write("-- IMPORT 24 ĐỊA ĐIỂM CHUẨN TỌA ĐỘ GOOGLE MAPS (QL21 & TRONG XÓM THÔN 4, 5)\n")
    f.write("-- ====================================================================\n\n")
    
    cat_mapping = {
        'food_drink': "(SELECT id FROM categories WHERE name ILIKE '%ẩm thực%' OR name ILIKE '%food%' LIMIT 1)",
        'grocery': "(SELECT id FROM categories WHERE name ILIKE '%siêu thị%' OR name ILIKE '%tạp hóa%' OR name ILIKE '%grocery%' LIMIT 1)",
        'pharmacy': "(SELECT id FROM categories WHERE name ILIKE '%y tế%' OR name ILIKE '%thuốc%' OR name ILIKE '%pharmacy%' LIMIT 1)",
        'services': "(SELECT id FROM categories WHERE name ILIKE '%dịch vụ%' OR name ILIKE '%service%' LIMIT 1)",
        'entertainment': "(SELECT id FROM categories WHERE name ILIKE '%giải trí%' OR name ILIKE '%entertainment%' LIMIT 1)",
        'boarding_house': "(SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1)",
        'campus': "(SELECT id FROM categories WHERE name ILIKE '%trường%' OR name ILIKE '%bus%' OR name ILIKE '%campus%' LIMIT 1)"
    }
    
    for p in places:
        cat_sql = cat_mapping.get(p['category'], "(SELECT id FROM categories LIMIT 1)")
        f.write("INSERT INTO places (\n")
        f.write("    id, category_id, contribution_id, name, area, address,\n")
        f.write("    latitude, longitude, min_price, max_price, rent_price, electricity_price,\n")
        f.write("    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy\n")
        f.write(") VALUES (\n")
        f.write("    gen_random_uuid(),\n")
        f.write(f"    {cat_sql},\n")
        f.write("    (SELECT contribution_id FROM places LIMIT 1),\n")
        f.write(f"    '{p['name']}',\n")
        f.write(f"    '{p['area']}',\n")
        f.write(f"    '{p['address']}',\n")
        f.write(f"    {p['lat']},\n")
        f.write(f"    {p['lng']},\n")
        f.write(f"    {p['min_price']},\n")
        f.write(f"    {p['max_price']},\n")
        rent_val = p['min_price'] if p['category'] == 'boarding_house' else "NULL"
        f.write(f"    {rent_val},\n")
        f.write("    3500,\n")
        f.write(f"    '{p['opening_hours']}',\n")
        f.write(f"    '{p['phone']}',\n")
        tags_array = "ARRAY[" + ", ".join([f"'{t}'" for t in p['tags']]) + "]"
        f.write(f"    {tags_array},\n")
        f.write("    NOW(), NOW(), 5.0\n")
        f.write(");\n\n")

print(f"Exported SQL: {sql_file}")
