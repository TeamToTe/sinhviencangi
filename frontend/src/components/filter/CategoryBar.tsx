import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../../data/mockPlaces';
import { useFilterStore } from '../../stores/useFilterStore';
import { IconRenderer } from '../common/IconRenderer';
import type { PlaceCategory } from '../../types/place';
import {
  ChevronDown,
  Check,
  RotateCcw,
  Sparkles,
  MapPin,
  CircleDollarSign,
  Layers,
  ArrowUpDown,
  Home,
} from 'lucide-react';

const AREAS = [
  { id: 'all', label: 'Tất cả khu vực' },
  { id: 'Tân Xã', label: 'Hồ Tân Xã' },
  { id: 'Thạch Hòa', label: 'Thạch Hòa / Cổng 3' },
  { id: 'Bình Yên', label: 'Bình Yên' },
  { id: 'Khu CNC Hòa Lạc', label: 'Khu CNC FPT' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá', min: undefined, max: undefined },
  { id: 'under_2m', label: 'Dưới 2.000.000đ', min: 0, max: 2000000 },
  { id: '2m_3m5', label: '2.000.000đ - 3.500.000đ', min: 2000000, max: 3500000 },
  { id: '3m5_5m', label: '3.500.000đ - 5.000.000đ', min: 3500000, max: 5000000 },
  { id: 'over_5m', label: 'Trên 5.000.000đ', min: 5000000, max: undefined },
];

const AMENITY_TAGS = [
  'Có điều hòa',
  'Gác xép cao',
  'Thang máy',
  'Khóa vân tay',
  'Vệ sinh khép kín',
  'Không chung chủ',
  'Free Wifi',
  'Ban công thoáng',
  'Bình nóng lạnh',
  'Tủ lạnh riêng',
];

const SORT_OPTIONS: { id: 'rating' | 'price_asc' | 'price_desc' | 'distance'; label: string }[] = [
  { id: 'rating', label: 'Đánh giá cao nhất' },
  { id: 'price_asc', label: 'Giá: Thấp đến Cao' },
  { id: 'price_desc', label: 'Giá: Cao đến Thấp' },
  { id: 'distance', label: 'Gần FPT/VNU nhất' },
];

export const CategoryBar: React.FC = () => {
  const {
    category,
    setCategory,
    area,
    setArea,
    minPrice,
    maxPrice,
    setPriceRange,
    tags,
    toggleTag,
    onlyAvailable,
    setOnlyAvailable,
    sortBy,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Label calculation
  const currentCategory = CATEGORIES.find((c) => c.id === category);
  const categoryLabel = category === 'all' ? 'Tất cả danh mục' : (currentCategory?.label || 'Danh mục');

  const currentArea = AREAS.find((a) => a.id === area);
  const areaLabel = area === 'all' ? 'Tất cả khu vực' : `Khu vực: ${currentArea?.label || area}`;

  let priceLabel = 'Tất cả mức giá';
  if (minPrice === 0 && maxPrice === 2000000) priceLabel = 'Giá: < 2 triệu';
  else if (minPrice === 2000000 && maxPrice === 3500000) priceLabel = 'Giá: 2 - 3.5 triệu';
  else if (minPrice === 3500000 && maxPrice === 5000000) priceLabel = 'Giá: 3.5 - 5 triệu';
  else if (minPrice === 5000000) priceLabel = 'Giá: > 5 triệu';
  else if (minPrice || maxPrice) priceLabel = `Giá đã lọc`;

  const tagsLabel = tags && tags.length > 0 ? `Tiện ích (${tags.length})` : 'Tiện ích';

  const currentSort = SORT_OPTIONS.find((s) => s.id === sortBy);
  const sortLabel = `Sắp xếp: ${currentSort?.label || 'Mặc định'}`;

  const hasActiveFilters =
    category !== 'all' ||
    area !== 'all' ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    (tags && tags.length > 0) ||
    onlyAvailable ||
    sortBy !== 'rating';

  return (
    <div
      ref={containerRef}
      className="bg-white/90 backdrop-blur-md border border-white/80 shadow-lg shadow-emerald-950/10 rounded-2xl p-1.5 flex items-center gap-1.5 relative z-[1010] select-none overflow-visible max-w-full"
    >
      {/* 1. Category Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => toggleDropdown('category')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs ${
            category !== 'all'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
              : 'bg-white/90 hover:bg-white text-emerald-950 border-emerald-200/80 hover:border-emerald-300'
          }`}
        >
          {category !== 'all' && currentCategory ? (
            <IconRenderer name={currentCategory.icon} size={14} />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span>{categoryLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeDropdown === 'category' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {activeDropdown === 'category' && (
          <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-1.5 z-[1050] animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setCategory('all');
                setActiveDropdown(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium hover:bg-emerald-50 transition-colors text-left cursor-pointer ${
                category === 'all' ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Tất cả danh mục</span>
              </div>
              {category === 'all' && <Check className="w-4 h-4 text-emerald-600" />}
            </button>

            <div className="h-px bg-gray-100 my-1" />

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id as PlaceCategory);
                  setActiveDropdown(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs hover:bg-emerald-50 transition-colors text-left cursor-pointer ${
                  category === cat.id ? 'text-emerald-800 font-bold bg-emerald-50/60' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: cat.color }}
                  >
                    <IconRenderer name={cat.icon} size={12} />
                  </div>
                  <span>{cat.label}</span>
                </div>
                {category === cat.id && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Area Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => toggleDropdown('area')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs ${
            area !== 'all'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
              : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
          }`}
        >
          <MapPin className={`w-3.5 h-3.5 ${area !== 'all' ? 'text-white' : 'text-emerald-600'}`} />
          <span>{areaLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeDropdown === 'area' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {activeDropdown === 'area' && (
          <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-1.5 z-[1050] animate-in fade-in zoom-in-95 duration-150">
            {AREAS.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setArea(a.id);
                  setActiveDropdown(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-emerald-50 transition-colors text-left cursor-pointer ${
                  area === a.id ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-gray-700'
                }`}
              >
                <span>{a.label}</span>
                {area === a.id && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Price Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => toggleDropdown('price')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs ${
            minPrice !== undefined || maxPrice !== undefined
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
              : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
          }`}
        >
          <CircleDollarSign
            className={`w-3.5 h-3.5 ${
              minPrice !== undefined || maxPrice !== undefined ? 'text-white' : 'text-emerald-600'
            }`}
          />
          <span>{priceLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeDropdown === 'price' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {activeDropdown === 'price' && (
          <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-1.5 z-[1050] animate-in fade-in zoom-in-95 duration-150">
            {PRICE_RANGES.map((pr) => {
              const isSelected = minPrice === pr.min && maxPrice === pr.max;
              return (
                <button
                  key={pr.id}
                  onClick={() => {
                    setPriceRange(pr.min, pr.max);
                    setActiveDropdown(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-emerald-50 transition-colors text-left cursor-pointer ${
                    isSelected ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-gray-700'
                  }`}
                >
                  <span>{pr.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Amenities / Tags Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => toggleDropdown('tags')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs ${
            tags && tags.length > 0
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
              : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
          }`}
        >
          <Layers className={`w-3.5 h-3.5 ${tags && tags.length > 0 ? 'text-white' : 'text-emerald-600'}`} />
          <span>{tagsLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeDropdown === 'tags' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {activeDropdown === 'tags' && (
          <div className="absolute left-0 top-full mt-2 w-68 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-2 z-[1050] max-h-72 overflow-y-auto custom-scrollbar space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Chọn tiện ích phòng trọ
            </div>
            {AMENITY_TAGS.map((t) => {
              const isSelected = tags?.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs hover:bg-emerald-50 transition-colors text-left cursor-pointer ${
                    isSelected ? 'text-emerald-800 font-bold bg-emerald-50' : 'text-gray-700'
                  }`}
                >
                  <span>{t}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Sort By Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => toggleDropdown('sort')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs ${
            sortBy !== 'rating'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
              : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
          }`}
        >
          <ArrowUpDown className={`w-3.5 h-3.5 ${sortBy !== 'rating' ? 'text-white' : 'text-emerald-600'}`} />
          <span>{sortLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeDropdown === 'sort' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {activeDropdown === 'sort' && (
          <div className="absolute right-0 sm:left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-1.5 z-[1050] animate-in fade-in zoom-in-95 duration-150">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSortBy(opt.id);
                  setActiveDropdown(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-emerald-50 transition-colors text-left cursor-pointer ${
                  sortBy === opt.id ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-gray-700'
                }`}
              >
                <span>{opt.label}</span>
                {sortBy === opt.id && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6. Only Available Toggle Pill */}
      <button
        onClick={() => setOnlyAvailable(!onlyAvailable)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer shadow-xs ${
          onlyAvailable
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
            : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Còn phòng</span>
      </button>

      {/* 7. Reset Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            resetFilters();
            setActiveDropdown(null);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0 cursor-pointer shadow-xs"
          title="Đặt lại toàn bộ bộ lọc"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa lọc</span>
        </button>
      )}
    </div>
  );
};
