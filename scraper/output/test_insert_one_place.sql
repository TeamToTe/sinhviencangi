-- ====================================================================
-- CÂU LỆNH INSERT 1 ĐIỂM TEST CHUẨN SCHEMA UUID CHO SUPABASE CỦA BẠN
-- Copy toàn bộ đoạn này và Paste vào mục "SQL Editor" trên Supabase rồi bấm RUN
-- ====================================================================

INSERT INTO places (
    id,
    category_id,
    contribution_id,
    name,
    area,
    address,
    latitude,
    longitude,
    min_price,
    max_price,
    rent_price,
    electricity_price
)
VALUES (
    gen_random_uuid(),
    -- Tự động lấy UUID category ăn uống sẵn có trong DB Supabase của bạn
    COALESCE(
        (SELECT id FROM categories WHERE name ILIKE '%food%' OR name ILIKE '%ăn%' LIMIT 1),
        (SELECT category_id FROM places WHERE name ILIKE '%matcha%' OR name ILIKE '%phở%' LIMIT 1)
    ),
    -- Lấy UUID contribution sẵn có trong bảng
    (SELECT contribution_id FROM places LIMIT 1),
    'Cơm Tấm Bảo Uyên',
    'Thạch Hòa',
    'Số 62 Thôn Phú Hữu, ĐT420, Thạch Thất, Hà Nội',
    21.0270298,
    105.5337274,
    35000,
    50000,
    0,
    3500
);

-- Kiểm tra lại ngay sau khi Insert:
SELECT id, name, area, latitude, longitude, min_price, max_price 
FROM places 
WHERE name = 'Cơm Tấm Bảo Uyên';
