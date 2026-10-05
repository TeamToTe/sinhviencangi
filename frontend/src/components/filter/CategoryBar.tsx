import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CATEGORIES } from '../../data/mockPlaces';
import { useFilterStore } from '../../stores/useFilterStore';
import { IconRenderer } from '../common/IconRenderer';
import type { PlaceCategory } from '../../types/place';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [category, area, minPrice, maxPrice, tags, onlyAvailable, sortBy]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isMouseDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
      setIsDragging(true);
      containerRef.current.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setTimeout(() => {
      hasMovedRef.current = false;
      setIsDragging(false);
    }, 50);
  };

  const handleScrollBy = (offset: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handlePillClick = (name: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasMovedRef.current) return;
    e.stopPropagation();
    if (activeDropdown === name) {
      setActiveDropdown(null);
      setAnchorRect(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setAnchorRect(rect);
      setActiveDropdown(name);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setActiveDropdown(null);
        setAnchorRect(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close or adjust on window scroll or resize
  useEffect(() => {
    if (!activeDropdown) return;

    const handleScrollOrResize = () => {
      setActiveDropdown(null);
      setAnchorRect(null);
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [activeDropdown]);

  // Label calculations
  const currentCategory = CATEGORIES.find((c) => c.id === category);
  const categoryLabel = category === 'all' ? 'Tất cả danh mục' : (currentCategory?.label || 'Danh mục');

  const currentArea = AREAS.find((a) => a.id === area);
  const areaLabel = area === 'all' ? 'Tất cả khu vực' : `Khu vực: ${currentArea?.label || area}`;

  let priceLabel = 'Tất cả mức giá';
  if (minPrice === 0 && maxPrice === 2000000) priceLabel = 'Giá: < 2 triệu';
  else if (minPrice === 2000000 && maxPrice === 3500000) priceLabel = 'Giá: 2 - 3.5 triệu';
  else if (minPrice === 3500000 && maxPrice === 5000000) priceLabel = 'Giá: 3.5 - 5 triệu';
  else if (minPrice === 5000000) priceLabel = 'Giá: > 5 triệu';
  else if (minPrice !== undefined || maxPrice !== undefined) priceLabel = `Giá đã lọc`;

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

  const getDesktopPopoverStyle = (): React.CSSProperties => {
    if (!anchorRect) return { display: 'none' };
    const popoverWidth = activeDropdown === 'tags' ? 280 : 256;
    const gap = 8;
    const top = anchorRect.bottom + gap;
    let left = anchorRect.left;

    if (left + popoverWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - popoverWidth - 16);
    }
    if (left < 16) {
      left = 16;
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`,
      zIndex: 99999,
    };
  };

  return (
    <>
      {/* Outer Wrapper with Left/Right Arrows */}
      <div className="relative flex items-center max-w-full group/bar">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScrollBy(-140)}
            className="hidden sm:flex absolute -left-3 z-[1020] w-7 h-7 rounded-full bg-white text-emerald-900 shadow-md border border-emerald-200 items-center justify-center hover:bg-emerald-50 hover:scale-105 transition-all cursor-pointer"
            title="Cuộn sang trái"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable Pill Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`bg-white/95 backdrop-blur-md border border-white/80 shadow-lg shadow-emerald-950/10 rounded-2xl p-1.5 flex items-center gap-1.5 relative z-[1010] select-none max-w-full overflow-x-auto no-scrollbar scroll-smooth touch-pan-x ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab sm:cursor-default'
          }`}
        >
          {/* 1. Category Dropdown Button */}
          <button
            onClick={(e) => handlePillClick('category', e)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs whitespace-nowrap shrink-0 ${
              category !== 'all' || activeDropdown === 'category'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
                : 'bg-white/90 hover:bg-white text-emerald-950 border-emerald-200/80 hover:border-emerald-300'
            }`}
          >
            {category !== 'all' && currentCategory ? (
              <IconRenderer name={currentCategory.icon} size={14} />
            ) : (
              <Sparkles className={`w-3.5 h-3.5 ${category !== 'all' || activeDropdown === 'category' ? 'text-amber-300' : 'text-amber-500'}`} />
            )}
            <span>{categoryLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeDropdown === 'category' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* 2. Area Dropdown Button */}
          <button
            onClick={(e) => handlePillClick('area', e)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs whitespace-nowrap shrink-0 ${
              area !== 'all' || activeDropdown === 'area'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
                : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${area !== 'all' || activeDropdown === 'area' ? 'text-white' : 'text-emerald-600'}`} />
            <span>{areaLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeDropdown === 'area' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* 3. Price Dropdown Button */}
          <button
            onClick={(e) => handlePillClick('price', e)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs whitespace-nowrap shrink-0 ${
              minPrice !== undefined || maxPrice !== undefined || activeDropdown === 'price'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
                : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <CircleDollarSign
              className={`w-3.5 h-3.5 ${
                minPrice !== undefined || maxPrice !== undefined || activeDropdown === 'price' ? 'text-white' : 'text-emerald-600'
              }`}
            />
            <span>{priceLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeDropdown === 'price' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* 4. Amenities / Tags Dropdown Button */}
          <button
            onClick={(e) => handlePillClick('tags', e)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs whitespace-nowrap shrink-0 ${
              (tags && tags.length > 0) || activeDropdown === 'tags'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
                : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${(tags && tags.length > 0) || activeDropdown === 'tags' ? 'text-white' : 'text-emerald-600'}`} />
            <span>{tagsLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeDropdown === 'tags' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* 5. Sort By Dropdown Button */}
          <button
            onClick={(e) => handlePillClick('sort', e)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs whitespace-nowrap shrink-0 ${
              sortBy !== 'rating' || activeDropdown === 'sort'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
                : 'bg-white/90 hover:bg-white text-gray-700 border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <ArrowUpDown className={`w-3.5 h-3.5 ${sortBy !== 'rating' || activeDropdown === 'sort' ? 'text-white' : 'text-emerald-600'}`} />
            <span>{sortLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeDropdown === 'sort' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* 6. Only Available Toggle Pill */}
          <button
            onClick={() => {
              if (hasMovedRef.current) return;
              setOnlyAvailable(!onlyAvailable);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer shadow-xs whitespace-nowrap ${
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
                setAnchorRect(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0 cursor-pointer shadow-xs whitespace-nowrap"
              title="Đặt lại toàn bộ bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScrollBy(140)}
            className="hidden sm:flex absolute -right-3 z-[1020] w-7 h-7 rounded-full bg-white text-emerald-900 shadow-md border border-emerald-200 items-center justify-center hover:bg-emerald-50 hover:scale-105 transition-all cursor-pointer"
            title="Cuộn sang phải"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* PORTAL: Render Popovers and Bottom Sheet directly into document.body */}
      {typeof document !== 'undefined' &&
        activeDropdown &&
        createPortal(
          <>
            {/* Desktop Popovers (sm: and up) */}
            <div
              ref={dropdownRef}
              style={getDesktopPopoverStyle()}
              className="hidden sm:block bg-white rounded-2xl shadow-2xl border border-emerald-100 py-1.5 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Category Options */}
              {activeDropdown === 'category' && (
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  <button
                    onClick={() => {
                      setCategory('all');
                      setActiveDropdown(null);
                      setAnchorRect(null);
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
                        setAnchorRect(null);
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

              {/* Area Options */}
              {activeDropdown === 'area' && (
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {AREAS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setArea(a.id);
                        setActiveDropdown(null);
                        setAnchorRect(null);
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

              {/* Price Options */}
              {activeDropdown === 'price' && (
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {PRICE_RANGES.map((pr) => {
                    const isSelected = minPrice === pr.min && maxPrice === pr.max;
                    return (
                      <button
                        key={pr.id}
                        onClick={() => {
                          setPriceRange(pr.min, pr.max);
                          setActiveDropdown(null);
                          setAnchorRect(null);
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

              {/* Amenities / Tags Options */}
              {activeDropdown === 'tags' && (
                <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar space-y-1">
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
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sort Options */}
              {activeDropdown === 'sort' && (
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSortBy(opt.id);
                        setActiveDropdown(null);
                        setAnchorRect(null);
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

            {/* Mobile Bottom Sheet Modal (< sm) */}
            <div className="sm:hidden fixed inset-0 z-[99999] flex items-end">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
                onClick={() => {
                  setActiveDropdown(null);
                  setAnchorRect(null);
                }}
              />

              {/* Bottom Sheet Modal */}
              <div className="relative w-full max-h-[75vh] bg-white rounded-t-3xl shadow-2xl border-t border-emerald-200 p-4 space-y-3 overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom duration-250 z-10">
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />

                {/* Modal Title */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <h3 className="font-black text-sm text-emerald-950">
                    {activeDropdown === 'category' && 'Chọn danh mục địa điểm'}
                    {activeDropdown === 'area' && 'Chọn khu vực'}
                    {activeDropdown === 'price' && 'Chọn khoảng giá'}
                    {activeDropdown === 'tags' && 'Chọn tiện ích'}
                    {activeDropdown === 'sort' && 'Sắp xếp theo'}
                  </h3>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      setAnchorRect(null);
                    }}
                    className="text-xs font-bold text-emerald-700 px-2 py-1 bg-emerald-50 rounded-lg cursor-pointer"
                  >
                    Xong
                  </button>
                </div>

                {/* Category Options */}
                {activeDropdown === 'category' && (
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setCategory('all');
                        setActiveDropdown(null);
                        setAnchorRect(null);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${
                        category === 'all' ? 'bg-emerald-100 text-emerald-950' : 'bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Tất cả danh mục</span>
                      </div>
                      {category === 'all' && <Check className="w-4 h-4 text-emerald-700" />}
                    </button>

                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategory(cat.id as PlaceCategory);
                          setActiveDropdown(null);
                          setAnchorRect(null);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${
                          category === cat.id ? 'bg-emerald-100 text-emerald-950' : 'bg-gray-50 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-xl flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: cat.color }}
                          >
                            <IconRenderer name={cat.icon} size={14} />
                          </div>
                          <span>{cat.label}</span>
                        </div>
                        {category === cat.id && <Check className="w-4 h-4 text-emerald-700" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Area Options */}
                {activeDropdown === 'area' && (
                  <div className="space-y-1">
                    {AREAS.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setArea(a.id);
                          setActiveDropdown(null);
                          setAnchorRect(null);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${
                          area === a.id ? 'bg-emerald-100 text-emerald-950' : 'bg-gray-50 text-gray-800'
                        }`}
                      >
                        <span>{a.label}</span>
                        {area === a.id && <Check className="w-4 h-4 text-emerald-700" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Price Options */}
                {activeDropdown === 'price' && (
                  <div className="space-y-1">
                    {PRICE_RANGES.map((pr) => {
                      const isSelected = minPrice === pr.min && maxPrice === pr.max;
                      return (
                        <button
                          key={pr.id}
                          onClick={() => {
                            setPriceRange(pr.min, pr.max);
                            setActiveDropdown(null);
                            setAnchorRect(null);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${
                            isSelected ? 'bg-emerald-100 text-emerald-950' : 'bg-gray-50 text-gray-800'
                          }`}
                        >
                          <span>{pr.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Tags Options */}
                {activeDropdown === 'tags' && (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                    {AMENITY_TAGS.map((t) => {
                      const isSelected = tags?.includes(t);
                      return (
                        <button
                          key={t}
                          onClick={() => toggleTag(t)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${
                            isSelected ? 'bg-emerald-100 text-emerald-950' : 'bg-gray-50 text-gray-800'
                          }`}
                        >
                          <span>{t}</span>
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sort Options */}
                {activeDropdown === 'sort' && (
                  <div className="space-y-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setActiveDropdown(null);
                          setAnchorRect(null);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${
                          sortBy === opt.id ? 'bg-emerald-100 text-emerald-950' : 'bg-gray-50 text-gray-800'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-4 h-4 text-emerald-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
};
