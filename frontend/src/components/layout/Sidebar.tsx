import React from 'react';
import type { Place } from '../../types/place';
import { PlaceCard } from '../places/PlaceCard';
import { useMapStore } from '../../stores/useMapStore';
import { useFilterStore } from '../../stores/useFilterStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import {
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
} from 'lucide-react';

interface SidebarProps {
  places: Place[];
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ places, isLoading }) => {
  const { activeTab, isSidebarOpen, setSidebarOpen } = useMapStore();
  const { searchQuery, category, area, tags, resetFilters } = useFilterStore();
  const { favoriteIds } = useFavoritesStore();

  const displayedPlaces =
    activeTab === 'favorites'
      ? places.filter((p) => favoriteIds.includes(p.id))
      : places;

  return (
    <aside
      className={`relative z-20 bg-emerald-50/50 backdrop-blur-xs border-r border-emerald-200/80 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'w-full md:w-[380px] lg:w-[420px]' : 'w-0 overflow-hidden md:w-0'
      }`}
    >
      {/* Sidebar Toggle Handle for Desktop */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-12 bg-white rounded-r-xl border-y border-r border-emerald-300 shadow-md items-center justify-center text-emerald-800 hover:text-emerald-950 transition-colors"
        title={isSidebarOpen ? 'Thu gọn danh sách' : 'Mở rộng danh sách'}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Sidebar Header Stats */}
      <div className="p-4 border-b border-emerald-100/80 bg-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 font-black text-sm text-emerald-950">
            {activeTab === 'favorites' ? (
              <>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Địa điểm đã lưu</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Khám phá Hòa Lạc</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Tìm thấy{' '}
            <strong className="text-emerald-700 font-black">{displayedPlaces.length}</strong>{' '}
            địa điểm phù hợp
          </p>
        </div>

        {(searchQuery || category !== 'all' || area !== 'all' || (tags && tags.length > 0)) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-emerald-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      {/* Places Scroll List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-4 py-8 text-center">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500 font-medium">Đang tìm kiếm quanh FPT & VNU...</p>
          </div>
        ) : displayedPlaces.length === 0 ? (
          <div className="py-12 px-6 text-center space-y-3 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-gray-900">
              Không tìm thấy địa điểm nào
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hãy thử xóa bớt tiêu chí lọc, hoặc tìm từ khóa khác như "Tân Xã", "phòng trọ", "cơm sườn"...
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          displayedPlaces.map((place) => <PlaceCard key={place.id} place={place} />)
        )}
      </div>
    </aside>
  );
};
