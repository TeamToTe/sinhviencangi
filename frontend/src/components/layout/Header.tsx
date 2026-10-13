import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Heart,
  List,
  Map as MapIcon,
  X,
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
import webIcon from '../../assets/icon.png';

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
  const { activeTab, setActiveTab, setSurveyStep } = useMapStore();
  const { favoriteIds } = useFavoritesStore();
  const { user, isAuthenticated, isAdmin, setLoginModalOpen, logout } = useAuthStore();

  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Lấy từ cuối cùng của tên thật (loại bỏ phần chú thích trong ngoặc đơn như (Nhóm trưởng), (Phó nhóm)...)
  const getShortName = (fullName?: string) => {
    if (!fullName) return '';
    const cleanName = fullName.replace(/\s*\([^)]*\)/g, '').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : fullName;
  };

  const handleLogout = () => {
    logout();
    setIsAdminMenuOpen(false);
    if (activeTab === 'admin') {
      setActiveTab('map');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setIsViewMenuOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    };
    if (isViewMenuOpen || isAdminMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isViewMenuOpen, isAdminMenuOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-emerald-200/80 sticky top-0 z-[1100] px-3 sm:px-6 py-2.5 shadow-[0_8px_30px_rgba(6,78,59,0.08)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer select-none shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-md shadow-emerald-500/20 ring-2 ring-emerald-200 shrink-0 bg-white flex items-center justify-center p-0.5">
              <img src={webIcon} alt="Sinh viên cần gì" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-normal">
                <span className="font-bold text-[15px] sm:text-2xl tracking-tight text-emerald-950 font-serif whitespace-nowrap">
                  Sinh viên <span className="text-emerald-600 font-extrabold">cần gì</span>
                </span>
              </div>
              <p className="hidden sm:block text-[12px] sm:text-[13px] text-gray-600 font-normal font-serif tracking-tight whitespace-nowrap">
                Bản đồ dịch vụ khu vực FPTU - VNU
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center justify-end flex-nowrap gap-1.5 shrink-0 ml-auto">
            {/* 1. Mobile View Switcher - Gộp thành 1 ô, danh sách trượt xuống */}
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

                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          setActiveTab('admin');
                        } else {
                          setLoginModalOpen(true);
                        }
                        setIsViewMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'admin'
                          ? 'bg-amber-50 text-amber-900 font-black'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Trang Admin</span>
                      </div>
                      {activeTab === 'admin' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 2. Mobile Survey Pin Button (Chỉ Admin mới có quyền) */}
            {isAuthenticated && isAdmin && (
              <button
                onClick={() => setSurveyStep('map_pin')}
                className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 active:scale-95 text-white shadow-xs cursor-pointer shrink-0 flex items-center justify-center border border-emerald-500/80"
                title="Chấm điểm khảo sát thực địa bằng GPS"
                aria-label="Chấm điểm GPS"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
              </button>
            )}

            {/* 3. Mobile Facebook Link */}
            <a
              href="https://www.facebook.com/profile.php?id=61594975707522&locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-blue-50 text-[#1877F2] border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
              title="Theo dõi chúng mình trên Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>

            {/* 4. Mobile Admin / Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative shrink-0" ref={adminMenuRef}>
                <button
                  onClick={() => setIsAdminMenuOpen((prev) => !prev)}
                  className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all shadow-xs shrink-0 ${
                    isAdminMenuOpen || activeTab === 'admin'
                      ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300'
                      : isAdmin
                      ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                      : 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                  }`}
                  title={`${user.fullName} (${isAdmin ? 'Admin' : 'Khảo sát'}) - Bấm để xem tuỳ chọn`}
                  aria-expanded={isAdminMenuOpen}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                </button>

                {/* Dropdown hiện bên dưới khi bấm */}
                {isAdminMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[1200]"
                      onClick={() => setIsAdminMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-38 bg-white rounded-2xl shadow-2xl border border-amber-200/80 p-1.5 z-[1300] animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                      {/* Tên người dùng */}
                      <div className="px-2.5 py-1.5 border-b border-gray-100 flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-gray-800 truncate">
                          {getShortName(user.fullName) || user.fullName}
                        </span>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            isAdmin ? 'bg-amber-400 text-amber-950' : 'bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {isAdmin ? 'Admin' : 'KS'}
                        </span>
                      </div>

                      {/* Chuyển trang Quản trị / Bản đồ */}
                      {activeTab !== 'admin' ? (
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setIsAdminMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-all cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Trang Admin</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveTab('map');
                            setIsAdminMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all cursor-pointer"
                        >
                          <MapIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Về Bản đồ</span>
                        </button>
                      )}

                      {/* Nút Đăng xuất với ký hiệu mũi tên */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
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
        <div className="flex-1 min-w-0 md:max-w-md lg:max-w-xl mx-0 md:mx-2 flex items-center">
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
        <div className="hidden lg:flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Survey Pin Button (Chỉ Admin mới có quyền) */}
          {isAuthenticated && isAdmin && (
            <button
              onClick={() => setSurveyStep('map_pin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
              title="Chấm điểm khảo sát thực địa bằng GPS"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Chấm điểm</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl border border-gray-200 shrink-0">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold relative transition-all cursor-pointer ${
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
            {/* Tab Trang Admin chỉ hiển thị nếu là Admin hoặc đang ở tab admin */}
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-white text-amber-900 shadow-xs ring-1 ring-amber-300'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                title="Trang quản trị hệ thống"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin</span>
              </button>
            )}
          </div>

          <a
            href="https://www.facebook.com/profile.php?id=61594975707522&locale=vi_VN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-blue-50/90 hover:bg-blue-100 text-[#1877F2] border border-blue-200/90 text-xs font-semibold transition-all hover:shadow-xs shrink-0 group cursor-pointer"
            title="Theo dõi chúng mình trên Facebook"
          >
            <FacebookIcon className="w-3.5 h-3.5 fill-current" />
            <span className="hidden xl:inline whitespace-nowrap font-medium text-[11px]">Fanpage</span>
          </a>

          {/* Desktop Auth / Admin Button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-300/80 pl-2.5 pr-1.5 py-1 rounded-2xl shadow-xs shrink-0">
              <button
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-1 text-xs hover:opacity-85 transition-opacity cursor-pointer"
                title={`${user.fullName} (${isAdmin ? 'Admin' : 'Khảo sát'}) - Bấm để vào Trang Quản Trị`}
              >
                <span className="font-bold text-emerald-950 text-xs">
                  {getShortName(user.fullName)}
                </span>
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                    isAdmin ? 'bg-amber-400 text-amber-950' : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'KS'}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="p-1 rounded-xl hover:bg-emerald-100 text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
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
