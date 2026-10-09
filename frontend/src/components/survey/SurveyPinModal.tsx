import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Crosshair,
  Camera,
  Check,
  Star,
  Upload,
  Phone,
  Clock,
  Sparkles,
  AlertCircle,
  Trash2,
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Cross,
  Wrench,
  Gamepad2,
  GraduationCap,
} from 'lucide-react';
import { useMapStore } from '../../stores/useMapStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { placesService } from '../../services/placesService';
import type { PlaceCategory, Place } from '../../types/place';

interface SurveyPinModalProps {
  onPlaceCreated?: (newPlace: Place) => void;
}

const SURVEYORS = [
  'Đặng Cao Cường',
  'Đào Thế Việt',
  'Trần Đức Thịnh',
  'Phạm Mạnh Giang',
  'Ngô Quang Huy',
  'Mai Xuân Dương',
];

const CATEGORY_OPTIONS: { id: PlaceCategory; label: string; icon: any; color: string }[] = [
  { id: 'food_drink', label: 'Ẩm thực & Cafe', icon: UtensilsCrossed, color: '#d97706' },
  { id: 'boarding_house', label: 'Nhà trọ & CCMN', icon: Home, color: '#ea580c' },
  { id: 'services', label: 'Dịch vụ học tập & Đời sống', icon: Wrench, color: '#0891b2' },
  { id: 'pharmacy', label: 'Y tế & Thuốc men', icon: Cross, color: '#dc2626' },
  { id: 'entertainment', label: 'Giải trí & Thể thao', icon: Gamepad2, color: '#7c3aed' },
  { id: 'grocery', label: 'Tạp hóa & Tiện ích', icon: ShoppingBag, color: '#0284c7' },
  { id: 'campus', label: 'Khuôn viên & Điểm bus', icon: GraduationCap, color: '#16a34a' },
];

const AREA_OPTIONS = [
  'Tân Xã',
  'Thạch Hòa',
  'Bình Yên',
  'Khu Công Nghệ Cao Hòa Lạc',
  'Khác',
];

const AMENITY_OPTIONS = [
  'Có điều hòa',
  'Wifi miễn phí',
  'Chỗ để xe miễn phí / rộng rãi',
  'Thanh toán Chuyển khoản / Quét mã QR',
  'Thang máy (với nhà trọ)',
  'Khóa vân tay / Camera an ninh',
  'Đạt chuẩn an toàn PCCC',
  'Không chung chủ (với nhà trọ)',
  'Phục vụ thông trưa',
];

