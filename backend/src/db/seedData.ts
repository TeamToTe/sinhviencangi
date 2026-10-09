export const INITIAL_CATEGORIES = [
  { name: 'boarding_house', description: 'Nhà trọ & Chung cư mini' },
  { name: 'food_drink', description: 'Ăn uống & Quán cafe' },
  { name: 'grocery', description: 'Siêu thị & Cửa hàng tạp hóa' },
  { name: 'pharmacy', description: 'Hiệu thuốc & Dịch vụ y tế' },
  { name: 'services', description: 'Sửa xe, giặt là, in ấn' },
  { name: 'entertainment', description: 'Giải trí, bida, net, thể thao' },
  { name: 'campus', description: 'Trường ĐH & Điểm đón xe bus' },
];

// 6 Surveyors from Read_me.txt
export const INITIAL_SURVEYORS = [
  'Đặng Cao Cường',
  'Đào Thế Việt',
  'Trần Đức Thịnh',
  'Phạm Mạnh Giang',
  'Ngô Quang Huy',
  'Mai Xuân Dương',
];

// 6 Admin accounts for the 6 team members + Master Admin
// Password format: Tên không dấu + MSSV (ví dụ: vietHE204143, cuongHE204075)
export const INITIAL_USERS = [
  {
    username: 'admin',
    password: 'hola@2026',
    fullName: 'Admin ConnectHub (Quản trị hệ thống)',
    role: 'admin',
    email: 'admin@connecthub.edu.vn',
  },
  {
    username: 'cuongdc',
    password: 'cuongHE204075',
    fullName: 'Đặng Cao Cường (Nhóm trưởng)',
    role: 'admin',
    email: 'cuongdc@fpt.edu.vn',
  },
  {
    username: 'vietdt',
    password: 'vietHE204143',
    fullName: 'Đào Thế Việt (Phó nhóm)',
    role: 'admin',
    email: 'vietdt@fpt.edu.vn',
  },
  {
    username: 'thinhdt',
    password: 'thinhHE201309',
    fullName: 'Trần Đức Thịnh',
    role: 'admin',
    email: 'thinhdt@fpt.edu.vn',
  },
  {
    username: 'giangpm',
    password: 'giangHE204233',
    fullName: 'Phạm Mạnh Giang',
    role: 'admin',
    email: 'giangpm@fpt.edu.vn',
  },
  {
    username: 'huynguyen',
    password: 'huyHE204101',
    fullName: 'Ngô Quang Huy',
    role: 'admin',
    email: 'huynguyen@fpt.edu.vn',
  },
  {
    username: 'duongmx',
    password: 'duongHE204524',
    fullName: 'Mai Xuân Dương',
    role: 'admin',
    email: 'duongmx@fpt.edu.vn',
  },
];

