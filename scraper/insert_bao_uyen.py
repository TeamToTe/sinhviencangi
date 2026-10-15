import sqlite3
import json
from datetime import datetime

conn = sqlite3.connect('backend/data/connecthub.sqlite')
cur = conn.cursor()

# Check if Bao Uyen exists
cur.execute("SELECT id, name FROM places WHERE name LIKE '%Bảo Uyên%';")
existing = cur.fetchall()

now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
amenities_json = json.dumps(["Cơm tấm sườn bì", "Ăn trưa", "Canh free", "Trục ĐT420"], ensure_ascii=False)
images_json = json.dumps(["https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80"], ensure_ascii=False)

if not existing:
    cur.execute("SELECT MAX(id) FROM places;")
    new_id = (cur.fetchone()[0] or 0) + 1
    query = """
    INSERT INTO places (
        id, category_id, contribution_id, name, area, address,
        latitude, longitude, min_price, max_price, rent_price,
        electricity_price, water_price, room_status, opening_hours,
        phone, amenities, images, created_at, updated_at, gps_accuracy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """
    params = (
        new_id,
        2, # food_drink
        1,
        'Cơm Tấm Bảo Uyên',
        'Bình Yên / Phú Hữu',
        'Trục ĐT420 gần Nhà Thờ Phú Hữu, Tân Xã, Thạch Thất',
        21.0258,
        105.5520,
        35000,
        50000,
        None, None, None,
        'open',
        '09:30 - 20:30',
        '0915667788',
        amenities_json,
        images_json,
        now_str, now_str,
        5.0
    )
    cur.execute(query, params)
    conn.commit()
    print(f"✅ Đã INSERT Cơm Tấm Bảo Uyên vào SQLite DB với ID: {new_id}")
else:
    print(f"ℹ️ Đã tồn tại Cơm Tấm Bảo Uyên với ID: {existing[0][0]}")

cur.execute("SELECT id, name, area, address, latitude, longitude, phone FROM places WHERE name LIKE '%Bảo Uyên%';")
row = cur.fetchone()
print(f"Thông tin trong DB: ID={row[0]} | Tên={row[1]} | GPS=({row[4]}, {row[5]}) | ĐT={row[6]}")
conn.close()
