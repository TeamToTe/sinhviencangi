-- ====================================================================
-- NHẬP DỮ LIỆU PHÒNG TRỌ UY TÍN TỪ TROHOALAC.COM (ĐỐI SOÁT GOOGLE MAPS)
-- ====================================================================

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ An Bình',
    'Tân Xã',
    'Kim Bông, Tân Xã, Thạch Thất, Hà Nội',
    21.027617,
    105.544181,
    1900000,
    2100000,
    1900000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9e1stsikf6u-1785003492814.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lepx1zr1r6-1785003493688.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/eu45o41r8vc-1785003493676.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/zo41ygbw6ia-1785003493688.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0aob1k6ibfi-1785003493689.webp'],
    ARRAY['Phòng tắm', 'Giường nệm', 'Kệ bếp', 'Gác lửng', 'Máy giặt', 'Tủ lạnh', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Phòng đẹp giá tốt - NGAY MẶT ĐƯỜNG QL21',
    'Thạch Hoà',
    '342 thôn 3, Thạch Hoà, Thạch Thất, Hà Nội',
    21.010096,
    105.515661,
    1700000,
    2200000,
    1700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/4d7emtornmh-1782659051449.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rowbiiqy67h-1782659052142.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/h268b7y1g8p-1782659052139.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mv1hxiwtzo-1782659052160.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/q2e1xyjpwl8-1782659052175.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/m8c7l25cct-1782659052176.webp'],
    ARRAY['Tủ lạnh', 'Wifi', 'Vệ sinh trong', 'Tủ áo quần', 'Phòng tắm riêng', 'Phòng tắm', 'Giường nệm', 'Camera an ninh', 'Điều hòa', 'Ban công/sân thượng'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 2 - Phòng studio 2 giường đơn',
    'Tân Xã',
    '64 Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.02693,
    105.531277,
    2800000,
    2800000,
    2800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0m99cuqipa5-1779621407478.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xdflmzkmtt-1760719442444.JPG', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/99k7dlogbsq-1760719442444.JPG', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0vzxi7ro1ql-1760719442444.JPG', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xriyebgq1wc-1760719442444.JPG'],
    ARRAY['Phòng tắm', 'Giường nệm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Bình nóng lạnh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Minh Anh',
    'Tân Xã',
    'Cạnh nhà thờ Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.026519,
    105.540328,
    1500000,
    1500000,
    1500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/emxw9iocmcs-1780034737276.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/56pztmkgt4v-1780034738405.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/yzxhtbkf72g-1780034738391.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/fitqg98rc9o-1780034738455.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9rkmm3pmchi-1780034738452.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0pro54z6mlc-1780034738424.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/u51orjvbdz-1780034738425.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Camera an ninh', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'An''s House',
    'Tân Xã',
    'Kim Bông, Tân Xã, Thạch Thất, Hà Nội',
    21.029534,
    105.556366,
    2000000,
    2000000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/cwboro34cg-1761923976130.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/k29c9cmpfrh-1761923976732.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9q2pu767id9-1761923976754.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0crevved2thh-1761923976772.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/c1js8d1nfkh-1761923976753.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/n2efc643iw-1761923976754.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Studio ngay chợ Hoà Lạc',
    'Thạch Hoà',
    'Chợ Hoà Lạc, Thạch Hoà, Thạch Thất, Hà Nội',
    21.027051,
    105.509887,
    2800000,
    2800000,
    2800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/davwaskhu6h-1785596118819.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f7g862xtshi-1785596119511.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/546t8j2g86w-1785596119505.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/hv82cmsehyc-1785596119498.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/e0xva44se5a-1785596119489.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/v1ay2rmcd4-1785596119517.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/oghvroqjksj-1785596119524.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Ohio House 1',
    'Thạch Hoà',
    'Ngã 3 Hòa Lạc, Thạch Hoà, Thạch Thất, Hà Nội',
    21.027272,
    105.518178,
    2000000,
    2000000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/z8kc9t202br-1784270299430.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/syujfpeaqka-1784270200774.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lkmhlb38w4k-1784270200758.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xm1uj65y3f-1784270200793.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/x2i6064szt-1784270200787.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ugysrtqow1o-1784270200799.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pbxuyy3ifl-1784270200811.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ckakft4xhoe-1784270200780.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Điều hòa', 'Camera an ninh', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Bình nóng lạnh', 'Tủ áo quần'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'NGUYÊN CĂN 3 NGỦ 1 KHÁCH',
    'Tân Xã',
    'Nhà thờ Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.025394,
    105.532933,
    5500000,
    5500000,
    5500000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/2753qz6m99o-1777020555888.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/l8b1sg4aipc-1777020555889.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0cbgp63wwbvu-1777020555936.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Thu Thủy Apartment',
    'Tân Xã',
    'Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.02721,
    105.535161,
    2600000,
    2800000,
    2600000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/536cntq0z06-1783600622627.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f99j72619ii-1783600623948.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/47jfloqz69m-1783600623928.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jur5xbjodm-1783600623937.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/dzvk7oo8li7-1783600623948.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/u7vfp3z73ao-1783600623801.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 11',
    'Tân Xã',
    '6 Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.02694,
    105.52508,
    2700000,
    2800000,
    2700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/yr0aoyqxgq-1779684614518.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jerozwmvbd-1761919673083.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jf5v1vftbfs-1761919673081.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xk8jpusiur-1761919673069.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6vxq916bpb6-1761919673049.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/b8hgpjz6ye8-1761919673101.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ xinh ngay cây xăng 39',
    'Thạch Hoà',
    'Cây xăng 39, Thạch Hoà, Thạch Thất, Hà Nội',
    21.011727,
    105.517873,
    2900000,
    4700000,
    2900000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/j0sjququ7ib-1783004376934.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/zzq6kir6i7a-1783004377447.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/46s7z0eo22-1783004377431.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/agf835epp94-1783004377445.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1zgslfrptru-1783004377457.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ chị Tâm',
    'Tân Xã',
    'Cafe Nhà Chung, Tân Xã, Thạch Thất, Hà Nội',
    21.019148,
    105.549848,
    1000000,
    1600000,
    1000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/px7vkpebcrk-1782447103535.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/v248766pzc8-1782447104588.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wdnwtxr0gy-1782447104594.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/k59g11f6va-1782447104602.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Trang Nguyên',
    'Thạch Hoà',
    'Thôn 5, Thạch Hoà, Thạch Thất, Hà Nội',
    21.021723,
    105.520022,
    1600000,
    1600000,
    1600000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rdygoykec4p-1784197678515.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/eav9a0n7atb-1780471969278.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/eus4p4iawqg-1780471969278.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ahk6l88i76m-1780471969268.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/2llt62nj6up-1780471969277.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'C Home 6',
    'Hạ Bằng',
    'Hạ Bằng, Hạ Bằng, Thạch Thất, Hà Nội',
    21.029063,
    105.563807,
    1600000,
    1900000,
    1600000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6d9e91sefx-1788751006977.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tweiwv8vtnq-1788751007719.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/t7el23vh888-1788751007702.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rrbrocmab8-1788751007707.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/h0t5wkklha5-1788751007715.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/le9pdr48aqs-1788751007704.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/8mqxkfw931p-1788751007714.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wni1pzaaq4-1788751007714.webp'],
    ARRAY['Bãi để xe riêng', 'Bình nóng lạnh', 'Điều hòa', 'Camera an ninh', 'Kệ bếp', 'Tủ áo quần', 'Vệ sinh trong', 'Wifi'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Ohio House 384',
    'Thạch Hoà',
    'Chợ Hoà Lạc, Thạch Hoà, Thạch Thất, Hà Nội',
    21.026711,
    105.512604,
    2400000,
    2400000,
    2400000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tjm31jasmfm-1784692084479.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/gofxysdspd-1784692087627.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5ik2n4jrc1r-1784692087935.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ag5v33ayqdi-1784692087912.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/s846lgivwhq-1784692087547.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/l23loaa0d6j-1784692085748.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0knguv4r4fqa-1784692085669.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vp4739u89ac-1784692087510.webp'],
    ARRAY['Tủ lạnh', 'Máy giặt', 'Gác lửng', 'Điều hòa', 'Camera an ninh', 'Bãi để xe riêng', 'Bình nóng lạnh', 'Kệ bếp', 'Tủ áo quần', 'Wifi'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Tiến Tuân',
    'Thạch Hoà',
    '392 Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    21.016203,
    105.519369,
    1700000,
    1700000,
    1700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/envdbazvgy4-1761920082346.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/435f9dd39ui-1761920083105.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mnvn935o3nd-1761920083091.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xjrzpgp0m7-1761920083106.webp'],
    ARRAY['Điều hòa', 'Máy giặt', 'Phòng tắm riêng', 'Tủ lạnh', 'Wifi'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Ngọc Linh',
    'Thạch Hoà',
    'Cây xăng 39, Thạch Hoà, Thạch Thất, Hà Nội',
    21.011607,
    105.515872,
    2900000,
    4700000,
    2900000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/2jbr4i38qdj-1784649892404.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rnhlgvpzwwk-1784692721414.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mzxdu5j7zx-1784692721426.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/et1s6e5khmd-1784692721443.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/g90wedwbnzw-1784692721438.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/c53t5ndsbug-1784692721454.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/st86o405jmf-1784692721468.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rlgwftgr1yf-1784692721453.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'WhiteHouse',
    'Tân Xã',
    'Kim Bông, Tân Xã, Thạch Thất, Hà Nội',
    21.02576,
    105.550017,
    2800000,
    3200000,
    2800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qkbbyavh4i-1780024192993.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/4ud053mj56u-1780024193736.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/968ac5oisjj-1780024193725.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/64yfb9c9p1k-1780024193737.webp'],
    ARRAY['Bãi để xe riêng', 'Bình nóng lạnh', 'Ban công/sân thượng', 'Camera an ninh', 'Điều hòa', 'Kệ bếp', 'Giường nệm', 'Phòng tắm riêng', 'Thang máy', 'Tủ lạnh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Hola Gate',
    'Tân Xã',
    'Mục Uyên, Tân Xã, Thạch Thất, Hà Nội',
    21.016392,
    105.547886,
    3000000,
    3200000,
    3000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/the3v8wmre-1785852705958.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tcnyl1ncgmj-1785852706667.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/n2g0e2gdh2l-1785852706664.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rn0iswzpg8-1785852706680.webp'],
    ARRAY['Wifi', 'Gác lửng', 'Điều hòa', 'Camera an ninh', 'Bãi để xe riêng'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 12',
    'Tân Xã',
    '64 Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.024786,
    105.534218,
    2700000,
    2800000,
    2700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0voo8r5lok-1779684779916.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/canb4wgu5c-1763021304215.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f75bpzoifu-1763021304277.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qhwqgpyhk2-1763021304254.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/e1whsrrke29-1763021304263.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/dp7diuccd2b-1763021304154.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/oxzek7r2xme-1763021304134.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Minh Tuy',
    'Tân Xã',
    'NHÀ THỜ PHÚ HỮU, Tân Xã, Thạch Thất, Hà Nội',
    21.025394,
    105.532933,
    1300000,
    1600000,
    1300000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/8vfz5sai29p-1781580054681.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/s0rwjpj1cb-1781545955692.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/8k5rdnzgot3-1781545955684.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/yj5mo90qnpp-1781545955692.webp'],
    ARRAY['Kệ bếp', 'Wifi', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh', 'Điều hòa', 'Phòng tắm', 'Máy giặt'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Căn hộ siêu rộng tại thôn 2 Tân Xã',
    'Tân Xã',
    'Thôn 2, Tân Xã, Thạch Thất, Hà Nội',
    21.026519,
    105.547655,
    2800000,
    3000000,
    2800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/eye3hfqr8vt-1782390944262.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/hdghdhrp1cj-1782390945233.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jawqqb6cz8b-1782390945223.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6hlxzorwp7f-1782390945212.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/p1jhahkwki-1782390945211.webp'],
    ARRAY['Wifi', 'Vệ sinh trong', 'Tủ lạnh', 'Phòng tắm', 'Máy giặt', 'Kệ bếp', 'Giường nệm', 'Camera an ninh', 'Bình nóng lạnh', 'Ban công/sân thượng'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'V Village',
    'Tân Xã',
    'V Village, Tân Xã, Thạch Thất, Hà Nội',
    21.030823,
    105.554923,
    5500000,
    5500000,
    5500000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6e6uiv7ccnp-1785000305013.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nf56u3d58mp-1780630663290.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6w9q3vt2bgi-1780630663291.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0t7fknrwa8yh-1780630663277.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/8ljqd88ciws-1780630663262.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/p250p9imk8-1780630663276.webp'],
    ARRAY['Giường nệm', 'Tivi', 'Tủ lạnh', 'Sân vườn', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 3',
    'Tân Xã',
    'Tân Xã, Tân Xã, Thạch Thất, Hà Nội',
    21.023568,
    105.55205,
    2500000,
    2500000,
    2500000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1s3wt1ihx1n-1781115611450.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rqdw69fdafj-1778638505077.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ev2y9y3cqys-1778638505066.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5tgtiuj4mv9-1778638505077.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Mark Hostel',
    'Tân Xã',
    'Hạ Bằng, Tân Xã, Thạch Thất, Hà Nội',
    21.029188,
    105.557689,
    1800000,
    1800000,
    1800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nhe4jse73up-1779981686366.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/l7ug4u3ba1-1779981687040.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/k1jjmdiyafk-1779981687024.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/smnnf3a7m2b-1779981687054.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/shsf23duof-1779981687054.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5errg9ksuh5-1779981687039.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Đồi Sim Home',
    'Tân Xã',
    'Giãn dân Thôn 2, Hạ Bằng, Tân Xã, Thạch Thất, Hà Nội',
    21.024674,
    105.547189,
    1600000,
    1600000,
    1600000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ktsumd1ty6-1782709170137.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/4350mxaenb4-1782709170943.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/p5hw6r7xrn-1782709170928.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pxpdh2xl0oe-1782709170936.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Sân vườn', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'SV Home',
    'Bình Yên',
    'Siêu thị Đức Thành, Bình Yên, Thạch Thất, Hà Nội',
    21.035655,
    105.540803,
    2500000,
    2500000,
    2500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6htrr4t84hw-1783689166941.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/t8nm825w6je-1783689167735.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vr28e77ja0o-1783689167747.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vfd3he0v3um-1783689167729.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ft8vdt4piet-1783689167741.webp'],
    ARRAY['Phòng tắm', 'Giường nệm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Sân vườn', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Hoàng Anh Home',
    'Tân Xã',
    'Phu Huu, Tân Xã, Thạch Thất, Hà Nội',
    21.025394,
    105.532933,
    1600000,
    1800000,
    1600000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rooms/470e0c53-465e-4f62-890b-cbef97f5f652/banner_1783765944005.jpg', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rooms/470e0c53-465e-4f62-890b-cbef97f5f652/room_1783766022568.jpg', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rooms/470e0c53-465e-4f62-890b-cbef97f5f652/room_1783766030613.jpg', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rooms/470e0c53-465e-4f62-890b-cbef97f5f652/room_1783766036446.jpg'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Young House 4 - Gần NIC',
    'Tân Xã',
    '85 Mục Uyên, Tân Xã, Thạch Thất, Hà Nội',
    21.01741,
    105.548856,
    2000000,
    2300000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/p7urq5fajfg-1779621443606.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/81i3yuy04nw-1760456538440.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/8yddezmghq9-1760456542662.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/3e7ogsr21v-1760456543494.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/t1hk8ggc7bk-1760456543516.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/utdvbzmdhtd-1760456543573.webp'],
    ARRAY['Máy giặt', 'Phòng tắm riêng', 'Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 9',
    'Bình Yên',
    'D2 – Khu Tái định cư đường 420, Bình Yên, Thạch Thất, Hà Nội',
    21.025468,
    105.535714,
    2000000,
    2400000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/z402u2xb9e-1779684821513.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mscy1j9vxgm-1777005446132.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ppywpux64v-1777005446756.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/epjhw1sijt9-1777005446673.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/byz3sm4d9y5-1777005446704.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vl2zpu9fmdr-1777005446705.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/66vfbusicjg-1777005446705.webp'],
    ARRAY['Phòng tắm', 'Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Thang máy'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ You & Me',
    'Thạch Hoà',
    'Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    21.023912,
    105.521389,
    2300000,
    2700000,
    2300000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mzncwe9ehf-1776964751877.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/h4h04irx1ew-1776964752908.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xc6dt4ytcbq-1776964752930.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5y7i5qigcl5-1776964752931.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tbz0m72709-1776964752931.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/s0qupifhsu9-1776964752920.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/fzvrsw77c5v-1776964752941.webp'],
    ARRAY['Máy giặt', 'Phòng tắm riêng', 'Wifi', 'Điều hòa', 'Kệ bếp', 'Tủ lạnh', 'Thang máy', 'Bình nóng lạnh', 'Bãi để xe riêng', 'Ban công/sân thượng'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 12 - Phòng giường đôi',
    'Tân Xã',
    'Nhà thờ Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.025403,
    105.536557,
    2700000,
    2800000,
    2700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/146euj10wcrq-1784218872439.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0ibf2v9s7j5w-1784218873469.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/uf56htsnspn-1784218873480.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/e0zz3jcee9v-1784218873478.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Phòng trọ Phú Hữu sẵn tủ lạnh',
    'Tân Xã',
    'Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.025394,
    105.532933,
    2200000,
    2200000,
    2200000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/iaz2x6y9ap-1782302310506.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/adroim6mn6j-1782302311543.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mknl1vqkp1m-1782302311554.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9yjlphg05fr-1782302311566.webp'],
    ARRAY['Vệ sinh trong', 'Tủ áo quần', 'Tủ lạnh', 'Phòng tắm', 'Máy giặt', 'Camera an ninh', 'Bình nóng lạnh', 'Ban công/sân thượng', 'Bãi để xe riêng', 'Wifi'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ sẵn tủ lạnh tại Tân Xã',
    'Tân Xã',
    'Tân Xã, Tân Xã, Thạch Thất, Hà Nội',
    21.021628,
    105.550922,
    1500000,
    1500000,
    1500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/689k1a0mit9-1780471766843.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/dm84jc9ml7-1780471768515.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pzsxmca0oyr-1780471768502.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/zb9lflfah6r-1780471768534.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mk0ok0htdl-1780471768555.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/re38q0r0b4e-1780471768574.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/uonp9hhm7cj-1780471768584.webp'],
    ARRAY['Camera an ninh', 'Bãi để xe riêng', 'Bình nóng lạnh', 'Điều hòa', 'Kệ bếp', 'Máy giặt', 'Phòng tắm', 'Sân vườn', 'Vệ sinh trong', 'Wifi'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'SIÊU PHẨM 1N1K CHỈ 2TR7 – TÁI ĐỊNH CƯ BÌNH YÊN',
    'Bình Yên',
    'Khu Tái Định Cư Bình Yên, Bình Yên, Thạch Thất, Hà Nội',
    21.030181,
    105.538466,
    2700000,
    2700000,
    2700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ascvso4evgn-1782302099572.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9i6q9bkx3iw-1782302100967.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/y5dggjkhudm-1782302100956.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ps9ds7pi619-1782302101001.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/h1l2ryx4l4v-1782302100979.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ei0p7vq6mir-1782302100982.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wkyzet34gxe-1782302100980.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/3ryyx9e69sd-1782302101021.webp'],
    ARRAY['Tủ lạnh', 'Thang máy', 'Vệ sinh trong', 'Wifi', 'Tủ áo quần', 'Phòng tắm riêng', 'Phòng tắm', 'Giường nệm', 'Máy giặt', 'Kệ bếp'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'T&H',
    'Tân Xã',
    'THC Luxury, Tân Xã, Thạch Thất, Hà Nội',
    21.02809,
    105.532901,
    2400000,
    2400000,
    2400000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vwrelaemj9f-1780470794262.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/dsqp66kvbsi-1780470795394.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/n7gaq0c5ar-1780470795415.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/apm3ww4syu-1780470795434.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/u5aj5t279tg-1780470795448.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/8mmtg8vtgm6-1780470795426.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/a8ba4pi6imi-1780470795433.webp'],
    ARRAY['Phòng tắm', 'Giường nệm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Hải Đăng',
    'Phú Hữu',
    'Gần Sân Bóng Phú Hữu, Phú Hữu, Thạch Thất, Hà Nội',
    21.027225,
    105.5355,
    1600000,
    1800000,
    1600000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/hh75kmwhhxh-1784541878739.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/fc2wdk296zn-1784541879398.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/15v0tz2clmh-1784541879433.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7i6o0xqc1sq-1784541879422.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ktzaokxhl4-1784541879413.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/t6751bcj1kp-1784541879391.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wgkjqfze8hf-1784541879406.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ccq47sdyb36-1784541879427.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 8',
    'Tân Xã',
    '41 Mục Uyên 1, Tân Xã, Thạch Thất, Hà Nội',
    21.02003,
    105.555408,
    2300000,
    2500000,
    2300000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/emdg8nn029-1779924171955.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/of8yk31jb4n-1779924173014.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lcmv4axosc8-1779924173067.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ag33by9msu8-1779924173031.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'FHome - URHome',
    'Tân Xã',
    'Kim Bông, Tân Xã, Thạch Thất, Hà Nội',
    21.028711,
    105.547817,
    2000000,
    2400000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/sl5qyej1xkf-1782819025630.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/gpyrj58yenn-1782819026355.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/yq46sz76pyi-1782819026363.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/4ba4ea2zaru-1782819026348.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/h62v4hgrg4r-1782819026387.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9ucs0kruoqu-1782819026370.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1s6wvzg248q-1782819026400.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6p7ee59w0c6-1782819026393.webp'],
    ARRAY['Phòng tắm', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ gần Uỷ ban Tân Xã',
    'Tân Xã',
    'Uỷ ban Tân Xã, Tân Xã, Thạch Thất, Hà Nội',
    21.020817,
    105.550622,
    1800000,
    1800000,
    1800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/iu3sjzglaf-1780371201783.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/dl93osy7y4g-1780371203001.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'THÔN 3 HOÀ LẠC – BẾP TÁCH BIỆT – GIÁ HỌC SINH SINH VIÊN!',
    'Thạch Hòa',
    'Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội',
    21.010358,
    105.515653,
    2000000,
    2200000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/twrrxlludpe-1783433155667.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6e54p9sath7-1783433156244.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1o1jwkvoq8l-1783433156253.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lryue67mjfq-1783433156262.webp'],
    ARRAY['Wifi', 'Vệ sinh trong', 'Tủ lạnh', 'Thang máy', 'Tủ áo quần', 'Phòng tắm riêng', 'Phòng tắm', 'Giường nệm', 'Kệ bếp', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Phúc Hiếu',
    'Thạch Hoà',
    'thôn 5, Thạch Hoà, Thạch Thất, Hà Nội',
    21.025682,
    105.516113,
    2100000,
    2200000,
    2100000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/fbxa66ea0qw-1780642736656.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5r06tp35a7a-1780642737514.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/e3dbnlf0qf6-1780642737539.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/26gwba5w94s-1780642737564.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/48o1mc0r53p-1780642737567.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/uajt2nbb9n-1780642737482.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ij9tq1riacm-1780642737546.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nfurjla36mn-1780642737526.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Young House 1',
    'Tân Xã',
    '64 Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.026691,
    105.549125,
    2500000,
    2600000,
    2500000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9fg0dnxv3fh-1779621360263.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0zz6rvukw97-1760455481438.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/58b53mzk5ty-1760455481436.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qtdzsag6d5-1760455481216.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/t4ios9a5ycg-1760455481434.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ihyw7uoo5dj-1760455476329.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/v6zzaniizg-1760455481382.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'White Home',
    'Tân Xã',
    'Sân bóng Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.026989,
    105.53478,
    1800000,
    2000000,
    1800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/un8apuaintj-1785853003902.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/oeg30jb7hbb-1785853004991.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nb009h5iv6-1785853004899.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/4em6x89z4dd-1785853004976.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/adgsq4nwhed-1785853005005.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/e7du3ruuca-1785853004990.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/c732cfnx0tq-1785853004972.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Đức Nguyên',
    'Thạch Hoà',
    '234 Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    21.022228,
    105.519161,
    1500000,
    1500000,
    1500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vrcnndel15-1780473303937.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xqsuyx1m7fi-1780473306225.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/irpe1gawb9m-1780473306212.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jovt1vd37ee-1780473306235.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/q1fe6et33l-1780473306233.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xszyfo9jz8f-1780473306266.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/p1wipsfu52-1780473306234.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Gác lửng', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Phú Hữu sẵn tủ lạnh',
    'Tân Xã',
    'Nhà thờ Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.025514,
    105.536883,
    1500000,
    1500000,
    1500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/3i7dedoe9qg-1780470104308.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1cnv6d914ll-1780470105783.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/w233zbhkpv-1780470105750.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qd6que72tbg-1780470105857.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wvpdt30726o-1780470105808.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7286td0jw9k-1780470105796.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0l1578grjqh-1780470105832.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/x10nldu36g-1780470105859.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 7',
    'Tân Xã',
    'Đối diện THPT Hai Bà Trưng, Tân Xã, Thạch Thất, Hà Nội',
    21.020479,
    105.551395,
    2000000,
    2500000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/96tzmncemki-1783819515295.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/3q10o5i5t2w-1783819518038.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/oy1185uz42b-1783819518030.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/oa7r08195u-1783819518050.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f7jz1ujlhy-1783819518051.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wkmt8ayyq0m-1783819518061.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ya9255im5qd-1783819518061.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 2',
    'Tân Xã',
    '64 Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.026925,
    105.533852,
    2600000,
    4500000,
    2600000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0ri0rxn3iey-1779890653714.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/b5hu0qvm9on-1779890654622.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/knu1mmtdjln-1779890654623.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/s8yhcx0or5-1779684558173.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qmqics89el-1760721772316.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/w3xiiyyym5-1760721772358.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/01cj349tyd9n-1760721772318.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5u5nlk38pb3-1760721772289.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 10',
    'Bình Yên',
    'Nhà văn hóa thôn Thái Bình, Bình Yên, Thạch Thất, Hà Nội',
    21.028974,
    105.534092,
    1700000,
    1700000,
    1700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/4dr1oafsl3f-1779924407199.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qw1bdkljqgd-1779924408491.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/201oqnzus7i-1779924408494.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/o1qaxmytrtn-1779924408492.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1ez1320px4g-1779924408488.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/b1mfds3x7vr-1779924408473.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7nxg0jvr9q-1779924408489.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ xinh đối diện cổng phụ FPT',
    'Thạch Hoà',
    'Thôn 3, Thạch Hoà, Thạch Thất, Hà Nội',
    21.015006,
    105.519605,
    2200000,
    2200000,
    2200000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/a78a3s7ugfe-1782958124132.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/kd1nejum7e-1782958124929.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/2m8aql0wotp-1782958124934.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mw1eh43n3fs-1782958124934.webp'],
    ARRAY['Giường nệm', 'Kệ bếp', 'Gác lửng', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Phú Hữu - Ngay sân bóng',
    'Phú Hữu',
    'Sân bóng Phú Hữu, Phú Hữu, Thạch Thất, Hà Nội',
    21.026943,
    105.534991,
    2000000,
    2000000,
    2000000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/q3ru57s2hem-1783433394546.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0e9kvmhh1i7t-1783433395467.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jojgd1tkyzm-1783433395455.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/fizcjmuw2xj-1783433395463.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Mia''s House',
    'Tân Xã',
    'Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.027689,
    105.535529,
    2200000,
    2200000,
    2200000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/t5unppdv7f-1761922586465.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/krxa7isn9o-1761922587552.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/kdf5ewwzca-1761922587560.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/r8nv8s7ajr-1761922587542.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wtrhghyssx-1761922587528.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'NHÀ TRỌ SV TẠI HOÀ LẠC. GIÁ 1tr900, VSKK. GẦN ĐH FPT, ĐHQ...',
    'Thạch Hoà',
    'Quốc lộ 21, thôn 3, Thạch Hoà, Thạch Thất, Hà Nội',
    21.014857,
    105.516656,
    1800000,
    1900000,
    1800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jsj4xfplpeg-1784701112716.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/92bvlwlmmtw-1784701113628.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lbpnj6gd6w8-1784701113606.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/awptiftvwu-1784701113669.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/8w3b19w33pa-1784701113659.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lasb89hfx5-1784701113658.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f040h9qaw9e-1784701113531.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lmhauqfebfd-1784701113658.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Phương Nam Apartment',
    'Thạch Hoà',
    'Thôn 3, Thạch Hoà, Thạch Thất, Hà Nội',
    21.010555,
    105.515735,
    3500000,
    3500000,
    3500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0fa7ga26irpn-1780028332701.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/n6wuwzjeezj-1780028333864.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nifxy2hyzgk-1780028333887.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/r1he70r6i2-1780028333886.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1mc1sj0sgst-1780028333890.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pngeo93la1-1780028333872.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/bgqf6x0afqg-1780028333871.webp'],
    ARRAY['Camera an ninh', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Bình nóng lạnh', 'Điều hòa', 'Kệ bếp', 'Giường nệm', 'Phòng tắm', 'Phòng tắm riêng', 'Máy giặt'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Long Thanh House',
    'Thạch Hoà',
    'Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    21.025789,
    105.521824,
    1600000,
    2300000,
    1600000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vr1rjfymud-1781494342480.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qx1celr8zd-1781494343145.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/80n51mc3rhh-1781494343151.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vsma6x3g0wf-1781494430986.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ovv0y6464e-1781494430979.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/swynmvol92n-1781494431003.webp'],
    ARRAY['Phòng tắm', 'Giường nệm', 'Kệ bếp', 'Gác lửng', 'Máy giặt', 'Tủ lạnh', 'Sân vườn', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Mới tại Phú Hữu full đồ',
    'Tân Xã',
    'Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.025535,
    105.535301,
    2500000,
    2700000,
    2500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/a8z5no0v7vb-1783688858389.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/szu4he1qsu-1783688859169.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ks5xmpa2nsn-1783688859183.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/sobms8733v-1783688859194.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/v3s0398vrej-1783688859195.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/og6olbyzty-1783688859223.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6oqyhncn7bd-1783688859194.webp'],
    ARRAY['Tủ lạnh', 'Vệ sinh trong', 'Wifi', 'Tủ áo quần', 'Thang máy', 'Phòng tắm riêng', 'Phòng tắm', 'Giường nệm', 'Gác lửng', 'Máy giặt'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Hồng Nhàn',
    'Tân Xã',
    'Thôn 2, Tân Xã, Thạch Thất, Hà Nội',
    21.026516,
    105.549464,
    1700000,
    1700000,
    1700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/80xjq1kvwf-1779891347012.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/u45ryeg2m4c-1779891347957.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/dqubpo3gybn-1779891347984.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5zaz8yqa7nu-1779891347968.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0yykopcet5i-1779891347956.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/h9isgy9xdzo-1779891347976.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/k52z82ahp9n-1779891347967.webp'],
    ARRAY['Bãi để xe riêng', 'Bình nóng lạnh', 'Camera an ninh', 'Điều hòa', 'Phòng tắm riêng', 'Tủ lạnh', 'Vệ sinh trong', 'Wifi'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'TH House',
    'Tân Xã',
    'Ngay gần sân bóng Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.028761,
    105.534666,
    2200000,
    3000000,
    2200000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9gcdsvgmji6-1781373074338.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/hjpn8lio8j6-1781373075214.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7dr1fbsicrq-1781373075148.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/omnxdgfjz28-1781373075139.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f9ykiow7ato-1781373075184.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qq0akagvf2k-1781373075169.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rh5532s1ivh-1781373075197.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/aazf0zzpluo-1781373075176.webp'],
    ARRAY['Vệ sinh trong', 'Wifi', 'Tủ lạnh', 'Tủ áo quần', 'Phòng tắm riêng', 'Phòng tắm', 'Giường nệm', 'Máy giặt', 'Kệ bếp', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Lương Ngân',
    'Thạch Hoà',
    'chợ Hoà Lạc, Thạch Hoà, Thạch Thất, Hà Nội',
    21.025046,
    105.508978,
    1100000,
    1200000,
    1100000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/cy8b1mbunjf-1784366515609.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ifxlj8pg04d-1784366517034.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/2eqfgxnl8kn-1784366517023.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/kr0sicw5az-1784366516688.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/fxawmcsdlb-1784366516753.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9iin1h4t4qp-1784366516755.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pmrvhjbj68s-1784366516755.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/alkwphnry0r-1784366516731.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Bảo Anh ( Phú Hữu )',
    'Tân Xã',
    'Số 95 Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.027134,
    105.535034,
    1700000,
    1700000,
    1700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/uh7ps3zmq7a-1780376480362.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7fa7ig8fgjh-1780375069529.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lxuf7nrufhe-1780375070010.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ezsbg77ftkh-1780375070042.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/h3gpiobphpl-1780375070059.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/aoiyktbzyu-1780376482746.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/2ro9w5w6yxk-1780376482588.webp'],
    ARRAY['Phòng tắm', 'Giường nệm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 5 - Phòng gác xép',
    'Tân Xã',
    '23 Mục Uyên – Công nghệ - Tân Xã, Tân Xã, Thạch Thất, Hà Nội',
    21.018605,
    105.548865,
    2200000,
    2200000,
    2200000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/z4o22iilzxf-1779684851423.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tnvg8uubv3a-1777003267571.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/861go4rq4yf-1777003267703.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/m62x0y1r7zb-1777003267594.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/g6ao4vw7zav-1777003267493.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5bxw58l90r4-1777003264262.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ gần Siêu thị Đức Thành',
    'Bình Yên',
    'Siêu thị Đức Thành, Bình Yên, Thạch Thất, Hà Nội',
    21.023515,
    105.544582,
    1800000,
    1800000,
    1800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jzkg81bl7e8-1780473689277.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/i6euac9919q-1780473690226.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vjlwlkzwjl-1780473690198.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tfq94w2qrmk-1780473690225.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7ny57uy79kw-1780473690242.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/t0ycdcjvg48-1780473690256.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mny1ps26z6-1780473690272.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/18fb4ri99sj-1780473690274.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 2 - Phòng studio giường đơn',
    'Tân Xã',
    '64 Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.02693,
    105.531277,
    2500000,
    2500000,
    2500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/c680j8srxeq-1779621691795.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qw0vabpajy-1760720179756.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pbiwbpohhlb-1760720179730.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/csr9f0544v-1760720179756.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/gpacmk7o30h-1760720179755.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Minh Anh House',
    'Thạch Hoà',
    'Cổng  Đại học QGHN cơ sở Hoà Lạc, Thạch Hoà, Thạch Thất, Hà Nội',
    21.000086,
    105.520235,
    2000000,
    2700000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vpie5w87q7t-1782694518945.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wzcygmu28oi-1782694519640.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/m13hkv2ek3j-1782694519600.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/maxau5gve8-1782694519603.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/j8mrmva14ei-1782694519629.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/463jfjycl2f-1782694519622.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9nkggvhzxe-1782694519639.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ xinh tại Phú Hữu',
    'Tân Xã',
    'Phú Hữu, Tân Xã, Thạch Thất, Hà Nội',
    21.020817,
    105.550622,
    1800000,
    1800000,
    1800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nkt9bnc7php-1780371466728.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pscjpfptb3-1780371467432.webp'],
    ARRAY['Kệ bếp', 'Máy giặt', 'Phòng tắm', 'Tủ áo quần', 'Tủ lạnh', 'Vệ sinh trong', 'Wifi', 'Bãi để xe riêng', 'Bình nóng lạnh', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'YoungHouse 6',
    'Bình Yên',
    'Ngõ 902 đường 420 , thôn Thái Bình, Bình Yên, Thạch Thất, Hà Nội',
    21.029484,
    105.527992,
    2000000,
    2100000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f6sbgbcwuk-1763020600707.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5d32lz4687t-1763020601648.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/uqbpgk4upbe-1763020601681.webp'],
    ARRAY['Phòng tắm', 'Gác lửng', 'Máy giặt', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Hoàng Kim House',
    'Bình Yên',
    'Cổng làng thôn Linh Sơn, Bình Yên, Thạch Thất, Hà Nội',
    21.031809,
    105.517268,
    1700000,
    2000000,
    1700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/b7k5sqh1p1d-1761919016493.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/3e8zhecnjlw-1761919017364.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1is46yk1to9-1761919017293.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vwtezmdqyj-1761919017335.webp'],
    ARRAY['Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Thành Hoa',
    'Thạch Hoà',
    'Chợ Hoà Lạc, Thạch Hoà, Thạch Thất, Hà Nội',
    21.027098,
    105.51617,
    2100000,
    2300000,
    2100000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/p3k1gjwucb9-1785252873017.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/zdw31l9goj-1785252873665.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tjhb4tz339-1785252873671.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/n270yy32te-1785252873672.webp'],
    ARRAY['Ban công/sân thượng', 'Bình nóng lạnh', 'Bãi để xe riêng', 'Gác lửng', 'Camera an ninh', 'Giường nệm', 'Phòng tắm', 'Phòng tắm riêng', 'Tủ lạnh', 'Vệ sinh trong'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'My House',
    'Thạch Hoà',
    'Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    21.022228,
    105.519161,
    2400000,
    2800000,
    2400000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/obb8rlj6i0n-1781153729846.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/stwgudrj52-1781153730791.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/qk1084tti1g-1781153730788.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/dxgao4o1fpb-1781153730817.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ko9oj1zt488-1781153730835.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/iuzh2vc6ni-1781153730812.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ypx8fje3eke-1781153730789.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0o0bww61yb5-1781153730818.webp'],
    ARRAY['Sân vườn', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Thang máy', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Hoàng Kim House 2',
    'Bình Yên',
    'Thôn Linh Sơn, Bình Yên, Thạch Thất, Hà Nội',
    21.031471,
    105.51765,
    2000000,
    2000000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/401tskv0458-1761919145050.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/b97ygj3oiw-1761919145567.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/cp9ls4f38pb-1761919145574.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vtmmysl77v-1761919145508.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/kpp3xd375k-1761919145582.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Công Hồng',
    'Bình Yên',
    'Cây Xăng Thái Bình, Bình Yên, Thạch Thất, Hà Nội',
    21.006627,
    105.518015,
    2000000,
    2200000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/d8xms4wr2ra-1786627931551.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/q4y82chp48-1786627932443.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/y1uba92z5v-1786627932443.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xeivbwng0eh-1786627932439.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/x28tmw1vkea-1786627932443.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tcdiou0nyhk-1786627932450.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'C Home 7',
    'Tân Xã',
    'Thôn 3, Tân Xã, Thạch Thất, Hà Nội',
    20.986327,
    105.529443,
    2500000,
    2500000,
    2500000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/oc3qnbi0rlt-1789116898113.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lsg5ed8xea-1789116898896.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xxz9o2sb02n-1789116898898.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xzny20vcet-1789116898904.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f5soghtoxiq-1789116898892.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/q0fu2269cj-1789116898902.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/302nlz27rkn-1789116898900.webp'],
    ARRAY['Bãi để xe riêng', 'Bình nóng lạnh', 'Gác lửng', 'Điều hòa', 'Camera an ninh', 'Máy giặt', 'Giường nệm', 'Sân vườn', 'Vệ sinh trong', 'Tủ lạnh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Chung cư Phenikaa cho thuê chính chủ',
    'Bắc Phú Cát',
    'Chung cư phenikaa, Bắc Phú Cát, Thạch Thất, Hà Nội',
    20.987897,
    105.530214,
    5000000,
    5000000,
    5000000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ng0tqehtove-1762154832683.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/acv6m3u14tv-1762154832663.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xj73cff62de-1762154832664.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà Trọ Sinh Viên Thạch Hoà',
    'Thạch Hoà',
    'Thôn 2, Thạch Hoà, Thạch Thất, Hà Nội',
    20.992829,
    105.521643,
    3000000,
    3000000,
    3000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xa11e45kdx-1777081009004.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xce6qh3vno-1777081009006.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pfb0nn3r7re-1777081009012.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ chị Tấm',
    'Tân Xã',
    'chợ Tân Xã, Tân Xã, Thạch Thất, Hà Nội',
    21.027861,
    105.535351,
    1600000,
    1600000,
    1600000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lzbwjtfnx1-1787483635835.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ttahhw0mhfq-1787483636532.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/uh7c29jd23e-1787483636531.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/z5eg3seex5k-1787483636531.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9x7c5y0rpp-1787483636527.webp'],
    ARRAY['Bình nóng lạnh', 'Ban công/sân thượng', 'Bãi để xe riêng', 'Điều hòa', 'Camera an ninh', 'Tủ áo quần', 'Vệ sinh trong', 'Wifi'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Villa Nguyên Căn Thạch Hoà',
    'Thạch Hoà',
    'Thạch Hoà, Thạch Hoà, Thạch Thất, Hà Nội',
    20.995983,
    105.522469,
    19000000,
    19000000,
    19000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nbg9q6kj5r-1779965147049.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/u916kj6zvnh-1779965147862.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/zk9xix18vp-1779965147855.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5duu9y3i2s3-1779965147876.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/fui2abyxp4-1779965147866.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'URHome 6',
    'Thạch Hoà',
    'Thôn 3, Thạch Hoà, Thạch Thất, Hà Nội',
    20.992829,
    105.521643,
    1800000,
    1800000,
    1800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/mwrliv6ztmk-1787212472234.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/dvbjjrf0utl-1787212472884.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/o17ssb67wih-1787212472891.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/zzdp1desqwj-1787212472882.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ydn5movmkf-1787212472874.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/e6h851e3j47-1787212472901.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/o1hx92j3dr-1787212472886.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/n3e47y1p6e8-1787212472898.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Bình Yên',
    'Bình Yên',
    'Cây Xăng Thái Bình, Bình Yên, Thạch Thất, Hà Nội',
    21.031701,
    105.537109,
    3000000,
    3500000,
    3000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6z6x0i6t0sy-1786806716133.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/yf13juwvnl-1786806716934.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pvlfzvfanb-1786806716940.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/zy36tywfcbg-1786806716926.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/fiurqe0ymok-1786806716913.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/108dy419qnxa-1786806716918.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9guvf9iidqw-1786806716924.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/4ugyid3pq7a-1786806716943.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'TRG Building - URHome',
    'Thạch Hoà',
    'Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    21.025577,
    105.523098,
    3000000,
    3000000,
    3000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/blw9owgpw7m-1787212352120.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/55sgut63up2-1787212353054.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/a1fbrj4d3-1787212353042.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/sz66809c6ld-1787212353055.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/a58pwhtn0h-1787212353047.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/c2oxpd5z8fn-1787212353052.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/zatq3yshiwk-1787212353053.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/101rw7rn3tir-1787212353040.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'QQ House',
    'Thạch Hoà',
    'Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    20.992829,
    105.521643,
    2200000,
    2500000,
    2200000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1vim9wxjha6-1779982132906.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ri7jme319-1779982133891.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jm7s7i7j65-1779982133906.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/m3bnb665z3-1779982133930.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/coviotg11hg-1779982133907.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nikazbsp9gq-1779982133881.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Khu Trọ Sinh Viên Thạch Hoà',
    'Thạch Hoà',
    'Đại học FPT, Thạch Hoà, Thạch Thất, Hà Nội, Thạch Hoà, Thạch Thất, Hà Nội',
    20.998363,
    105.521913,
    1600000,
    1800000,
    1600000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/v0vslflb5ag-1784456013329.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pv9tr5080t-1784456014470.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/kiitljr2i6r-1784456014534.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0td82frcs9v-1784456014431.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/c09cgdmuhyh-1784456014742.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lbq67257fy-1784456014763.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/bcc47mfung-1784456014751.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6w8drfvd8m9-1784456014528.webp'],
    ARRAY['Phòng tắm', 'Giường nệm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Sân vườn', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Bắc Phú Cát',
    'Thạch Hoà',
    'Khu Tái Định Cư Bắc Phú Cát, Thạch Hoà, Thạch Thất, Hà Nội',
    20.986385,
    105.527799,
    2000000,
    2900000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1we85gsm33j-1786552219180.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/jts4goexhxo-1786552220043.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xsxk3djnwt-1786552220039.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/35mm2gi6mad-1786552220040.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/hzmrdsrf6j-1786552220026.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/wlah80t0xc-1786552220037.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/gjxsws45f4t-1786552220029.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/clgvbkt2dwv-1786552220031.webp'],
    ARRAY['Phòng tắm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Bãi để xe riêng', 'Vệ sinh trong', 'Bình nóng lạnh', 'Tủ áo quần', 'Thang máy'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'C Home''s 5',
    'Thạch Hoà',
    'Cây xăng 39, Thạch Hoà, Thạch Thất, Hà Nội',
    20.986327,
    105.529443,
    2000000,
    2000000,
    2000000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/y6uzvh4rhi-1788621536116.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/74lt8p9g75i-1788621536817.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/cjzxy4ap7w-1788621536797.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tz3okebiakj-1788621536812.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7sk79u0tfc-1788621536815.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Bình Yên mới tinh',
    'Bình Yên',
    'Bình Yên, Bình Yên, Thạch Thất, Hà Nội',
    21.028624,
    105.529477,
    2200000,
    2200000,
    2200000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7stzf62jien-1784559826947.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/tp3oiu6cmrj-1784559827774.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vndbvdvttl-1784559827765.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ogy3mn0ecw-1784559827780.webp'],
    ARRAY['Wifi', 'Phòng tắm', 'Giường nệm', 'Camera an ninh', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Bình nóng lạnh', 'Điều hòa', 'Tủ áo quần'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Phòng Gác Xép Rộng Rãi Cho 2-3 Người Tại Thôn 4',
    'Thạch Hoà',
    'Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    20.995983,
    105.522469,
    2700000,
    2700000,
    2700000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5qa2jm2bsix-1784560111425.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/eacydl7ycxo-1784560112321.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/o2leaioer5-1784560112318.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/x4ckevstm3-1784560112319.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ Sơn Nam',
    'Thạch Hoà',
    'Cổng chính Đại học QGHN cơ sở Hoà Lạc, Thạch Hoà, Thạch Thất, Hà Nội',
    21.007603,
    105.517224,
    3500000,
    4500000,
    3500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/bu6kc0a04q-1786326043028.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/eixwi61h7ef-1786326043841.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6esr56ae2ih-1786326043853.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/oul9xdm0hyr-1786326043897.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ovebet4vjlb-1786326043865.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/992kauiccwb-1786326043865.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/de4rx4w8h9f-1786326043896.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rz5y10n9w5l-1786326043883.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ hòa lạc',
    'Thạch Hòa',
    'Hà Nội, Thạch Hòa, Thạch Thất, Hà Nội',
    20.998363,
    105.521913,
    1500000,
    2000000,
    1500000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/f0nbpqfpgmd-1791431484622.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Thôn 4 Thạch Hoà',
    'Thạch Hoà',
    'Thôn 4, Thạch Hoà, Thạch Thất, Hà Nội',
    20.995983,
    105.522469,
    2100000,
    2500000,
    2100000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/a2bew22ezoa-1784129594517.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/9szmwy43poo-1784129595266.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/31uws93bqfs-1784129595259.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/75e3uu7cd0s-1784129595267.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Đức Thành Bình Yên',
    'Bình Yên',
    'Bình Yên, Bình Yên, Thạch Thất, Hà Nội',
    21.02649,
    105.52175,
    1800000,
    1800000,
    1800000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1x4ve1qzmjr-1776911210012.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xmoquy66gnl-1776911210031.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ekh5bi8ez2p-1776911210029.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/1dz4gcxho49-1776911210009.webp'],
    ARRAY['Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Cổng Trường Thạch Hoà',
    'Thạch Hoà',
    'Cổng phụ Đại học QGHN cơ sở Hoà Lạc, Thạch Hoà, Thạch Thất, Hà Nội',
    20.992829,
    105.521643,
    2000000,
    2200000,
    2000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ab546bkvegf-1783837107671.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pxribu1vbdh-1783837108530.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lgycz5jf6a-1783837108537.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/5yqcxc0w7bn-1783837108540.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/glmld3877uh-1783837108538.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ thôn 7 Hoà Lạc',
    'Thạch Hoà',
    'Thôn 7, Thạch Hoà, Thạch Thất, Hà Nội',
    20.995983,
    105.522469,
    1500000,
    1500000,
    1500000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0e5mn3iaxfm-1780677400209.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vprkna9s5yq-1780677400716.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/kn0h2clfr8-1780677400719.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nwqe9q1h0r-1780677400708.webp'],
    ARRAY['Wifi', 'Vệ sinh trong', 'Tủ áo quần', 'Kệ bếp', 'Camera an ninh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Nhà trọ thôn 3 Thạch Hoà',
    'Thạch Hoà',
    'Thôn 3, Thạch Hoà, Thạch Thất, Hà Nội',
    20.995983,
    105.522469,
    1300000,
    1300000,
    1300000,
    3500,
    '25000/khối',
    'available',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6vmjilrjrwh-1779981962562.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lneif34ibcg-1779981963507.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/l0mlg3m8s9g-1779981963491.webp'],
    ARRAY['Wifi', 'Bãi để xe riêng', 'Bình nóng lạnh', 'Điều hòa'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Chung cư  Phenika 2 ngủ 2 Vs',
    'Thạch Hòa',
    'Chung cư phenika, Thạch Hòa, Thạch Thất, Hà Nội',
    20.987897,
    105.530214,
    7200000,
    7200000,
    7200000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/v5juimk59l-1781625701088.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/z1hb4axl9q8-1781625702111.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/pra08uhf4lt-1781625702137.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/aar43scen18-1781625702121.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/nyk9ihoop4-1781625702122.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Chung cư SkyHome 1 ngủ 1 khách',
    'Thạch Hoà',
    'Khu Tái Định Cư Bắc Phú Cát, Thạch Hoà, Thạch Thất, Hà Nội',
    20.987576,
    105.528855,
    4000000,
    4000000,
    4000000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/chbsf63mrnc-1782351560403.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7o0da94pc4h-1782351561177.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/coc3kzneop-1782351561185.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ov0zoxwh2k8-1782351561162.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/osbbktzy4te-1782351561156.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/py2sf3fmnl-1782351561184.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/ctonm2m8tm-1782351561196.webp'],
    ARRAY['Giường nệm', 'Kệ bếp', 'Máy giặt', 'Tủ lạnh', 'Phòng tắm riêng', 'Wifi', 'Bãi để xe riêng', 'Ban công/sân thượng', 'Vệ sinh trong', 'Bình nóng lạnh'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Eco House',
    'Bình Yên',
    'Thôn Linh Sơn, Bình Yên, Thạch Thất, Hà Nội',
    20.995983,
    105.522469,
    1500000,
    1600000,
    1500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/gtcq12vraw-1786884409640.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/hmg1y4sz5xp-1786884369617.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/sle4nts33un-1786884369619.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/erlpnfj9k8u-1786884369625.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/vtatb0bbqhl-1786884369612.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/bhurscd3jao-1786884369608.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/3tpq91yhpzq-1786884369622.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/x4r7rzy89ef-1786884369610.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'C Home 3',
    'Thạch Hoà',
    'Thôn 3, Thạch Hoà, Thạch Thất, Hà Nội',
    21.0105,
    105.5184,
    2600000,
    2600000,
    2600000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/7rz5xgfbn7b-1786638912358.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/6lcjz4oz94d-1786638912892.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/eeoaszoq72j-1786638912895.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/xuk3dpkch8r-1786638912895.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/lvsi29srbza-1786638912901.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/g1i8juvoaav-1786638912895.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

INSERT INTO places (
    id, category_id, contribution_id, name, area, address,
    latitude, longitude, min_price, max_price, rent_price, electricity_price, water_price,
    room_status, images, amenities, created_at, updated_at, gps_accuracy
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM categories WHERE name ILIKE '%nhà trọ%' OR name ILIKE '%boarding%' LIMIT 1),
    (SELECT contribution_id FROM places LIMIT 1),
    'Trọ Ngọc Trai - Gần ĐH Việt Nhật',
    'Tiến Xuân',
    'Xanh Villa, Tiến Xuân, Thạch Thất, Hà Nội',
    20.995983,
    105.522469,
    2500000,
    2500000,
    2500000,
    3500,
    '25000/khối',
    'full',
    ARRAY['https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/0mm7he898nbf-1784999971094.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/8x0vgu92nlm-1784999972090.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/hn80clzikq-1784999972094.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/v75eqjsmkti-1784999972078.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/o9uj676op6n-1784999972061.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/q50o6fchnlh-1784999972107.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/rwz073wwzy-1784999972091.webp', 'https://vlqkecqwfvkymszkqooo.supabase.co/storage/v1/object/public/room-images/razq2j90l-1784999972068.webp'],
    ARRAY['Khép kín', 'An ninh 24/7'],
    NOW(), NOW(), 5.0
);