export const SurveyPinModal: React.FC<SurveyPinModalProps> = ({ onPlaceCreated }) => {
  const { isSurveyModalOpen, setSurveyModalOpen } = useMapStore();
  const { user } = useAuthStore();

  // Form State
  const [surveyor, setSurveyor] = useState<string>(() => {
    return localStorage.getItem('connecthub_surveyor') || SURVEYORS[0];
  });
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('food_drink');
  const [area, setArea] = useState('Tân Xã');
  const [address, setAddress] = useState('');

  // GPS State
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsErrorMessage, setGpsErrorMessage] = useState<string>('');

  // Prices & Housing details
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [rentPrice, setRentPrice] = useState<string>('');
  const [electricityPrice, setElectricityPrice] = useState<string>('3500');
  const [waterPrice, setWaterPrice] = useState<string>('25000/khối');
  const [roomStatus, setRoomStatus] = useState<'available' | 'full'>('available');

  // Contact & hours
  const [openingHours, setOpeningHours] = useState('08:00 - 22:00');
  const [phone, setPhone] = useState('');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Wifi miễn phí']);

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rating & Review
  const [rating, setRating] = useState<number>(5);
  const [reviewContent, setReviewContent] = useState('');

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Save selected surveyor to local storage
  const handleSurveyorChange = (val: string) => {
    setSurveyor(val);
    localStorage.setItem('connecthub_surveyor', val);
  };

  // Function to request GPS location from device
  const requestGpsLocation = () => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('error');
      setGpsErrorMessage('Trình duyệt hoặc thiết bị này không hỗ trợ định vị GPS.');
      return;
    }

    setGpsStatus('locating');
    setGpsErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = Number(pos.coords.latitude.toFixed(6));
        const longitude = Number(pos.coords.longitude.toFixed(6));
        const accuracy = Math.round(pos.coords.accuracy);

        setLat(latitude);
        setLng(longitude);
        setGpsAccuracy(accuracy);
        setGpsStatus('success');

        // Auto-detect area
        try {
          const detected = await placesService.detectArea(latitude, longitude);
          if (detected) setArea(detected);
        } catch {
          // ignore
        }
      },
      (err) => {
        setGpsStatus('error');
        if (err.code === 1) {
          setGpsErrorMessage(
            'Quyền vị trí đã bị từ chối! Vui lòng mở cài đặt trình duyệt trên điện thoại và cho phép chia sẻ vị trí (GPS) để chấm chính xác.'
          );
        } else if (err.code === 2) {
          setGpsErrorMessage('Không thể xác định vị trí. Vui lòng bật GPS / Định vị trên điện thoại.');
        } else {
          setGpsErrorMessage('Quá thời gian chờ tín hiệu GPS. Vui lòng thử bấm lại hoặc ra chỗ thoáng.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Automatically request GPS upon modal open if not already acquired
  useEffect(() => {
    if (isSurveyModalOpen && lat === null && gpsStatus === 'idle') {
      requestGpsLocation();
    }
  }, [isSurveyModalOpen]);

  // Pre-fill surveyor if authenticated user matches team roster
  useEffect(() => {
    if (user && user.fullName) {
      const match = SURVEYORS.find((s) => s.toLowerCase() === user.fullName.toLowerCase());
      if (match) {
        setSurveyor(match);
      }
    }
  }, [user]);

  // Handle Photo selection & converting to base64
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    const fileList = Array.from(files).slice(0, 5 - photos.length);

    Promise.all(
      fileList.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      })
    ).then((base64Strings) => {
      const valid = base64Strings.filter(Boolean);
      setPhotos((prev) => [...prev, ...valid]);
      setIsUploadingPhoto(false);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên địa điểm!');
      return;
    }

    if (lat === null || lng === null) {
      setErrorMessage('Tọa độ GPS là bắt buộc! Hãy bấm "Lấy lại GPS" trên điện thoại để chấm chuẩn xác.');
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedMinPrice = minPrice ? parseInt(minPrice.replace(/\D/g, ''), 10) : 0;
      const parsedMaxPrice = maxPrice ? parseInt(maxPrice.replace(/\D/g, ''), 10) : 0;
      const parsedRentPrice = rentPrice ? parseInt(rentPrice.replace(/\D/g, ''), 10) : 0;

      const payload = {
        name: name.trim(),
        category,
        areaName: area,
        area,
        address: address.trim() || `${area}, Thạch Thất, Hà Nội`,
        coordinates: { lat, lng },
        latitude: lat,
        longitude: lng,
        gpsAccuracy: gpsAccuracy || undefined,
        contributorName: surveyor,
        minPrice: parsedMinPrice || parsedRentPrice,
        maxPrice: parsedMaxPrice || parsedRentPrice,
        rentPrice: parsedRentPrice,
        electricityPrice: parseInt(electricityPrice, 10) || 3500,
        waterPrice,
        roomStatus,
        openingHours,
        phone,
        amenities: selectedAmenities,
        photos,
        rating,
        reviewContent: reviewContent.trim() || 'Địa điểm được khảo sát thực địa tại Hòa Lạc.',
      };

      const newPlace = await placesService.createPlace(payload);

      setSubmitSuccess(true);
      if (onPlaceCreated) {
        onPlaceCreated(newPlace);
      }

      // Reset form fields for next place
      setTimeout(() => {
        setName('');
        setAddress('');
        setMinPrice('');
        setMaxPrice('');
        setRentPrice('');
        setPhotos([]);
        setReviewContent('');
        setSubmitSuccess(false);
        setSurveyModalOpen(false);
      }, 1500);
    } catch (err: any) {
      console.error('Lỗi khi chấm địa điểm:', err);
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSurveyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <MapPin className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-1.5 font-serif">
                <span>Chấm Điểm Khảo Sát Thực Địa</span>
                <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded-full">
                  GPS
                </span>
              </h2>
              <p className="text-xs text-emerald-100 font-sans">
                Thu thập dữ liệu thực tế tại Hòa Lạc (ConnectHub - Nhóm 2)
              </p>
            </div>
          </div>
          <button
            onClick={() => setSurveyModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {/* Success Banner */}
          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 animate-in fade-in">
              <Check className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">🎉 Đã chấm địa điểm thành công!</p>
                <p className="text-xs text-emerald-700">Dữ liệu đã được lưu trực tiếp vào bản đồ.</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-2.5 text-xs font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. GPS Location Card */}
          <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-xs sm:text-sm text-emerald-950">
                  Tọa độ GPS điện thoại (*)
                </span>
              </div>
              <button
                type="button"
                onClick={requestGpsLocation}
                disabled={gpsStatus === 'locating'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Crosshair className={`w-3.5 h-3.5 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
                <span>{gpsStatus === 'locating' ? 'Đang dò GPS...' : 'Lấy lại GPS'}</span>
              </button>
            </div>

            {/* GPS Feedback */}
            {gpsStatus === 'locating' && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>Đang hỏi quyền định vị & lấy tọa độ vệ tinh GPS chính xác...</span>
              </div>
            )}

            {gpsStatus === 'success' && lat !== null && lng !== null && (
              <div className="bg-white p-3 rounded-xl border border-emerald-300 text-xs text-gray-800 space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-emerald-800">
                  <span>📍 Lat: {lat.toFixed(5)}</span>
                  <span>Lng: {lng.toFixed(5)}</span>
                </div>
                {gpsAccuracy !== null && (
                  <p className="text-[11px] text-gray-600 flex items-center gap-1 font-sans">
                    <span>Độ chính xác:</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded-md text-[10px] ${
                        gpsAccuracy <= 15
                          ? 'bg-emerald-100 text-emerald-800'
                          : gpsAccuracy <= 30
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      ±{gpsAccuracy}m {gpsAccuracy <= 15 ? '(Rất chuẩn)' : '(Khá tốt)'}
                    </span>
                  </p>
                )}
              </div>
            )}

            {gpsStatus === 'error' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{gpsErrorMessage}</span>
                </p>
                <p className="text-[11px] text-gray-600">
                  Mẹo: Nhấn nút "Lấy lại GPS" ở góc trên bên phải khi điện thoại đã bật vị trí.
                </p>
              </div>
            )}
          </div>

          {/* 2. Surveyor & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Người thực hiện khảo sát (*)
              </label>
              <select
                value={surveyor}
                onChange={(e) => handleSurveyorChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {SURVEYORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Tên địa điểm / Quán / Trọ (*)
              </label>
              <input
                type="text"
                placeholder="VD: Cơm Gà Ba Râu, CCMN Happy House..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 3. Category & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Danh mục dịch vụ (*)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlaceCategory)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Khu vực (*)
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {AREA_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Địa chỉ cụ thể (*)
            </label>
            <input
              type="text"
              placeholder="VD: Số 18 Ngõ 3 Thôn 2 Tân Xã, Thạch Thất, Hà Nội"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 5. Pricing (Different for boarding_house vs others) */}
          {category === 'boarding_house' ? (
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3">
              <span className="font-bold text-xs text-orange-950 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-orange-600" />
                Thông tin chi phí Nhà trọ & CCMN
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Giá phòng (VNĐ/tháng)
                  </label>
                  <input
                    type="number"
                    placeholder="2500000"
                    value={rentPrice}
                    onChange={(e) => setRentPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Điện (VNĐ/kWh)
                  </label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={electricityPrice}
                    onChange={(e) => setElectricityPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Giá nước
                  </label>
                  <input
                    type="text"
                    placeholder="25000/khối"
                    value={waterPrice}
                    onChange={(e) => setWaterPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Tình trạng
                  </label>
                  <select
                    value={roomStatus}
                    onChange={(e) => setRoomStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs"
                  >
                    <option value="available">Còn phòng</option>
                    <option value="full">Đã hết phòng</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Giá thấp nhất (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="25000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Giá cao nhất (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* 6. Contact & Opening hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                Giờ mở cửa
              </label>
              <input
                type="text"
                placeholder="VD: 07:00 - 22:00 hoặc 24/7"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                Số điện thoại / Zalo
              </label>
              <input
                type="text"
                placeholder="VD: 0987123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium"
              />
            </div>
          </div>

          {/* 7. Amenities Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Tiện ích nổi bật
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_OPTIONS.map((item) => {
                const checked = selectedAmenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-[11px] font-medium text-left border transition-all cursor-pointer ${
                      checked
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. Photo Upload with Mobile Camera support */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Hình ảnh chụp thực tế ({photos.length}/5 ảnh)
              </label>
              <span className="text-[11px] text-gray-500">Biển hiệu & không gian quán</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2.5">
              {photos.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={src} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="w-20 h-20 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-100/50 flex flex-col items-center justify-center gap-1 text-emerald-700 transition-all cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold">Chụp / Chọn</span>
                </button>
              )}
            </div>
          </div>

          {/* 9. Surveyor Rating & Review Content */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Đánh giá nhanh của bạn (*)
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Nhận xét thực tế / Review ngắn (*)
              </label>
              <textarea
                rows={2}
                placeholder="VD: Bác chủ quán thân thiện, cơm thêm miễn phí, đông vào tầm 12h trưa..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2.5 sticky bottom-0 bg-white/95 backdrop-blur-xs py-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setSurveyModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu dữ liệu...' : 'Lưu & Chấm Lên Bản Đồ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
