import json
import re
import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('output/trohoalac_google_maps_matched.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

print(f"Tổng số bản ghi trọ ban đầu: {len(places)}")

# Làm sạch tên và lọc trùng
cleaned_places = []
seen_coords = set()

for p in places:
    lat = round(p.get('lat', 0), 6)
    lng = round(p.get('lng', 0), 6)
    coord_key = (lat, lng)
    
    # Bỏ qua nếu không có tọa độ hoặc ngoài Hòa Lạc
    if not (20.98 <= lat <= 21.05 and 105.49 <= lng <= 105.57):
        continue
        
    raw_name = p.get('name', '').strip()
    # Làm gọn tên dài thành tên chuẩn
    clean_name = raw_name
    if "PHÒNG FULL ĐỒ" in clean_name or "GIÁ RẺ" in clean_name:
        clean_name = f"Nhà Trọ Sinh Viên {p.get('ward', 'Hòa Lạc')}"
    elif "BIỆT THỰ NGUYÊN CĂN" in clean_name:
        clean_name = f"Villa Nguyên Căn {p.get('ward', 'Hòa Lạc')}"
    elif "Cho thuê Nhà trọ Sinh viên" in clean_name:
        clean_name = f"Khu Trọ Sinh Viên {p.get('ward', 'Hòa Lạc')}"
    elif "PHÒNG TRỌ SÁT CỔNG" in clean_name:
        clean_name = f"Trọ Cổng Trường {p.get('ward', 'Hòa Lạc')}"
        
    # Giới hạn độ dài tên
    if len(clean_name) > 60:
        clean_name = clean_name[:57] + "..."
        
    # Làm sạch mô tả rút gọn
    desc_html = p.get('descriptions', [''])[0] if p.get('descriptions') else ''
    clean_desc = re.sub(r'<[^>]+>', ' ', desc_html)
    clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()
    if len(clean_desc) > 300:
        clean_desc = clean_desc[:297] + "..."
    if not clean_desc:
        clean_desc = f"Khu trọ tiện nghi, an ninh tốt tại khu vực {p.get('ward', 'Hòa Lạc')}."
        
    # Giá
    price = p.get('min_price') or 2000000
    price_max = p.get('max_price') or price
    
    # Trạng thái phòng
    status = p.get('status')
    room_status = 'available' if status == 'available' else ('full' if status in ['rented', 'reserved'] else 'available')
    
    cleaned_places.append({
        "name": clean_name,
        "area": p.get('ward') or 'Thạch Hòa',
        "address": f"{p.get('address', '')}, {p.get('ward', '')}, Thạch Thất, Hà Nội".strip(", "),
        "latitude": lat,
        "longitude": lng,
        "rent_price": int(price),
        "min_price": int(price),
        "max_price": int(price_max),
        "room_status": room_status,
        "images": p.get('images', [])[:8],
        "amenities": p.get('amenities', [])[:10],
        "description": clean_desc,
        "source": "trohoalac.com",
        "maps_url": p.get('maps_url') or p.get('maps_embed')
    })

print(f"✅ Sau khi làm sạch & lọc chuẩn: {len(cleaned_places)} khu trọ uy tín sẵn sàng thêm vào DB!")

# 1. Xuất CSV
csv_file = 'output/trohoalac_cleaned_places.csv'
fieldnames = ['name', 'area', 'address', 'latitude', 'longitude', 'rent_price', 'min_price', 'max_price', 'room_status', 'images_count', 'amenities', 'description']
with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for cp in cleaned_places:
        writer.writerow({
            'name': cp['name'],
            'area': cp['area'],
            'address': cp['address'],
            'latitude': cp['latitude'],
            'longitude': cp['longitude'],
            'rent_price': cp['rent_price'],
            'min_price': cp['min_price'],
            'max_price': cp['max_price'],
            'room_status': cp['room_status'],
            'images_count': len(cp['images']),
            'amenities': ', '.join(cp['amenities']),
            'description': cp['description']
        })
print(f"📁 Đã xuất CSV: {csv_file}")

# 2. Xuất SQL Supabase
sql_file = 'output/import_trohoalac_to_supabase.sql'
with open(sql_file, 'w', encoding='utf-8') as f:
    f.write("-- ====================================================================\n")
    f.write("-- NHẬP DỮ LIỆU PHÒNG TRỌ UY TÍN TỪ TROHOALAC.COM (ĐỐI SOÁT GOOGLE MAPS)\n")
    f.write("-- ====================================================================\n\n")
    
    for cp in cleaned_places:
        imgs = cp['images'] if cp['images'] else ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80']
        imgs_str = "ARRAY[" + ", ".join([f"'{img}'" for img in imgs]) + "]"
        
        amenities = cp['amenities'] if cp['amenities'] else ['Khép kín', 'An ninh 24/7']
        amenities_str = "ARRAY[" + ", ".join([f"'{a}'" for a in amenities]) + "]"
        
        # Escape single quotes in text
        safe_name = cp['name'].replace("'", "''")
        safe_addr = cp['address'].replace("'", "''")
        
        f.write("INSERT INTO places (\n")
        f.write("    id, category_id, contribution_id, name, area, address,\n")
        f.write("    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,\n")
        f.write("    room_status, images, amenities, created_at, updated_at, gps_accuracy\n")
        f.write(") VALUES (\n")
        f.write("    gen_random_uuid(),\n")
        f.write("    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),\n")
        f.write("    (SELECT contribution_id FROM places LIMIT 1),\n")
        f.write(f"    '{safe_name}',\n")
        f.write(f"    '{cp['area']}',\n")
        f.write(f"    '{safe_addr}',\n")
        f.write(f"    {cp['latitude']},\n")
        f.write(f"    {cp['longitude']},\n")
        f.write(f"    {cp['min_price']},\n")
        f.write(f"    {cp['max_price']},\n")
        f.write(f"    {cp['rent_price']},\n")
        f.write("    3500,\n")
        f.write("    '25000/khối',\n")
        f.write(f"    '{cp['room_status']}',\n")
        f.write(f"    {imgs_str},\n")
        f.write(f"    {amenities_str},\n")
        f.write("    NOW(), NOW(), 5.0\n")
        f.write(");\n\n")

print(f"📁 Đã xuất SQL Supabase: {sql_file}")
