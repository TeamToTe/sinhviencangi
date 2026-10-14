import React, { useState } from 'react';
import { useMapStore } from '../../stores/useMapStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { placesService } from '../../services/placesService';
import { RatingStars } from '../common/RatingStars';
import { IconRenderer } from '../common/IconRenderer';
import {
  X,
  MapPin,
  Heart,
  Phone,
  MessageCircle,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Send,
  Zap,
  Droplet,
  Wifi,
  DollarSign,
  Sparkles,
  Trash2,
  LoaderCircle,
  Bike,
  CarFront,
  Camera,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { resolveImageUrl, FALLBACK_PLACE_IMAGE } from '../../utils/imageUrl';
import { getCategoryUnit } from '../../utils/priceUtils';
import { useAuthStore } from '../../stores/useAuthStore';
import { getRoute } from '../../services/routingService';
import { uploadReviewImages, uploadReviewImage, validateImageFile } from '../../services/storageService';
import type { RouteVehicle } from '../../stores/useMapStore';

function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return minutes < 60 ? `${minutes} phút` : `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`;
}

const DEFAULT_ROUTE_ORIGIN: [number, number] = [105.5252, 21.0135];

export const PlaceDetailDrawer: React.FC = () => {
  const {
    selectedPlace,
    route,
    routeStatus,
    routeError,
    setSelectedPlace,
    setReportModal,
    setRoute,
    setRouteStatus,
    clearRoute,
  } = useMapStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isAdmin } = useAuthStore();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewBatch, setReviewBatch] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState<string[]>([]);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const reviewFileInputRef = React.useRef<HTMLInputElement>(null);
  const coverFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUpdatingCover, setIsUpdatingCover] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpeningDirections, setIsOpeningDirections] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<RouteVehicle>('motorcycle');

  const handleUpdateCoverPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPlace) return;

    const check = validateImageFile(file);
    if (!check.valid) {
      alert(check.error);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
      return;
    }

    setIsUpdatingCover(true);
    try {
      const uploadRes = await uploadReviewImage(file, selectedPlace.id, 'reviews');
      const updated = await placesService.updateCoverPhoto(selectedPlace.id, uploadRes.url);

      const newPhotos = updated?.photos || [uploadRes.url, ...(selectedPlace.photos.length > 1 ? selectedPlace.photos.slice(1) : [])];
      setSelectedPlace({
        ...selectedPlace,
        photos: newPhotos,
      });
      alert('Đã cập nhật ảnh bìa thành công!');
    } catch (err: any) {
      console.error('[PlaceDetailDrawer] Failed to update cover photo:', err);
      alert(`Không thể cập nhật ảnh bìa: ${err.message || 'Lỗi hệ thống'}`);
    } finally {
      setIsUpdatingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  const handleSelectReviewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remainingSlots = 3 - reviewImages.length;
    if (remainingSlots <= 0) {
      alert('Tối đa 3 ảnh cho mỗi đánh giá!');
      return;
    }
    const incomingFiles = Array.from(files).slice(0, remainingSlots);
    const validFiles: File[] = [];

    for (const file of incomingFiles) {
      const check = validateImageFile(file);
      if (!check.valid) {
        alert(check.error);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      if (reviewFileInputRef.current) reviewFileInputRef.current.value = '';
      return;
    }

    const newFiles = [...reviewImages, ...validFiles];
    setReviewImages(newFiles);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setReviewImagePreviews((prev) => [...prev, ...newPreviews]);
    if (reviewFileInputRef.current) {
      reviewFileInputRef.current.value = '';
    }
  };

  const handleRemoveReviewImage = (index: number) => {
    URL.revokeObjectURL(reviewImagePreviews[index]);
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
    setReviewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeletePlace = async () => {
    if (!selectedPlace) return;
    if (!window.confirm(`Xác nhận xóa vĩnh viễn địa điểm "${selectedPlace.name}"? Thao tác này chỉ dành cho Admin.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await placesService.deletePlace(selectedPlace.id);
      alert('Đã xóa địa điểm thành công!');
      setSelectedPlace(null);
      window.location.reload();
    } catch (err: any) {
      alert(`Không thể xóa địa điểm: ${err.message || 'Lỗi hệ thống'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!selectedPlace) return null;

  const isFav = isFavorite(selectedPlace.id);
  const isRouteForSelectedPlace =
    route?.destination[0] === selectedPlace.coordinates.lng &&
    route?.destination[1] === selectedPlace.coordinates.lat;

  const handleFavorite = () => {
    toggleFavorite(selectedPlace.id);
    if (!isFav) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleOpenDirections = (vehicle: RouteVehicle) => {
    setSelectedVehicle(vehicle);
    const destination: [number, number] = [
      selectedPlace.coordinates.lng,
      selectedPlace.coordinates.lat,
    ];
    const fallbackOrigin = DEFAULT_ROUTE_ORIGIN;

    const loadRoute = async (origin: [number, number]) => {
      setIsOpeningDirections(true);
      setRouteStatus('loading');
      try {
        const nextRoute = await getRoute(origin, destination, vehicle);
        setRoute(nextRoute);
      } catch (error) {
        setRouteStatus(
          'error',
          error instanceof Error ? error.message : 'Không thể tìm tuyến đường.'
        );
      } finally {
        setIsOpeningDirections(false);
      }
    };

    if (!navigator.geolocation) {
      void loadRoute(fallbackOrigin);
      return;
    }

    setIsOpeningDirections(true);
    setRouteStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadRoute([position.coords.longitude, position.coords.latitude]);
      },
      () => {
        void loadRoute(fallbackOrigin);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedPlace.name,
        text: selectedPlace.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết địa điểm!');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setIsSubmittingReview(true);
    setUploadProgressText(reviewImages.length > 0 ? 'Đang nén & tải ảnh lên Supabase...' : '');
    try {
      let uploadedUrls: string[] = [];
      if (reviewImages.length > 0) {
        const results = await uploadReviewImages(
          reviewImages,
          selectedPlace.id,
          (cur, total) => setUploadProgressText(`Đang tải ảnh ${cur}/${total}...`)
        );
        uploadedUrls = results.map((r) => r.url);
      }

      const createdReview = await placesService.addReview({
        placeId: selectedPlace.id,
        authorName: reviewName,
        studentBatch: reviewBatch || 'K18 FPTU',
        rating: reviewRating,
        comment: reviewComment,
        images: uploadedUrls,
      });

      // Update place in local state immediately so user sees their review and photos
      setSelectedPlace({
        ...selectedPlace,
        reviews: [createdReview, ...(selectedPlace.reviews || [])],
        reviewCount: (selectedPlace.reviewCount || selectedPlace.reviews.length) + 1,
      });

      setReviewSuccessMsg('Cảm ơn bạn! Đánh giá đã được thêm thành công.');
      setReviewComment('');
      setReviewName('');
      setReviewImages([]);
      setReviewImagePreviews([]);
      setTimeout(() => setReviewSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      alert(`Không thể gửi đánh giá: ${err.message || 'Lỗi hệ thống'}`);
    } finally {
      setIsSubmittingReview(false);
      setUploadProgressText('');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={() => setSelectedPlace(null)}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[2040] md:hidden animate-in fade-in duration-200"
      />

      {/* Detail Panel: Bottom Sheet on Mobile, Right Panel on Desktop */}
      <div className="fixed inset-x-0 bottom-0 top-[15%] sm:top-[10%] md:relative md:inset-auto md:top-auto md:bottom-auto w-full md:w-[380px] lg:w-[430px] h-[85%] sm:h-[90%] md:h-full bg-white rounded-t-3xl md:rounded-none border-t md:border-t-0 md:border-l border-emerald-200/80 flex flex-col shrink-0 z-[2050] shadow-2xl md:shadow-none animate-in slide-in-from-bottom md:slide-in-from-right duration-300 overflow-hidden">
        {/* Mobile Drag Indicator */}
        <div className="pt-2 pb-1 bg-emerald-50/70 flex justify-center md:hidden shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Panel Header */}
        <div className="p-3 sm:p-3.5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedPlace.categoryColor }}
            />
            <span className="text-xs font-black uppercase text-emerald-950 tracking-wider">
              {selectedPlace.categoryLabel}
            </span>
            {selectedPlace.badgeText && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                {selectedPlace.badgeText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isAdmin && (
              <button
                onClick={handleDeletePlace}
                disabled={isDeleting}
                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                title="Xóa vĩnh viễn địa điểm này (Admin)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl hover:bg-white text-gray-500 hover:text-gray-800 transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
              title="Chia sẻ"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleFavorite}
              className="p-1.5 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
              title="Lưu yêu thích"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFav ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
            <button
              onClick={() => setSelectedPlace(null)}
              className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors ml-1 cursor-pointer"
              title="Đóng bảng chi tiết"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-sm text-gray-700 custom-scrollbar">
          {/* Photo Gallery */}
          <div className="space-y-2">
            <div className="w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-gray-100 shadow-inner relative group">
              <img
                src={resolveImageUrl(selectedPlace.photos[activePhotoIdx] || selectedPlace.photos[0])}
                alt={selectedPlace.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_PLACE_IMAGE;
                }}
                className="w-full h-full object-cover"
              />

              {/* Admin Change Cover Photo Button */}
              {isAdmin && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,image/avif"
                    className="hidden"
                    onChange={handleUpdateCoverPhoto}
                  />
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    disabled={isUpdatingCover}
                    className="px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-lg border border-white/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                    title="Admin: Cập nhật ảnh bìa địa điểm"
                  >
                    {isUpdatingCover ? (
                      <>
                        <LoaderCircle className="w-3.5 h-3.5 animate-spin text-lime-400" />
                        <span>Đang tải...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5 text-lime-400" />
                        <span>Đổi ảnh bìa</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {selectedPlace.isAvailable !== undefined && (
                <span
                  className={`absolute bottom-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-md shadow-md ${
                    selectedPlace.isAvailable ? 'bg-emerald-600/90' : 'bg-red-600/90'
                  }`}
                >
                  {selectedPlace.isAvailable ? '● Còn phòng trống' : '● Tạm hết phòng'}
                </span>
              )}
            </div>

            {selectedPlace.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
                {selectedPlace.photos.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === idx
                        ? 'border-emerald-500 ring-2 ring-emerald-300'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={resolveImageUrl(img)}
                      alt="thumb"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_PLACE_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Rating & Distance */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
              {selectedPlace.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2.5">
              <RatingStars
                rating={selectedPlace.rating}
                reviewCount={selectedPlace.reviewCount}
                size={15}
              />
              {selectedPlace.isVerified && (
                <span className="text-[11px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  Xác thực sinh viên
                </span>
              )}
            </div>

            <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-200/60 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{selectedPlace.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 pl-5">
                <span>Cách FPT: <strong>{selectedPlace.distanceToFPT || 'Rất gần'}</strong></span>
                {selectedPlace.distanceToVNU && (
                  <span>Cách VNU: <strong>{selectedPlace.distanceToVNU}</strong></span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons (Call, Zalo, Directions) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {selectedPlace.phone ? (
              <a
                href={`tel:${selectedPlace.phone}`}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
              >
                <Phone className="w-4 h-4 mb-1" />
                <span>Gọi điện</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gray-100 text-gray-400 font-bold text-xs">
                <Phone className="w-4 h-4 mb-1" />
                <span>Chưa có SĐT</span>
              </div>
            )}

            {selectedPlace.zaloPhone ? (
              <a
                href={`https://zalo.me/${selectedPlace.zaloPhone}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20"
              >
                <MessageCircle className="w-4 h-4 mb-1" />
                <span>Nhắn Zalo</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gray-100 text-gray-400 font-bold text-xs">
                <MessageCircle className="w-4 h-4 mb-1" />
                <span>Không có Zalo</span>
              </div>
            )}

            <button
              onClick={() => handleOpenDirections('motorcycle')}
              disabled={isOpeningDirections}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-white font-bold text-xs transition-all shadow-md disabled:cursor-wait ${
                selectedVehicle === 'motorcycle' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-700 hover:bg-slate-800'
              } disabled:bg-orange-300`}
              title="Ưu tiên đường không vào cao tốc"
            >
              {isOpeningDirections && selectedVehicle === 'motorcycle' ? (
                <LoaderCircle className="w-4 h-4 mb-1 animate-spin" />
              ) : (
                <Bike className="w-4 h-4 mb-1" />
              )}
              <span>Xe máy</span>
            </button>
            <button
              onClick={() => handleOpenDirections('car')}
              disabled={isOpeningDirections}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-white font-bold text-xs transition-all shadow-md disabled:cursor-wait ${
                selectedVehicle === 'car' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-700 hover:bg-slate-800'
              } disabled:bg-orange-300`}
              title="Tính tuyến đường dành cho ô tô"
            >
              {isOpeningDirections && selectedVehicle === 'car' ? (
                <LoaderCircle className="w-4 h-4 mb-1 animate-spin" />
              ) : (
                <CarFront className="w-4 h-4 mb-1" />
              )}
              <span>Ô tô</span>
            </button>
          </div>

          {isRouteForSelectedPlace && routeStatus === 'ready' && route && (
            <div className="rounded-2xl bg-orange-50 border border-orange-200 p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-orange-800">Tuyến đường đang hiển thị</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">
                  {formatDistance(route.distanceMeters)} · {formatDuration(route.durationSeconds)}
                </p>
              </div>
              <button
                onClick={clearRoute}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-orange-200 text-orange-700 text-[11px] font-bold hover:bg-orange-100 transition-colors cursor-pointer"
              >
                Xóa tuyến
              </button>
            </div>
          )}

          {routeStatus === 'error' && routeError && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
              {routeError}
            </div>
          )}

          {/* Price Info Breakdown (If available) */}
          {selectedPlace.priceInfo && (
            <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  {selectedPlace.category === 'boarding_house' ? 'Giá phòng & Chi phí' : 'Bảng giá tham khảo'}
                </span>
                <span className="text-sm font-black text-amber-950">
                  {selectedPlace.priceInfo.amount.toLocaleString('vi-VN')}đ
                  <span className="text-xs font-normal text-gray-700">
                    /{getCategoryUnit(selectedPlace.category, selectedPlace.priceInfo.unit)}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-amber-200/60">
                {selectedPlace.priceInfo.electricity && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Điện: <strong>{selectedPlace.priceInfo.electricity.toLocaleString('vi-VN')}đ</strong></span>
                  </div>
                )}
                {selectedPlace.priceInfo.water && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Droplet className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nước: <strong>{selectedPlace.priceInfo.water.toLocaleString('vi-VN')}đ</strong></span>
                  </div>
                )}
                {selectedPlace.priceInfo.internet && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Wifi className="w-3.5 h-3.5 text-purple-600" />
                    <span>Mạng: <strong>{selectedPlace.priceInfo.internet.toLocaleString('vi-VN')}đ</strong></span>
                  </div>
                )}
                {selectedPlace.priceInfo.serviceFee && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dịch vụ: <strong>{selectedPlace.priceInfo.serviceFee.toLocaleString('vi-VN')}đ</strong></span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Description */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-xs sm:text-sm text-gray-900">Giới thiệu chi tiết</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {selectedPlace.fullDescription}
            </p>
          </div>

          {/* Amenities List */}
          {selectedPlace.amenities && selectedPlace.amenities.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-gray-900">Tiện nghi</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedPlace.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-700"
                  >
                    <IconRenderer name={item.icon} className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-xs sm:text-sm text-gray-900">Từ khóa</h3>
            <div className="flex flex-wrap gap-1">
              {selectedPlace.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-emerald-100/70 text-emerald-900 font-bold px-2.5 py-0.5 rounded-lg border border-emerald-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs sm:text-sm text-gray-900">
                Đánh giá sinh viên ({selectedPlace.reviews.length})
              </h3>
              <RatingStars rating={selectedPlace.rating} size={13} />
            </div>

            {/* Review List */}
            <div className="space-y-2.5">
              {selectedPlace.reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center">
                        {r.authorName[0]}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">
                          {r.authorName}
                        </span>
                        {r.studentBatch && (
                          <span className="text-[10px] text-emerald-700 font-medium">
                            {r.studentBatch}
                          </span>
                        )}
                      </div>
                    </div>
                    <RatingStars rating={r.rating} size={11} showText={false} />
                  </div>
                  <p className="text-xs text-gray-600 pl-8">{r.comment}</p>
                  {r.images && r.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 pl-8">
                      {r.images.map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          onClick={() => setPreviewModalImage(resolveImageUrl(imgUrl))}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 hover:ring-2 hover:ring-emerald-500 transition-all bg-gray-100 relative group shadow-2xs"
                        >
                          <img
                            src={resolveImageUrl(imgUrl)}
                            alt={`Ảnh review ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = FALLBACK_PLACE_IMAGE;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="bg-emerald-50/40 rounded-2xl p-3.5 border border-emerald-100 space-y-2.5">
              <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Viết đánh giá
              </h4>

              {reviewSuccessMsg && (
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {reviewSuccessMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tên *"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-hidden focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Khóa (K18 FPTU)"
                  value={reviewBatch}
                  onChange={(e) => setReviewBatch(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">Chấm điểm:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-amber-400 text-base cursor-pointer"
                    >
                      {star <= reviewRating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Trải nghiệm của bạn..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={2}
                required
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-hidden focus:border-emerald-500"
              />

              {/* Photo Upload for Review */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    Thêm ảnh thực tế (tối đa 3 ảnh):
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-1.5 py-0.5 rounded-md">
                    Tối đa 5MB • Nén WebP
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {reviewImagePreviews.map((previewUrl, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shadow-xs group">
                      <img src={previewUrl} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveReviewImage(idx)}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {reviewImages.length < 3 && (
                    <button
                      type="button"
                      onClick={() => reviewFileInputRef.current?.click()}
                      className="w-14 h-14 rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 flex flex-col items-center justify-center text-emerald-600 transition-all cursor-pointer"
                      title="Chọn ảnh chụp"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-0.5">Thêm ảnh</span>
                    </button>
                  )}
                  <input
                    ref={reviewFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,image/avif"
                    multiple
                    className="hidden"
                    onChange={handleSelectReviewImages}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-70"
              >
                {isSubmittingReview ? (
                  <>
                    <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                    <span>{uploadProgressText || 'Đang gửi...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi đánh giá</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Report Button & Admin Actions */}
          <div className="pt-1 flex flex-col items-center gap-2">
            <button
              onClick={() => setReportModal(true, selectedPlace.id)}
              className="text-xs text-red-700 hover:text-red-900 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Báo sai thông tin</span>
            </button>

            {isAdmin ? (
              <button
                onClick={handleDeletePlace}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn địa điểm (Admin)'}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewModalImage}
              alt="Ảnh đánh giá phóng to"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
              title="Đóng xem ảnh"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
