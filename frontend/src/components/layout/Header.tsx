import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Heart,
  List,
  Map as MapIcon,
  X,
  Compass,
  MapPin,
  ShieldCheck,
  LogOut,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { useFilterStore } from '../../stores/useFilterStore';
import { useMapStore } from '../../stores/useMapStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { useAuthStore } from '../../stores/useAuthStore';

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

export const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const { activeTab, setActiveTab, setSurveyModalOpen } = useMapStore();
  const { favoriteIds } = useFavoritesStore();
  const { user, isAuthenticated, isAdmin, setLoginModalOpen, logout } = useAuthStore();

  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setIsViewMenuOpen(false);
      }
    };
    if (isViewMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isViewMenuOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200 sticky top-0 z-[1100] px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          <div className="flex items-center gap-2 cursor-pointer select-none shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-200 shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-2xl tracking-tight text-emerald-950 font-serif">
                  HOLA<span className="text-emerald-600 font-extrabold">MAP</span>
                </span>
              </div>
              <p className="hidden sm:block text-[12px] sm:text-[13px] text-gray-600 font-normal font-serif tracking-tight">
                Bản đồ dịch vụ khu vực FPTU - VNU
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* 1. Mobile Survey Pin Button */}
            <button
              onClick={() => setSurveyModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 active:scale-95 text-white font-black text-xs shadow-xs cursor-pointer shrink-0"
              title="Chấm điểm khảo sát thực địa bằng GPS"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Chấm</span>
            </button>

            {/* 2. Mobile View Switcher - Gộp thành 1 ô, danh sách trượt xuống */}
            <div className="relative shrink-0" ref={viewMenuRef}>
              <button
                onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all shadow-xs cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-emerald-800'
                }`}
                title="Chuyển đổi chế độ xem (Bản đồ / Danh sách / Đã lưu)"
              >
                {activeTab === 'map' && <MapIcon className="w-4 h-4 text-emerald-700" />}
                {activeTab === 'list' && <List className="w-4 h-4 text-emerald-700" />}
                {activeTab === 'favorites' && (
                  <div className="relative">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    {favoriteIds.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                        {favoriteIds.length}
                      </span>
                    )}
                  </div>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                    isViewMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* List trượt xuống */}
              {isViewMenuOpen && (
                <>
                  {/* Backdrop trong suốt bắt sự kiện chạm ra ngoài trên mobile */}
                  <div
                    className="fixed inset-0 z-[1200]"
                    onClick={() => setIsViewMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-2xl border border-emerald-200/80 p-1.5 z-[1300] animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('map');
                        setIsViewMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'map'
                          ? 'bg-emerald-50 text-emerald-800 font-black'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Bản đồ</span>
                      </div>
                      {activeTab === 'map' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('list');
                        setIsViewMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'list'
                          ? 'bg-emerald-50 text-emerald-800 font-black'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <List className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Danh sách</span>
                      </div>
                      {activeTab === 'list' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('favorites');
                        setIsViewMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'favorites'
                          ? 'bg-rose-50 text-rose-700 font-black'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                        <span>Đã lưu</span>
                      </div>
                      {favoriteIds.length > 0 && (
                        <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                          {favoriteIds.length}
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 3. Mobile Facebook Link (Lùi vào cạnh ô chuyển chế độ) */}
            <a
              href="https://www.facebook.com/profile.php?id=61594975707522&locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-blue-50 text-[#1877F2] border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
              title="Theo dõi chúng mình trên Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>

            {/* 4. Mobile Admin / Auth Button (Đặt ngay cạnh nút Facebook) */}
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  if (window.confirm(`Đăng xuất tài khoản ${user.fullName}?`)) {
                    logout();
                  }
                }}
                className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all shadow-xs shrink-0 ${
                  isAdmin
                    ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                    : 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                }`}
                title={`${user.fullName} (${isAdmin ? 'Admin' : 'Khảo sát'}) - Bấm để đăng xuất`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </button>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 flex items-center justify-center cursor-pointer shadow-xs shrink-0"
                title="Đăng nhập Admin / Khảo sát"
              >
                <Lock className="w-4 h-4 text-emerald-700" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 w-full max-w-xl lg:max-w-2xl flex items-center">
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

        {/* Desktop View Mode Switcher, Survey Button & Facebook Link */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Desktop Survey Pin Button */}
          <button
            onClick={() => setSurveyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
            title="Chấm điểm khảo sát thực địa bằng GPS"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>+ Chấm Địa Điểm</span>
          </button>

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl border border-gray-200">
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

          <a
            href="https://www.facebook.com/profile.php?id=61594975707522&locale=vi_VN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-blue-50/90 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border border-blue-200/90 text-xs font-semibold transition-all hover:shadow-sm shrink-0 group cursor-pointer"
            title="Theo dõi chúng mình trên Facebook"
          >
            <div className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
              <FacebookIcon className="w-3 h-3 fill-current" />
            </div>
            <span className="whitespace-nowrap font-medium">Theo dõi chúng mình</span>
          </a>

          {/* Desktop Auth / Admin Button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-300/80 pl-2.5 pr-1.5 py-1 rounded-2xl shadow-xs">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-sm">{isAdmin ? '👑' : '🔍'}</span>
                <span className="font-black text-emerald-950 max-w-[120px] truncate" title={user.fullName}>
                  {user.fullName}
                </span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    isAdmin ? 'bg-amber-400 text-amber-950' : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'Khảo sát'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1 rounded-xl hover:bg-emerald-100 text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Đăng nhập Admin / Thành viên khảo sát"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
