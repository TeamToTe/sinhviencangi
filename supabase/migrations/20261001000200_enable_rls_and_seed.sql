-- Enable Row Level Security Policies for Public Access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read on all tables
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read places" ON places FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read contributions" ON contributions FOR SELECT USING (true);

-- Allow anonymous insert for reviews & contributions & reports
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contributions" ON contributions FOR INSERT WITH CHECK (true);

-- Initial Categories Seed
INSERT INTO categories (name, description) VALUES
    ('boarding_house', 'Nhà trọ & Chung cư mini'),
    ('food_drink', 'Ăn uống & Quán cafe'),
    ('grocery', 'Siêu thị & Cửa hàng tạp hóa'),
    ('pharmacy', 'Hiệu thuốc & Dịch vụ y tế'),
    ('services', 'Sửa xe, giặt là, in ấn'),
    ('entertainment', 'Giải trí, bida, net, thể thao'),
    ('campus', 'Trường ĐH & Điểm đón xe bus')
ON CONFLICT DO NOTHING;
