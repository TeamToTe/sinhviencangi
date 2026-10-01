import React from 'react';
import {
  Search,
  Heart,
  List,
  Map as MapIcon,
  X,
  Compass,
} from 'lucide-react';
import { useFilterStore } from '../../stores/useFilterStore';
import { useMapStore } from '../../stores/useMapStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';

export const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const { activeTab, setActiveTab } = useMapStore();
  const { favoriteIds } = useFavoritesStore();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-emerald-200 sticky top-0 z-30 px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-200">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-emerald-950 font-serif">
                  HOLA<span className="text-emerald-600 font-extrabold">MAP</span>
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-gray-600 font-normal font-serif tracking-tight">
                Bản đồ dịch vụ khu vực FPTU - VNU
              </p>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('map')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`p-1.5 rounded-lg text-xs font-bold relative transition-all cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {favoriteIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 w-full max-w-2xl flex items-center">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input
              type="text"
              placeholder="Tìm trọ Tân Xã, quán cơm tấm, hiệu thuốc, cứu hộ xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50/90 focus:bg-white border border-emerald-200 focus:border-emerald-500 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-3 focus:ring-emerald-400/20 transition-all shadow-inner font-serif"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop View Mode Switcher */}
        <div className="hidden md:flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bản đồ</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <List className="w-3.5 h-3.5 text-emerald-600" />
            <span>Danh sách</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold relative transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span>Đã lưu</span>
            {favoriteIds.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {favoriteIds.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