export const INITIAL_PLACES = [
  {
    name: 'Chung Cư Mini Happy House Tân Xã',
    categoryName: 'boarding_house',
    contributorName: 'Đặng Cao Cường',
    area: 'Tân Xã',
    address: 'Số 18 Ngõ 3 Hồ Tân Xã, Xã Tân Xã, Thạch Thất, Hà Nội',
    latitude: 21.0185,
    longitude: 105.5345,
    min_price: 2500000,
    max_price: 3200000,
    rent_price: 2800000,
    electricity_price: 3500,
    water_price: '25000/khối',
    room_status: 'available',
    opening_hours: '24/7',
    phone: '0987123456',
    amenities: ['Có điều hòa', 'Gác xép', 'Thang máy', 'Khóa vân tay', 'Đạt chuẩn an toàn PCCC', 'Không chung chủ', 'Wifi miễn phí'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    reviews: [
      { author: 'Đặng Cao Cường', rating: 5, content: 'Bác chủ thân thiện, phòng mới sạch đẹp, ban công view hồ Tân Xã cực mát.' },
      { author: 'Trần Đức Thịnh', rating: 4, content: 'Phòng đầy đủ tiện nghi, an ninh vân tay tốt, giá hợp lý cho sinh viên FPT.' }
    ]
  },
  {
    name: 'Quán Cơm Tấm K17',
    categoryName: 'food_drink',
    contributorName: 'Đào Thế Việt',
    area: 'Thạch Hòa',
    address: 'Cổng 2 ĐH FPT, Thạch Hòa, Thạch Thất, Hà Nội',
    latitude: 21.0125,
    longitude: 105.5262,
    min_price: 30000,
    max_price: 45000,
    rent_price: 0,
    electricity_price: 0,
    water_price: '',
    room_status: '',
    opening_hours: '09:30 - 20:30',
    phone: '0912345678',
    amenities: ['Có điều hòa', 'Wifi miễn phí', 'Chỗ để xe rộng rãi', 'Thanh toán QR', 'Phục vụ thông trưa'],
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'],
    reviews: [
      { author: 'Đào Thế Việt', rating: 5, content: 'Sườn nướng thơm ngon đẫm sốt, cơm thêm miễn phí cho sinh viên.' }
    ]
  },
  {
    name: 'Khu Trọ Sinh Thái Eco Thạch Hòa',
    categoryName: 'boarding_house',
    contributorName: 'Phạm Mạnh Giang',
    area: 'Thạch Hòa',
    address: 'Thôn 3 Thạch Hòa (gần KTX ĐHQG), Thạch Thất, Hà Nội',
    latitude: 21.0162,
    longitude: 105.5235,
    min_price: 1800000,
    max_price: 2300000,
    rent_price: 2000000,
    electricity_price: 3500,
    water_price: '70000/người',
    room_status: 'available',
    opening_hours: '24/7',
    phone: '0978654321',
    amenities: ['Có điều hòa', 'Vệ sinh khép kín', 'Chỗ để xe rộng rãi', 'Không chung chủ', 'Đạt chuẩn an toàn PCCC'],
    images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80'],
    reviews: [
      { author: 'Phạm Mạnh Giang', rating: 4, content: 'Khuôn viên nhiều cây xanh yên tĩnh, đi bộ sang ĐHQG hoặc bus FPT rất tiện.' }
    ]
  },
  {
    name: 'Tiệm Trà Sữa & Cafe Tí Tồ Hola',
    categoryName: 'food_drink',
    contributorName: 'Ngô Quang Huy',
    area: 'Tân Xã',
    address: 'Đường ven hồ Tân Xã, Thạch Thất, Hà Nội',
    latitude: 21.0210,
    longitude: 105.5360,
    min_price: 25000,
    max_price: 45000,
    rent_price: 0,
    electricity_price: 0,
    water_price: '',
    room_status: '',
    opening_hours: '08:00 - 23:00',
    phone: '0966889900',
    amenities: ['Có điều hòa', 'Wifi miễn phí', 'Chỗ để xe miễn phí', 'Thanh toán QR', 'View hồ Tân Xã'],
    images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80'],
    reviews: [
      { author: 'Ngô Quang Huy', rating: 5, content: 'View hồ cực chill lúc hoàng hôn, bàn học có ổ điện cắm laptop tiện lợi.' }
    ]
  },
  {
    name: 'Siêu Thị WinMart+ Hòa Lạc',
    categoryName: 'grocery',
    contributorName: 'Mai Xuân Dương',
    area: 'Thạch Hòa',
    address: 'Khu phố ẩm thực Cổng 1 ĐH FPT, Thạch Thất, Hà Nội',
    latitude: 21.0118,
    longitude: 105.5275,
    min_price: 10000,
    max_price: 200000,
    rent_price: 0,
    electricity_price: 0,
    water_price: '',
    room_status: '',
    opening_hours: '06:30 - 22:00',
    phone: '02473081188',
    amenities: ['Thanh toán QR', 'Có điều hòa', 'Chỗ để xe miễn phí'],
    images: ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80'],
    reviews: [
      { author: 'Mai Xuân Dương', rating: 4, content: 'Đầy đủ nhu yếu phẩm cho tân sinh viên, thanh toán ví điện tử nhanh gọn.' }
    ]
  },
  {
    name: 'Nhà Thuốc FPT Long Châu Km29',
    categoryName: 'pharmacy',
    contributorName: 'Đặng Cao Cường',
    area: 'Thạch Hòa',
    address: 'Quốc Lộ 21A, Km 29 Thạch Hòa, Thạch Thất, Hà Nội',
    latitude: 21.0148,
    longitude: 105.5218,
    min_price: 15000,
    max_price: 500000,
    rent_price: 0,
    electricity_price: 0,
    water_price: '',
    room_status: '',
    opening_hours: '07:00 - 22:30',
    phone: '18006928',
    amenities: ['Dược sĩ tư vấn', 'Thanh toán QR', 'Có điều hòa'],
    images: ['https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&q=80'],
    reviews: [
      { author: 'Đặng Cao Cường', rating: 5, content: 'Thuốc chính hãng, dược sĩ nhiệt tình tư vấn khi sinh viên ốm sốt.' }
    ]
  },
  {
    name: 'Chung Cư Mini Sunshine Bình Yên',
    categoryName: 'boarding_house',
    contributorName: 'Đào Thế Việt',
    area: 'Bình Yên',
    address: 'Tỉnh lộ 420, Cánh Chủ, Bình Yên, Thạch Thất, Hà Nội',
    latitude: 21.0085,
    longitude: 105.5385,
    min_price: 2200000,
    max_price: 3000000,
    rent_price: 2400000,
    electricity_price: 3800,
    water_price: '30000/khối',
    room_status: 'available',
    opening_hours: '24/7',
    phone: '0901234567',
    amenities: ['Có điều hòa', 'Thang máy', 'Khóa vân tay', 'Không chung chủ', 'Đạt chuẩn an toàn PCCC', 'Wifi miễn phí'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    reviews: [
      { author: 'Đào Thế Việt', rating: 4, content: 'Đường đi thông thoáng, phòng rộng rãi có ban công phơi đồ riêng.' }
    ]
  },
  {
    name: 'Tiệm In Ấn Photocopy & Sửa Khóa FPT',
    categoryName: 'services',
    contributorName: 'Trần Đức Thịnh',
    area: 'Thạch Hòa',
    address: 'Cổng 1 Đại Học FPT, Thạch Hòa, Thạch Thất, Hà Nội',
    latitude: 21.0130,
    longitude: 105.5265,
    min_price: 500,
    max_price: 50000,
    rent_price: 0,
    electricity_price: 0,
    water_price: '',
    room_status: '',
    opening_hours: '07:30 - 21:00',
    phone: '0944556677',
    amenities: ['In đồ án màu', 'Đóng sách gáy xoắn', 'Cắt khóa thẻ từ', 'Thanh toán QR'],
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80'],
    reviews: [
      { author: 'Trần Đức Thịnh', rating: 5, content: 'Cứu cánh mùa đồ án, in nhanh, giá siêu rẻ cho sinh viên.' }
    ]
  },
  {
    name: 'Bida Club 88 Hòa Lạc',
    categoryName: 'entertainment',
    contributorName: 'Phạm Mạnh Giang',
    area: 'Tân Xã',
    address: 'Ngã 3 Tân Xã, Thạch Thất, Hà Nội',
    latitude: 21.0235,
    longitude: 105.5312,
    min_price: 40000,
    max_price: 70000,
    rent_price: 0,
    electricity_price: 0,
    water_price: '',
    room_status: '',
    opening_hours: '08:00 - 02:00',
    phone: '0988776655',
    amenities: ['Bàn Aileex nhập khẩu', 'Có điều hòa', 'Wifi miễn phí', 'Chỗ để xe rộng'],
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'],
    reviews: [
      { author: 'Phạm Mạnh Giang', rating: 4, content: 'Bàn bóng chuẩn thi đấu, phòng lạnh mát mẻ xả stress sau giờ học.' }
    ]
  },
  {
    name: 'Đại Học FPT Hà Nội (Hola Campus)',
    categoryName: 'campus',
    contributorName: 'Ngô Quang Huy',
    area: 'Khu Công Nghệ Cao Hòa Lạc',
    address: 'Khu CNC Hòa Lạc, Km29 Đại lộ Thăng Long, Hà Nội',
    latitude: 21.0135,
    longitude: 105.5252,
    min_price: 0,
    max_price: 0,
    rent_price: 0,
    electricity_price: 0,
    water_price: '',
    room_status: '',
    opening_hours: '24/7',
    phone: '02473001866',
    amenities: ['Wifi Campus', 'Thư viện triệu đô', 'Sân bóng đá & bóng rổ', 'Hồ sen check-in', 'Điểm xe bus 74, 88, 107'],
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80'],
    reviews: [
      { author: 'Ngô Quang Huy', rating: 5, content: 'Tâm điểm của toàn khu vực Hòa Lạc, kiến trúc xanh hiện đại.' }
    ]
  }
];
