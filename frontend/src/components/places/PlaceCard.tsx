import React from 'react';
import type { Place } from '../../types/place';
import { useMapStore } from '../../stores/useMapStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { RatingStars } from '../common/RatingStars';
import { IconRenderer } from '../common/IconRenderer';
import {
  MapPin,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlaceCardProps {
  place: Place;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { flyToPlace, setSelectedPlace, setHoveredPlaceId, hoveredPlaceId } = useMapStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const isFav = isFavorite(place.id);
  const isHovered = hoveredPlaceId === place.id;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(place.id);
    if (!isFav) {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCardClick = () => {
    flyToPlace(place);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHoveredPlaceId(place.id)}
      onMouseLeave={() => setHoveredPlaceId(null)}
      className={`group bg-white rounded-3xl p-3.5 border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
        isHovered
          ? 'border-emerald-500 shadow-lg -translate-y-0.5 ring-2 ring-emerald-400/30'
          : 'border-emerald-100/80 hover:border-emerald-300 shadow-xs hover:shadow-md'
      }`}
    >
      <div>
        {/* Card Image Banner */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-gray-100 mb-3">
          <img
            src={place.photos[0]}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Category Floating Pill */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span
              className="text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs"
              style={{ backgroundColor: place.categoryColor }}
            >
              <IconRenderer name={place.iconName} size={12} />
              <span>{place.categoryLabel}</span>
            </span>
            {place.badgeText && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-1 rounded-full shadow-md">
                {place.badgeText}
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-md"
            title={isFav ? 'Bỏ lưu' : 'Lưu địa điểm'}
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
          </button>

          {/* Availability Badge */}
          {place.isAvailable !== undefined && (
            <div className="absolute bottom-2.5 left-2.5">
              {place.isAvailable ? (
                <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Còn phòng
                </span>
              ) : (
                <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Tạm hết phòng
                </span>
              )}
            </div>
          )}
        </div>

        {/* Name & Rating */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {place.name}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <RatingStars rating={place.rating} reviewCount={place.reviewCount} />
            {place.isVerified && (
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-1.5 py-0.2 rounded-sm inline-flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                Đã xác minh
              </span>
            )}
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {place.shortDescription}
          </p>
        </div>

        {/* Distance and Address */}
        <div className="mt-2.5 space-y-1 text-[11px] text-gray-700">
          <div className="flex items-center gap-1 text-emerald-800 font-bold">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Cách FPT: {place.distanceToFPT || 'Gần'}</span>
            {place.distanceToVNU && (
              <span className="text-gray-600 font-normal">
                • VNU: {place.distanceToVNU}
              </span>
            )}
          </div>
          <div className="truncate text-gray-600">
            {place.address}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {place.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-emerald-50 text-emerald-900 font-semibold px-2 py-0.5 rounded-md border border-emerald-200/60"
            >
              {tag}
            </span>
          ))}
          {place.tags.length > 3 && (
            <span className="text-[10px] text-gray-600 font-bold px-1 py-0.5">
              +{place.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Quick Action */}
      <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
        <div>
          {place.priceInfo ? (
            <div>
              <span className="text-[10px] text-gray-600 block">Giá tham khảo</span>
              <span className="font-extrabold text-sm text-amber-900">
                {place.priceInfo.amount.toLocaleString('vi-VN')}đ
                <span className="text-[11px] font-normal text-gray-700 ml-0.5">
                  /{place.priceInfo.unit}
                </span>
              </span>
            </div>
          ) : (
            <span className="text-xs font-bold text-gray-700">
              {place.openingHours || 'Mở cửa'}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPlace(place);
          }}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};
