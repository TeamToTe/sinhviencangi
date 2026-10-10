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
  Edit3,
  ArrowRight,
  Waves,
  Building2,
  Trees,
} from 'lucide-react';
import { useMapStore } from '../../stores/useMapStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { placesService } from '../../services/placesService';
import { resolveImageUrl } from '../../utils/imageUrl';
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

const HOA_LAC_LANDMARKS = [
  { name: 'ĐH FPT', lat: 21.0135, lng: 105.5252, icon: GraduationCap, area: 'Thạch Hòa' },
  { name: 'Hồ Tân Xã', lat: 21.0185, lng: 105.5345, icon: Waves, area: 'Tân Xã' },
  { name: 'KTX VNU', lat: 21.0162, lng: 105.5235, icon: GraduationCap, area: 'Thạch Hòa' },
  { name: 'Thạch Hòa', lat: 21.0145, lng: 105.5210, icon: Building2, area: 'Thạch Hòa' },
  { name: 'Bình Yên', lat: 21.0300, lng: 105.5100, icon: Trees, area: 'Bình Yên' },
];

export const SurveyPinModal: React.FC<SurveyPinModalProps> = ({ onPlaceCreated }) => {
  const {
    surveyStep,
    setSurveyStep,
    center,
    flyToCoordinates,
  } = useMapStore();
  const { user, isAuthenticated, isAdmin } = useAuthStore();

  // Form State
  const [surveyor, setSurveyor] = useState<string>(() => {
    return localStorage.getItem('connecthub_surveyor') || SURVEYORS[0];
  });
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('food_drink');
  const [area, setArea] = useState('Tân Xã');
  const [address, setAddress] = useState('');

  // Pinned Coordinates (Defaults to Hoa Lac center)
  const [lat, setLat] = useState<number>(21.0185);
  const [lng, setLng] = useState<number>(105.5345);
  const [detectedMapArea, setDetectedMapArea] = useState('Tân Xã');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsTip, setGpsTip] = useState('');
  const [isManualCoordinates, setIsManualCoordinates] = useState(false);

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

  // Auto-detect area dynamically when map moves in pin mode
  useEffect(() => {
    if (surveyStep === 'map_pin') {
      const curLat = center[1];
      const curLng = center[0];
      placesService
        .detectArea(curLat, curLng)
        .then((res) => {
          if (res) setDetectedMapArea(res);
        })
        .catch(() => {});
    }
  }, [center, surveyStep]);

  // Save selected surveyor to local storage
  const handleSurveyorChange = (val: string) => {
    setSurveyor(val);
    localStorage.setItem('connecthub_surveyor', val);
  };

  // Grab/Be GPS Quick Locate Button: Only called once when user taps the GPS button
  const handleLocateGps = () => {
    if (!('geolocation' in navigator)) {
      setGpsTip('Trình duyệt không hỗ trợ GPS');
      setTimeout(() => setGpsTip(''), 3000);
      return;
    }

    setIsLocatingGps(true);
    setGpsTip('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGps(false);
        const latitude = Number(pos.coords.latitude.toFixed(6));
        const longitude = Number(pos.coords.longitude.toFixed(6));
        flyToCoordinates(latitude, longitude, 17);
      },
      (err) => {
        setIsLocatingGps(false);
        console.warn('GPS single locate error:', err);
        setGpsTip('Không lấy được GPS từ điện thoại. Bạn hãy kéo bản đồ để đặt điểm nhé!');
        setTimeout(() => setGpsTip(''), 4500);
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 60000,
      }
    );
  };

  // Grab/Be Step 1 -> Step 2 transition: Lock coordinates and proceed to form
  const handleProceedToForm = () => {
    const finalLat = Number(center[1].toFixed(6));
    const finalLng = Number(center[0].toFixed(6));
    setLat(finalLat);
    setLng(finalLng);
    setArea(detectedMapArea);
    if (!address) {
      setAddress(`${detectedMapArea}, Thạch Thất, Hà Nội`);
    }
    setSurveyStep('form');
  };

  // 1-tap jump to prominent Hoa Lac spots
  const handleJumpToLandmark = (spot: (typeof HOA_LAC_LANDMARKS)[0]) => {
    flyToCoordinates(spot.lat, spot.lng, 17);
    setDetectedMapArea(spot.area);
  };

  // Keyboard Escape listener & Body scroll locking
  useEffect(() => {
    if (surveyStep === 'closed') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSurveyStep('closed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    if (surveyStep === 'form') {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [surveyStep]);

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
      setErrorMessage('Tọa độ GPS là bắt buộc! Hãy bấm "Lấy lại GPS" hoặc nhập tọa độ thủ công.');
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
        gpsAccuracy: undefined,
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
        setSurveyStep('closed');
      }, 1500);
    } catch (err: any) {
      console.error('Lỗi khi chấm địa điểm:', err);
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chỉ admin mới có quyền thực hiện chấm điểm khảo sát
  if (surveyStep === 'closed' || !isAuthenticated || !isAdmin) return null;

  // Step 1: Grab / Be Map Pinning Bottom Sheet
  if (surveyStep === 'map_pin') {
    return (
      <div className="fixed bottom-0 inset-x-0 z-[10001] p-3 sm:p-5 pointer-events-none">
        <div className="max-w-xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.18)] border-2 border-emerald-500/80 p-4 pointer-events-auto space-y-3 animate-in slide-in-from-bottom duration-300">
          {/* Mobile Handle Indicator */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto sm:hidden" />

          {/* Location Title & GPS Quick Locate */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Khu vực đang trỏ: <strong>{detectedMapArea}</strong></span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 truncate font-serif">
                {address || `${detectedMapArea}, Thạch Thất, Hà Nội`}
              </h3>
              <p className="font-mono text-[11px] text-gray-500 mt-0.5">
                Tọa độ: {center[1].toFixed(5)}, {center[0].toFixed(5)}
              </p>
            </div>

            {/* GPS Locate Button (Grab/Be Style - only runs when tapped) */}
            <button
              type="button"
              onClick={handleLocateGps}
              disabled={isLocatingGps}
              className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300 transition-all shadow-xs cursor-pointer"
              title="Nhảy tới vị trí GPS của tôi (nếu máy cho phép)"
            >
              <Crosshair className={`w-5 h-5 ${isLocatingGps ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>

          {/* Quick Landmark Jump Chips (1-tap to Hoa Lac spots) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs">
            <span className="text-[11px] text-gray-400 font-bold shrink-0">Đi nhanh:</span>
            {HOA_LAC_LANDMARKS.map((spot) => {
              const IconComp = spot.icon;
              return (
                <button
                  key={spot.name}
                  type="button"
                  onClick={() => handleJumpToLandmark(spot)}
                  className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <IconComp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{spot.name}</span>
                </button>
              );
            })}
          </div>

          {/* Friendly Toast Tip if GPS error occurred */}
          {gpsTip && (
            <div className="p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-[11px] flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{gpsTip}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleProceedToForm}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Xác nhận điểm & Nhập thông tin quán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSurveyStep('closed')}
              className="py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200"
      onClick={() => setSurveyStep('closed')}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-white w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-emerald-200 flex flex-col overflow-hidden animate-in fade-in sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Header (Fixed at top) */}
        <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
              <MapPin className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="font-extrabold text-sm sm:text-lg tracking-tight font-serif truncate">
                  Chấm Điểm Khảo Sát Thực Địa
                </h2>
                <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider">
                  Bản đồ
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-sans truncate">
                Thu thập dữ liệu thực tế tại Hòa Lạc (ConnectHub - Nhóm 2)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSurveyStep('closed')}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white flex items-center justify-center cursor-pointer shrink-0 ml-2"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Modal Body (Smoothly scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar">
            {/* Success Banner */}
            {submitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 animate-in fade-in">
                <Check className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Đã chấm địa điểm thành công!</p>
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

            {/* 1. Pinned Location Card (Grab / Be Style) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border-2 border-emerald-300 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase text-emerald-950 bg-emerald-200 px-2 py-0.5 rounded-full">
                        {area}
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {lat.toFixed(5)}, {lng.toFixed(5)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-700 truncate mt-0.5">
                      {address || `${area}, Thạch Thất, Hà Nội`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSurveyStep('map_pin')}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Quay lại bản đồ để đổi vị trí điểm ghim"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Chỉnh trên bản đồ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManualCoordinates(!isManualCoordinates)}
                    className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 text-xs transition-colors cursor-pointer"
                    title="Nhập số tọa độ thủ công"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Optional manual coordinate fine-tuning */}
              {isManualCoordinates && (
                <div className="pt-2 border-t border-emerald-200 grid grid-cols-2 gap-2 animate-in fade-in">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Vĩ độ (Lat)</label>
                    <input
                      type="number"
                      step="0.00001"
                      value={lat ?? 21.0185}
                      onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Kinh độ (Lng)</label>
                    <input
                      type="number"
                      step="0.00001"
                      value={lng ?? 105.5345}
                      onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Surveyor & Place Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Người thực hiện khảo sát (*)
                </label>
                <select
                  value={surveyor}
                  onChange={(e) => handleSurveyorChange(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                  placeholder="VD: Quán Cơm Tấm K18, Happy House Tân Xã..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                placeholder="VD: Số 20 Ngõ 3 Thôn 2 Tân Xã, Thạch Thất, Hà Nội"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* 5. Pricing (Category-sensitive) */}
            {category === 'boarding_house' ? (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3">
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
                      className="w-full px-2.5 py-2 sm:py-1.5 rounded-lg border border-gray-300 bg-white text-sm sm:text-xs"
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
                      className="w-full px-2.5 py-2 sm:py-1.5 rounded-lg border border-gray-300 bg-white text-sm sm:text-xs"
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
                      className="w-full px-2.5 py-2 sm:py-1.5 rounded-lg border border-gray-300 bg-white text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Tình trạng
                    </label>
                    <select
                      value={roomStatus}
                      onChange={(e) => setRoomStatus(e.target.value as any)}
                      className="w-full px-2.5 py-2 sm:py-1.5 rounded-lg border border-gray-300 bg-white text-sm sm:text-xs"
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
                    className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium"
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
                    className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium"
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
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium"
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
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium"
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
                      className={`flex items-center gap-2 p-2.5 sm:p-2 rounded-xl text-xs sm:text-[11px] font-medium text-left border transition-all cursor-pointer ${
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
                    <img src={resolveImageUrl(src)} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
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
                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-100/50 flex flex-col items-center justify-center gap-1 text-emerald-700 transition-all cursor-pointer active:scale-95"
                  >
                    <Camera className="w-5 h-5 text-emerald-600" />
                    <span className="text-[10px] font-bold">Chụp / Chọn</span>
                  </button>
                )}
              </div>
            </div>

            {/* 9. Surveyor Rating & Review Content */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5">
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
                      className="p-1 cursor-pointer active:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
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
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-gray-300 bg-white text-sm sm:text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Modal Footer Action Bar (Fixed at bottom) */}
          <div className="shrink-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 shadow-lg">
            <div className="text-[11px] text-gray-500 hidden sm:flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Khảo sát bởi: <strong className="text-gray-700">{surveyor}</strong></span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setSurveyStep('closed')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className="flex-2 sm:flex-initial flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang lưu...' : 'Lưu & Chấm Lên Bản Đồ'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
