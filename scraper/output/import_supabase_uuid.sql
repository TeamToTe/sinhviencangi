-- ====================================================================
-- TỔNG HỢP CÁC ĐỊA ĐIỂM CHUẨN SCHEMA UUID CHO SUPABASE (DỰ ÁN CONNECTHUB)
-- ====================================================================

-- 1. Ăn uống & Cafe
INSERT INTO places (id, category_id, contribution_id, name, area, address, latitude, longitude, min_price, max_price, rent_price, electricity_price)
VALUES (
    gen_random_uuid(),
    (SELECT category_id FROM places WHERE name ILIKE '%matcha%' OR name ILIKE '%phở%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Cơm Tấm Bảo Uyên', 'Thạch Hòa', 'Trục ĐT420, Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội',
    21.0270298, 105.5337274, 35000, 50000, 0, 3500
);

INSERT INTO places (id, category_id, contribution_id, name, area, address, latitude, longitude, min_price, max_price, rent_price, electricity_price)
VALUES (
    gen_random_uuid(),
    (SELECT category_id FROM places WHERE name ILIKE '%matcha%' OR name ILIKE '%phở%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Ẩm Thực Thái Linh - Gà Cá', 'Thạch Hòa', 'Thôn 4, Xã Thạch Hòa, Thạch Thất (Trục QL21)',
    21.018000, 105.521500, 100000, 180000, 0, 3500
);

INSERT INTO places (id, category_id, contribution_id, name, area, address, latitude, longitude, min_price, max_price, rent_price, electricity_price)
VALUES (
    gen_random_uuid(),
    (SELECT category_id FROM places WHERE name ILIKE '%matcha%' OR name ILIKE '%phở%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Layla Cafe Retro Tân Xã', 'Tân Xã', 'Ngã tư Tân Xã, Đường ĐT419, Thạch Thất',
    21.017500, 105.531500, 25000, 45000, 0, 3500
);

INSERT INTO places (id, category_id, contribution_id, name, area, address, latitude, longitude, min_price, max_price, rent_price, electricity_price)
VALUES (
    gen_random_uuid(),
    (SELECT category_id FROM places WHERE name ILIKE '%matcha%' OR name ILIKE '%phở%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'The Study Station Cafe 24/7', 'Thạch Hòa', 'Khu TĐC Bắc Phú Cát, Thạch Hòa, Thạch Thất',
    21.015200, 105.518500, 30000, 50000, 0, 3500
);

-- 2. Hiệu thuốc & Y tế
INSERT INTO places (id, category_id, contribution_id, name, area, address, latitude, longitude, min_price, max_price, rent_price, electricity_price)
VALUES (
    gen_random_uuid(),
    (SELECT category_id FROM places WHERE name ILIKE '%thuốc%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Quầy Thuốc Nga Cường', 'Thạch Hòa', 'Phố Nam Sơn, Xã Thạch Hòa, Thạch Thất',
    21.031000, 105.501000, 10000, 150000, 0, 3500
);

-- 3. Dịch vụ & Sửa xe
INSERT INTO places (id, category_id, contribution_id, name, area, address, latitude, longitude, min_price, max_price, rent_price, electricity_price)
VALUES (
    gen_random_uuid(),
    (SELECT category_id FROM places WHERE name ILIKE '%photo%' OR name ILIKE '%cầu lông%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'HEAD Honda Cường Thành', 'Thạch Hòa', 'Đường QL21 gần Chợ Hòa Lạc, Thạch Hòa',
    21.028500, 105.518000, 20000, 150000, 0, 3500
);

-- 4. Thể thao & Giải trí
INSERT INTO places (id, category_id, contribution_id, name, area, address, latitude, longitude, min_price, max_price, rent_price, electricity_price)
VALUES (
    gen_random_uuid(),
    (SELECT category_id FROM places WHERE name ILIKE '%cầu lông%' OR name ILIKE '%billiard%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Sân Cầu Lông 368 Badminton', 'Thạch Hòa', 'Đường ĐT420, Xã Thạch Hòa, Thạch Thất',
    21.026800, 105.539000, 50000, 80000, 0, 3500
);
