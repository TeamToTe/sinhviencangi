import React from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { useFilterStore } from '../../stores/useFilterStore';
import { useMapStore } from '../../stores/useMapStore';

const POPULAR_TAGS = [
  'Có điều hòa',
  'Gác xép cao',
  'Thang máy',
  'Khóa vân tay',
  'Không chung chủ',
  'View hồ Tân Xã',
  'Mở 24/7',
  'Gần FPT 450m',
  'Free trà đá',
  'Cứu hộ tận nơi',
  'Full nội thất',
  'Wifi miễn phí',
];

export const FilterModal: React.FC = () => {
  const { isFilterModalOpen, setFilterModalOpen } = useMapStore();
  const {
    tags,
    toggleTag,
    minPrice,
    maxPrice,
    setPriceRange,
    onlyAvailable,
    setOnlyAvailable,
    sortBy,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  if (!isFilterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div>
            <h3 className="font-extrabold text-lg text-emerald-950">Bộ lọc nâng cao</h3>
            <p className="text-xs text-gray-500">Tùy chỉnh tiêu chí tìm phòng & dịch vụ</p>
          </div>
          <button
            onClick={() => setFilterModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
          {/* Price Range for Boarding Houses */}
          <div>
            <label className="block font-bold text-gray-900 mb-2">
              Khoảng giá phòng trọ (VND/tháng)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriceRange(undefined, 2000000)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  maxPrice === 2000000
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                &lt; 2 triệu
              </button>
              <button
                type="button"
                onClick={() => setPriceRange(2000000, 3500000)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  minPrice === 2000000 && maxPrice === 3500000
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                2tr - 3.5 triệu
              </button>
              <button
                type="button"
                onClick={() => setPriceRange(3500000, undefined)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  minPrice === 3500000
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                &gt; 3.5 triệu
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block font-bold text-gray-900 mb-2">Sắp xếp theo</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'rating', label: '⭐ Đánh giá cao' },
                { id: 'price_asc', label: '💵 Giá thấp trước' },
                { id: 'price_desc', label: '💎 Giá cao trước' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSortBy(s.id as any)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    sortBy === s.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag filters */}
          <div>
            <label className="block font-bold text-gray-900 mb-2">
              Tiện ích & Tiêu chí đặc biệt
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((t) => {
                const isSelected = tags?.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                        : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability switch */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="font-bold text-gray-900 text-sm">Chỉ xem nơi còn phòng / đang mở</span>
              <p className="text-xs text-gray-500">Ẩn các địa điểm báo đã hết phòng</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterModalOpen(false)}
            className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};
