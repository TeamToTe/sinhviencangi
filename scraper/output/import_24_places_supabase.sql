-- ====================================================================
-- IMPORT 24 ĐỊA ĐIỂM CHUẨN GOOGLE MAPS POI (KHU VỰC KHOANH ĐỎ)
-- ====================================================================

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%ẩm thực%' OR name ILIKE '%food%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà Hàng 379 Minh Nga 1',
    'Thạch Hòa',
    'Km14 Quốc Lộ 21A, Thôn 4, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0207583,
    105.52018,
    120000,
    250000,
    NULL,
    3500,
    '09:00 - 22:30',
    '0984421379',
    ARRAY['Lẩu cua đồng', 'Gà ri', 'Mặt đường QL21', 'Tiếp khách CLB'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%ẩm thực%' OR name ILIKE '%food%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Ẩm Thực Thái Linh - Gà Cá',
    'Thạch Hòa',
    'QL21A (Đoạn ven hồ Thôn 4), Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0231961,
    105.5206533,
    100000,
    200000,
    NULL,
    3500,
    '09:30 - 22:30',
    '0978665544',
    ARRAY['Gà đồi', 'Cá sông', 'View hồ', 'Trục QL21'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%ẩm thực%' OR name ILIKE '%food%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Cửa Hàng Bún Bẩy Cường',
    'Thạch Hòa',
    'Đường QL21 gần Chợ Hòa Lạc, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0292651,
    105.5176141,
    30000,
    45000,
    NULL,
    3500,
    '06:00 - 14:00',
    '0983112244',
    ARRAY['Bún bò Huế', 'Bún riêu', 'Ăn sáng', 'Gần Chợ Hòa Lạc'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%ẩm thực%' OR name ILIKE '%food%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Phở Bò Gia Truyền Ngã 3 Hòa Lạc',
    'Thạch Hòa',
    'Ngã 3 Hòa Lạc (Giao QL21 & ĐT420), Thạch Hòa, Thạch Thất, Hà Nội',
    21.0275,
    105.5186,
    35000,
    50000,
    NULL,
    3500,
    '05:30 - 21:00',
    '0912338899',
    ARRAY['Phở bò tái nạm', 'Ngã 3 Hòa Lạc', 'Ăn sáng', 'Giá bình dân'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%ẩm thực%' OR name ILIKE '%food%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Quán Ăn Vặt & Trà Chanh Thôn 5',
    'Thôn 5 Thạch Hòa',
    'Đường trục chính Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0251,
    105.5152,
    15000,
    40000,
    NULL,
    3500,
    '08:00 - 23:00',
    '0968997766',
    ARRAY['Ăn vặt', 'Trà chanh', 'Trong xóm Thôn 5', 'Tụ tập sinh viên'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%siêu thị%' OR name ILIKE '%tạp hóa%' OR name ILIKE '%grocery%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Chợ Hòa Lạc (Chợ Dân Sinh Trung Tâm)',
    'Thạch Hòa',
    'Ngã 3 Hòa Lạc, Đường QL21, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0270926,
    105.5187454,
    5000,
    200000,
    NULL,
    3500,
    '05:00 - 18:30',
    '',
    ARRAY['Chợ truyền thống', 'Thực phẩm tươi sống', 'Giá rẻ', 'Mặt đường QL21'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%siêu thị%' OR name ILIKE '%tạp hóa%' OR name ILIKE '%grocery%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Siêu Thị Mini & Tạp Hóa Mạnh Quân',
    'Thạch Hòa',
    'Mặt đường QL21 đối diện Chợ Hòa Lạc, Thạch Hòa, Thạch Thất',
    21.02735,
    105.5192,
    5000,
    300000,
    NULL,
    3500,
    '06:30 - 22:30',
    '02433688688',
    ARRAY['Siêu thị mini', 'Thanh toán QR', 'Đồ gia dụng', 'Mặt đường QL21'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%siêu thị%' OR name ILIKE '%tạp hóa%' OR name ILIKE '%grocery%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Đại Lý Tạp Hóa Bà Mùi Thôn 5',
    'Thôn 5 Thạch Hòa',
    'Cạnh Nhà Văn Hóa Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.02565,
    105.5156,
    5000,
    100000,
    NULL,
    3500,
    '06:00 - 22:00',
    '0987113355',
    ARRAY['Tạp hóa trong xóm', 'Đổi nước bình 20L', 'Thôn 5'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%y tế%' OR name ILIKE '%thuốc%' OR name ILIKE '%pharmacy%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Quầy thuốc Mỹ lệ 1',
    'Thạch Hòa',
    'QL21 (Cách Chợ Hòa Lạc 70m về phía Bắc), Thạch Hòa, Thạch Thất',
    21.0277222,
    105.5189989,
    5000,
    150000,
    NULL,
    3500,
    '06:30 - 22:00',
    '0906070409',
    ARRAY['Hiệu thuốc GPP', 'Mặt đường QL21', 'Cạnh Chợ Hòa Lạc', 'Tư vấn tận tâm'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%y tế%' OR name ILIKE '%thuốc%' OR name ILIKE '%pharmacy%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Phương Nam Pharmacy (QL21 Thôn 4)',
    'Thạch Hòa',
    'Mặt đường QL21, Thôn 4, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0226,
    105.5205,
    5000,
    200000,
    NULL,
    3500,
    '07:00 - 22:00',
    '0984123987',
    ARRAY['Nhà thuốc Thôn 4', 'Mặt đường QL21', 'Thuốc chính hãng'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%y tế%' OR name ILIKE '%thuốc%' OR name ILIKE '%pharmacy%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Quầy Thuốc Nga Cường',
    'Thôn 5 Thạch Hòa',
    'Phố Nam Sơn, Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.03125,
    105.5079125,
    5000,
    120000,
    NULL,
    3500,
    '07:00 - 21:30',
    '0912334455',
    ARRAY['Quầy thuốc trong xóm', 'Phố Nam Sơn', 'Thôn 5', 'Sơ cứu'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%dịch vụ%' OR name ILIKE '%service%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'HEAD Honda Cường Thành',
    'Thạch Hòa',
    'Đường QL21 (Cách Chợ Hòa Lạc 280m), Thạch Hòa, Thạch Thất',
    21.0299595,
    105.517671,
    20000,
    200000,
    NULL,
    3500,
    '07:30 - 18:30',
    '02433689999',
    ARRAY['HEAD Honda chính hãng', 'Mặt đường QL21', 'Thay nhớt', 'Sửa xe máy'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%dịch vụ%' OR name ILIKE '%service%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Kỳ Ngàn Building Hòa Lạc',
    'Thạch Hòa',
    'Đường ĐT420, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.027403,
    105.5246895,
    0,
    0,
    NULL,
    3500,
    '07:00 - 21:00',
    '02433998877',
    ARRAY['Tổ hợp văn phòng', 'Trục ĐT420', 'Mốc chỉ đường'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%dịch vụ%' OR name ILIKE '%service%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Tiệm Photocopy & In Ấn Đồ Án Thôn 4',
    'Thạch Hòa',
    'Mặt đường QL21, Thôn 4, Xã Thạch Hòa, Thạch Thất',
    21.0225,
    105.5208,
    500,
    100000,
    NULL,
    3500,
    '07:30 - 21:30',
    '0976112244',
    ARRAY['In ấn đồ án', 'Photocopy giá rẻ', 'Mặt đường QL21', 'Thôn 4'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%dịch vụ%' OR name ILIKE '%service%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Tiệm Sửa Xe Máy Chú Hùng Thôn 5',
    'Thôn 5 Thạch Hòa',
    'Ngã ba xóm trọ Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0248,
    105.515,
    15000,
    120000,
    NULL,
    3500,
    '07:00 - 20:00',
    '0984556677',
    ARRAY['Vá xe săm lốp 15k', 'Trong xóm Thôn 5', 'Thay dầu nhớt'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%dịch vụ%' OR name ILIKE '%service%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Henna Tattoo Thạch Hòa',
    'Thôn 5 Thạch Hòa',
    'Xóm 5, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.022348,
    105.512037,
    50000,
    300000,
    NULL,
    3500,
    '09:00 - 21:00',
    '0967332211',
    ARRAY['Henna Tattoo', 'Xỏ khuyên', 'Trong xóm Thôn 5', 'Nghệ thuật'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%dịch vụ%' OR name ILIKE '%service%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà Văn hoá thôn 5 - Hoà Lạc',
    'Thôn 5 Thạch Hòa',
    'Trung tâm Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0255094,
    105.5154171,
    0,
    0,
    NULL,
    3500,
    '07:00 - 21:00',
    '',
    ARRAY['Nhà văn hóa', 'Mốc chỉ đường', 'Sân sinh hoạt chung', 'Thôn 5'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%dịch vụ%' OR name ILIKE '%service%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà Văn Hoá Thôn 4 Hòa Lạc',
    'Thôn 4 Thạch Hòa',
    'Thôn 4 (Gần QL21), Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0222227,
    105.521736,
    0,
    0,
    NULL,
    3500,
    '07:00 - 21:00',
    '',
    ARRAY['Nhà văn hóa Thôn 4', 'Gần QL21', 'Mốc định vị'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%giải trí%' OR name ILIKE '%entertainment%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Sân Cầu Lông 368 Badminton',
    'Thạch Hòa',
    'Đường ĐT420, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0289077,
    105.5298308,
    50000,
    80000,
    NULL,
    3500,
    '05:30 - 23:00',
    '0989368368',
    ARRAY['Sân thảm tiêu chuẩn', 'Cầu lông', 'Trục ĐT420', 'Đèn chống chói'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%giải trí%' OR name ILIKE '%entertainment%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'King Club Bida Hòa Lạc (Trục QL21)',
    'Thạch Hòa',
    'Đường QL21, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0262,
    105.5191,
    40000,
    70000,
    NULL,
    3500,
    '08:00 - 02:00',
    '0982345678',
    ARRAY['Bida lỗ', 'Điều hòa máy lạnh', 'Mặt đường QL21', 'Mở muộn'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%giải trí%' OR name ILIKE '%entertainment%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'CyberNet Gaming Hòa Lạc (Thôn 4)',
    'Thạch Hòa',
    'Mặt đường QL21, Thôn 4, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0218,
    105.5204,
    8000,
    14000,
    NULL,
    3500,
    'Mở cửa 24/7',
    '0971239988',
    ARRAY['Cyber game 24/7', 'Dàn máy RTX', 'Mặt đường QL21', 'Cơm rang mì tôm'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà Trọ Trạng Nguyên Thôn 5',
    'Thôn 5 Thạch Hòa',
    'Xóm Trạng Nguyên, Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0235,
    105.5145,
    1400000,
    2000000,
    1400000,
    3500,
    '24/7',
    '0986554433',
    ARRAY['Nhà trọ sinh viên', 'Khóa vân tay', 'Trong xóm Thôn 5', 'Giá rẻ'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Khu Trọ Sinh Viên Xóm Xanh Thôn 5',
    'Thôn 5 Thạch Hòa',
    'Ngõ 2 Thôn 5, Xã Thạch Hòa, Thạch Thất, Hà Nội',
    21.0242,
    105.5138,
    1300000,
    1800000,
    1300000,
    3500,
    '24/7',
    '0975667788',
    ARRAY['Yên tĩnh học tập', 'Sân để xe rộng', 'Giá sinh viên', 'Thôn 5'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Chung Cư Mini Sinh Viên Thôn 4',
    'Thôn 4 Thạch Hòa',
    'Ngõ 1 Thôn 4 (Cách QL21 50m), Xã Thạch Hòa, Thạch Thất',
    21.0229,
    105.5215,
    2200000,
    2800000,
    2200000,
    3500,
    '24/7',
    '0918776655',
    ARRAY['CCMN thang máy', 'Full nội thất', 'Gần đường QL21', 'Thôn 4'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price,
    opening_hours, phone, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%trường%' OR name ILIKE '%bus%' OR name ILIKE '%campus%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Điểm Đón Xe Buýt Chợ Hòa Lạc (QL21)',
    'Thạch Hòa',
    'Trước cổng Chợ Hòa Lạc, Trục QL21, Thạch Hòa, Thạch Thất',
    21.027,
    105.5189,
    9000,
    9000,
    NULL,
    3500,
    '05:00 - 21:00',
    '',
    ARRAY['Tuyến buýt 71', 'Tuyến 74', 'Tuyến 88', 'Trước Chợ Hòa Lạc', 'Mặt đường QL21'],
    NOW(), NOW(), 5.0
);

