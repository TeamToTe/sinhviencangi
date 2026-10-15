import psycopg2

conn = psycopg2.connect(
    host='aws-0-ap-northeast-2.pooler.supabase.com',
    port=6543,
    dbname='postgres',
    user='postgres.fjavwjypitffzrfkfsmq',
    password='vi6pQ5q7*qs!%mB',
    connect_timeout=15
)
cur = conn.cursor()

# Check if Bao Uyen already exists
cur.execute("SELECT id, name FROM places WHERE name LIKE '%Bảo Uyên%';")
rows = cur.fetchall()
if rows:
    print("Record already exists in Supabase:")
    for r in rows:
        print(" ", r)
else:
    insert_sql = """
    INSERT INTO places (
        id, category_id, contribution_id, name, area, address,
        latitude, longitude, min_price, max_price, rent_price,
        electricity_price, water_price, room_status, opening_hours,
        phone, amenities, images, created_at, updated_at, gps_accuracy
    ) VALUES (
        gen_random_uuid(),
        'eab8c4cf-de82-4300-bed0-3af65eb7e0a2',
        '920587ef-6daf-4c21-997c-c3f7f04e0d22',
        'Cơm Tấm Bảo Uyên',
        'Thạch Hòa',
        'Trục ĐT420 gần Nhà Thờ Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
        21.025800,
        105.552000,
        35000,
        50000,
        0,
        3500,
        '25000/khối',
        'available',
        '09:30 - 20:30',
        '0915667788',
        ARRAY['Cơm tấm sườn bì', 'Ăn trưa', 'Canh free', 'Trục ĐT420'],
        ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'],
        NOW(),
        NOW(),
        5.0
    ) RETURNING id, name, area, latitude, longitude, min_price, max_price;
    """
    cur.execute(insert_sql)
    conn.commit()
    inserted = cur.fetchone()
    print("🎉 INSERTED SUCCESSFULLY INTO SUPABASE!")
    print(f"  ID (UUID): {inserted[0]}")
    print(f"  Name: {inserted[1]}")
    print(f"  Area: {inserted[2]}")
    print(f"  GPS: ({inserted[3]}, {inserted[4]})")
    print(f"  Price: {inserted[5]} - {inserted[6]}")

cur.execute("SELECT COUNT(*) FROM places;")
print(f"📊 Total places now in Supabase: {cur.fetchone()[0]}")
conn.close()
