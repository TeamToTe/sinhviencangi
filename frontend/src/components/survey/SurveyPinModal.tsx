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
  Navigation,
  Edit3,
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

export const SurveyPinModal: React.FC<SurveyPinModalProps> = ({ onPlaceCreated }) => {
  const {
    isSurveyModalOpen,
    setSurveyModalOpen,
    center,
    setCenter,
    setActiveTab,
    isPickingLocation,
    setIsPickingLocation,
  } = useMapStore();
  const { user } = useAuthStore();

  // Form State
  const [surveyor, setSurveyor] = useState<string>(() => {
    return localStorage.getItem('connecthub_surveyor') || SURVEYORS[0];
  });
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('food_drink');
  const [area, setArea] = useState('Tân Xã');
  const [address, setAddress] = useState('');

  // GPS State (Defaults to Hoa Lac center to ensure form is always ready)
  const [lat, setLat] = useState<number>(21.0185);
  const [lng, setLng] = useState<number>(105.5345);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsErrorMessage, setGpsErrorMessage] = useState<string>('');
  const [isManualCoordinates, setIsManualCoordinates] = useState(false);

  const locatingRef = useRef(false);

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

  // Immediate fallback to default Hoa Lac coordinates
  const handleUseDefaultCoords = () => {
    locatingRef.current = false;
    setLat(21.0185);
    setLng(105.5345);
    setArea('Tân Xã');
    setGpsStatus('idle');
    setIsManualCoordinates(false);
    setGpsErrorMessage('');
  };

  // Solution 1: Start picking location directly on the map
  const handleStartMapPick = () => {
    setActiveTab('map');
    if (lat && lng) {
      setCenter([lng, lat]);
    }
    setIsPickingLocation(true);
  };

  // Solution 1: Confirm picked map location
  const handleConfirmMapPick = async () => {
    const pickedLat = Number(center[1].toFixed(6));
    const pickedLng = Number(center[0].toFixed(6));
    setLat(pickedLat);
    setLng(pickedLng);
    setGpsStatus('success');
    setGpsAccuracy(5);
    setIsManualCoordinates(false);
    setIsPickingLocation(false);

    try {
      const detected = await placesService.detectArea(pickedLat, pickedLng);
      if (detected) setArea(detected);
    } catch {
      // ignore
    }
  };

  // Solution 3: Smart 2-Phase Geolocation (Low-Accuracy Network first, Satellite second)
  const requestGpsLocation = () => {
    if (locatingRef.current) return;

    if (!('geolocation' in navigator)) {
      setGpsStatus('error');
      setGpsErrorMessage('Trình duyệt không hỗ trợ GPS. Bạn hãy dùng tính năng "Chọn trên bản đồ".');
      setIsManualCoordinates(true);
      return;
    }

    locatingRef.current = true;
    setGpsStatus('locating');
    setGpsErrorMessage('');

    // Phase 1: Fast Low-Accuracy Network Call (Wi-Fi/Cell tower/IP - does not force satellite chip lock)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        locatingRef.current = false;
        const latitude = Number(pos.coords.latitude.toFixed(6));
        const longitude = Number(pos.coords.longitude.toFixed(6));
        const accuracy = Math.round(pos.coords.accuracy);

        setLat(latitude);
        setLng(longitude);
        setGpsAccuracy(accuracy);
        setGpsStatus('success');
        setIsManualCoordinates(false);

        try {
          const detected = await placesService.detectArea(latitude, longitude);
          if (detected) setArea(detected);
        } catch {
          // ignore
        }
      },
      (lowErr) => {
        console.warn('Low-accuracy geolocation failed, attempting satellite GPS...', lowErr);
        // Phase 2: Satellite High-Accuracy fallback
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            locatingRef.current = false;
            const latitude = Number(pos.coords.latitude.toFixed(6));
            const longitude = Number(pos.coords.longitude.toFixed(6));
            const accuracy = Math.round(pos.coords.accuracy);

            setLat(latitude);
            setLng(longitude);
            setGpsAccuracy(accuracy);
            setGpsStatus('success');
            setIsManualCoordinates(false);

            try {
              const detected = await placesService.detectArea(latitude, longitude);
              if (detected) setArea(detected);
            } catch {
              // ignore
            }
          },
          (highErr) => {
            locatingRef.current = false;
            setGpsStatus('error');
            if (highErr.code === 1) {
              setGpsErrorMessage('Quyền vị trí bị từ chối hoặc điện thoại đang tắt GPS. Bạn có thể bấm "Chọn trên bản đồ" để ghim điểm ngay!');
            } else if (highErr.code === 2) {
              setGpsErrorMessage('Chưa nhận được sóng GPS từ điện thoại. Hãy bấm "Chọn trên bản đồ" để ghim vị trí chuẩn xác nhất.');
            } else {
              setGpsErrorMessage('Quá thời gian kết nối GPS. Hãy bấm "Chọn trên bản đồ" để ghim điểm trực tiếp.');
            }
            setLat((prev) => prev || 21.0185);
            setLng((prev) => prev || 105.5345);
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000,
          }
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000,
      }
    );
  };

  // Keyboard Escape listener & Body scroll locking
  useEffect(() => {
    if (!isSurveyModalOpen) {
      locatingRef.current = false;
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPickingLocation) {
        setSurveyModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    if (!isPickingLocation) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isSurveyModalOpen, isPickingLocation]);

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

  // Solution 1: If user is actively picking coordinates on the map, render floating bottom dock
  if (isPickingLocation) {
    return (
      <div className="fixed bottom-5 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[10001] max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-emerald-500 p-3.5 sm:p-4 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-extrabold text-xs sm:text-sm text-gray-900 font-serif">
              📍 Chọn vị trí trên bản đồ
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {center[1].toFixed(5)}, {center[0].toFixed(5)}
          </span>
        </div>
        <p className="text-[11px] text-gray-600 mb-3 leading-relaxed">
          Kéo hoặc zoom bản đồ để <strong>tâm ghim</strong> nằm đúng vị trí địa điểm khảo sát, sau đó bấm <strong>Xác nhận</strong>.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleConfirmMapPick}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Xác nhận vị trí này</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPickingLocation(false)}
            className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200"
      onClick={() => setSurveyModalOpen(false)}
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
                  GPS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-sans truncate">
                Thu thập dữ liệu thực tế tại Hòa Lạc (ConnectHub - Nhóm 2)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSurveyModalOpen(false)}
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
            <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-emerald-950">
                    Tọa độ GPS vị trí thực tế (*)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleStartMapPick}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1.5 rounded-xl border border-amber-500 shadow-xs active:scale-95 transition-all cursor-pointer"
                    title="Chuyển sang bản đồ để chọn vị trí chính xác"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Chọn trên bản đồ</span>
                  </button>
                  <button
                    type="button"
                    onClick={requestGpsLocation}
                    disabled={gpsStatus === 'locating'}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
                    <span>{gpsStatus === 'locating' ? 'Đang dò GPS...' : 'Lấy vị trí GPS'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManualCoordinates(!isManualCoordinates)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white/80 hover:bg-white px-2 py-1.5 rounded-xl border border-emerald-300 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isManualCoordinates ? 'Dùng toạ độ' : 'Sửa tay'}</span>
                  </button>
                </div>
              </div>

              {/* GPS Feedback */}
              {gpsStatus === 'locating' && (
                <div className="flex items-center justify-between gap-2.5 text-xs text-emerald-800 bg-white/95 p-3 rounded-xl border border-emerald-200 shadow-xs flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="truncate">Đang kết nối chip GPS điện thoại...</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDefaultCoords}
                    className="shrink-0 px-2.5 py-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                  >
                    Bỏ qua GPS (Dùng Hòa Lạc)
                  </button>
                </div>
              )}

              {/* Coordinates display */}
              {lat !== null && lng !== null && !isManualCoordinates && (
                <div className="bg-white p-3 rounded-xl border border-emerald-300 text-xs text-gray-800 space-y-1.5">
                  <div className="flex items-center justify-between font-mono font-bold text-emerald-800 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      Lat: {lat.toFixed(5)}
                    </span>
                    <span>Lng: {lng.toFixed(5)}</span>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-1 pt-1 border-t border-gray-100 text-[11px] text-gray-600 font-sans">
                    <span>
                      Khu vực nhận diện: <strong className="text-emerald-900">{area}</strong>
                    </span>
                    {gpsAccuracy !== null && (
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                          gpsAccuracy <= 15
                            ? 'bg-emerald-100 text-emerald-800'
                            : gpsAccuracy <= 30
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        ±{gpsAccuracy}m {gpsAccuracy <= 15 ? '(Rất chuẩn)' : '(Khá tốt)'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Manual coordinate inputs */}
              {isManualCoordinates && (
                <div className="bg-white p-3 rounded-xl border border-emerald-300 space-y-2">
                  <p className="text-[11px] text-gray-600">
                    Nhập trực tiếp tọa độ (ví dụ quanh ĐH FPT Hòa Lạc: Lat 21.0135, Lng 105.5252):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Vĩ độ (Lat)</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={lat ?? 21.0185}
                        onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Kinh độ (Lng)</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={lng ?? 105.5345}
                        onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {gpsStatus === 'error' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{gpsErrorMessage}</span>
                  </p>
                  <p className="text-[11px] text-amber-950/80 leading-relaxed">
                    💡 <strong>Cách nhanh và chuẩn nhất:</strong> Hãy bấm <strong>"Chọn trên bản đồ"</strong> để di chuyển ghim trực tiếp đến địa điểm thực tế mà không cần lo lắng về GPS!
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={handleStartMapPick}
                      className="px-3 py-1.5 text-[11px] font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Chọn trên bản đồ ngay</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleUseDefaultCoords}
                      className="px-2.5 py-1.5 text-[11px] font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      Dùng tọa độ Hòa Lạc
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsManualCoordinates(true)}
                      className="px-2.5 py-1.5 text-[11px] font-bold bg-white text-emerald-800 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      Sửa tay
                    </button>
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
                onClick={() => setSurveyModalOpen(false)}
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
