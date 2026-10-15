import React, { useEffect, useState, useMemo, useRef } from 'react';
import type { Place } from './types/place';
import { placesService } from './services/placesService';
import { useFilterStore } from './stores/useFilterStore';
import { useMapStore } from './stores/useMapStore';
import { Header } from './components/layout/Header';
import { CategoryBar } from './components/filter/CategoryBar';
import { MapLibreView } from './components/map/MapLibreView';
import { PlaceDetailDrawer } from './components/places/PlaceDetailDrawer';
import { PlaceReportModal } from './components/places/PlaceReportModal';
import { SurveyPinModal } from './components/survey/SurveyPinModal';
import { PlaceCard } from './components/places/PlaceCard';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuthStore } from './stores/useAuthStore';
import { isAdminPath } from './utils/routeUtils';

import { useFavoritesStore } from './stores/useFavoritesStore';
import { FloatingGif } from './components/common/FloatingGif';
import { Sparkles, Heart, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handlePlaceCreated = (newPlace: Place) => {
    // Only places with approved status are published directly to the public map
    if (newPlace.approvalStatus !== 'approved') {
      return;
    }
    setPlaces((prev) => [newPlace, ...prev.filter((p) => p.id !== newPlace.id)]);
  };

  const {
    category,
    searchQuery,
    area,
    minPrice,
    maxPrice,
    tags,
    onlyAvailable,
    sortBy,
    resetFilters,
  } = useFilterStore();

  const { activeTab, setActiveTab } = useMapStore();
  const { favoriteIds } = useFavoritesStore();
  const { checkAuth, isAdmin, setLoginModalOpen } = useAuthStore();
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    isAdminPath(window.location.pathname)
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Keep route synced with browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const atAdmin = isAdminPath(window.location.pathname);
      setIsAdminRoute(atAdmin);
      if (atAdmin) {
        setActiveTab('admin');
        if (!isAdmin) {
          setLoginModalOpen(true);
        }
      } else {
        setLoginModalOpen(false);
        if (activeTab === 'admin') {
          setActiveTab('map');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAdmin, activeTab, setActiveTab, setLoginModalOpen]);

  // When route changes to admin, ensure tab and login modal states align
  useEffect(() => {
    if (isAdminRoute) {
      setActiveTab('admin');
      if (!isAdmin) {
        setLoginModalOpen(true);
      } else {
        setLoginModalOpen(false);
      }
    } else {
      setLoginModalOpen(false);
      if (activeTab === 'admin') {
        setActiveTab('map');
      }
    }
  }, [isAdminRoute, isAdmin, setActiveTab, setLoginModalOpen]);

  // When user is currently in admin tab but explicitly switches away, update URL to '/'
  useEffect(() => {
    if (activeTab !== 'admin' && isAdminRoute) {
      window.history.pushState({}, '', '/');
      setIsAdminRoute(false);
    }
  }, [activeTab, isAdminRoute]);

  // Load places whenever filters change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    placesService
      .getPlaces({
        category,
        searchQuery,
        area,
        minPrice,
        maxPrice,
        tags,
        onlyAvailable,
        sortBy,
      })
      .then((data) => {
        if (isMounted) {
          const approvedOnly = data.filter(
            (p) => !p.approvalStatus || p.approvalStatus === 'approved'
          );
          setPlaces(approvedOnly);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load places:', err);
        if (isMounted) setIsLoading(false);
      });

  return () => {
    isMounted = false;
  };
}, [category, searchQuery, area, minPrice, maxPrice, tags, onlyAvailable, sortBy]);

  const approvedPlaces = useMemo(
    () => places.filter((p) => !p.approvalStatus || p.approvalStatus === 'approved'),
    [places]
  );

  const displayedListPlaces =
    activeTab === 'favorites'
      ? approvedPlaces.filter((p) => favoriteIds.includes(p.id))
      : approvedPlaces;

  const listContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  // Reset to page 1 whenever filters or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchQuery, area, minPrice, maxPrice, tags, onlyAvailable, sortBy, activeTab]);

  const totalPages = Math.max(1, Math.ceil(displayedListPlaces.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedPlaces = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return displayedListPlaces.slice(start, start + ITEMS_PER_PAGE);
  }, [displayedListPlaces, validCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-screen overflow-hidden bg-[#f4fbf3] text-gray-800 font-serif antialiased">
      {/* 1. Fixed Top Header */}
      <Header />

      {/* 2. Main Workspace */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* Admin Dashboard Page */}
        {activeTab === 'admin' && isAdmin ? (
          <AdminDashboard
            places={places}
            onPlaceUpdated={handlePlaceCreated}
            onPlaceDeleted={(id) => setPlaces((prev) => prev.filter((p) => p.id !== id))}
          />
        ) : (
          <>
            {/* List View & Favorites Tab */}
            <div
              ref={listContainerRef}
              className={`flex-1 overflow-y-auto p-3 sm:p-6 max-w-5xl mx-auto w-full space-y-4 custom-scrollbar pb-16 ${
                activeTab === 'map' ? 'hidden' : 'block'
              }`}
            >
              {/* Centered Filter Bar in List view */}
              <div className="flex justify-center w-full sticky top-0 z-20 py-1">
                <CategoryBar />
              </div>

          {/* List Section Title */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              {activeTab === 'favorites' ? (
                <>
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h2 className="font-black text-sm sm:text-base text-emerald-950">
                    Địa điểm đã lưu ({displayedListPlaces.length})
                  </h2>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="font-black text-sm sm:text-base text-emerald-950">
                    Khám phá Hòa Lạc ({displayedListPlaces.length} địa điểm)
                  </h2>
                </>
              )}
            </div>

            {displayedListPlaces.length === 0 && activeTab === 'favorites' && (
              <button
                onClick={() => setActiveTab('map')}
                className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-xl transition-colors cursor-pointer"
              >
                Khám phá ngay
              </button>
            )}
          </div>

          {/* Places Grid or Empty State */}
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-gray-500 font-medium">Đang tải danh sách địa điểm...</p>
            </div>
          ) : displayedListPlaces.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-3 bg-white rounded-3xl border border-dashed border-gray-300 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                {activeTab === 'favorites' ? (
                  <Heart className="w-6 h-6 text-rose-400" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </div>
              <h4 className="font-extrabold text-sm text-gray-900">
                {activeTab === 'favorites'
                  ? 'Chưa có địa điểm yêu thích nào'
                  : 'Không tìm thấy địa điểm nào'}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {activeTab === 'favorites'
                  ? 'Hãy bấm vào biểu tượng trái tim trên các thẻ địa điểm để lưu lại danh sách riêng của bạn.'
                  : 'Hãy thử xóa bớt tiêu chí lọc hoặc tìm từ khóa khác.'}
              </p>
              {activeTab === 'list' && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {paginatedPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-100">
                  <span className="text-xs text-gray-600">
                    Hiển thị <span className="font-bold text-emerald-950">{(validCurrentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-bold text-emerald-950">{Math.min(validCurrentPage * ITEMS_PER_PAGE, displayedListPlaces.length)}</span> trên <span className="font-bold text-emerald-950">{displayedListPlaces.length}</span> địa điểm
                  </span>

                  <div className="flex items-center gap-1.5 select-none">
                    <button
                      onClick={() => handlePageChange(validCurrentPage - 1)}
                      disabled={validCurrentPage === 1}
                      className="p-2 rounded-xl border border-emerald-200/80 bg-white hover:bg-emerald-50 text-gray-700 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-2xs"
                      title="Trang trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {getPageNumbers(validCurrentPage, totalPages).map((p, idx) =>
                      typeof p === 'number' ? (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                            validCurrentPage === p
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                              : 'bg-white border border-emerald-200/80 text-gray-700 hover:bg-emerald-50'
                          }`}
                        >
                          {p}
                        </button>
                      ) : (
                        <span key={`dots-${idx}`} className="px-1 text-gray-400 text-xs">
                          ...
                        </span>
                      )
                    )}

                    <button
                      onClick={() => handlePageChange(validCurrentPage + 1)}
                      disabled={validCurrentPage === totalPages}
                      className="p-2 rounded-xl border border-emerald-200/80 bg-white hover:bg-emerald-50 text-gray-700 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-2xs"
                      title="Trang sau"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Map View & Fullscreen Layout */}
        <div
          className={`flex-1 flex h-full w-full relative overflow-hidden ${
            activeTab === 'map' ? 'flex' : 'hidden'
          }`}
        >
          {/* Khung hình bản đồ tương tác toàn màn hình */}
          <div className="flex-1 h-full relative overflow-hidden">
            {/* Floating Filter Bar centered on top of map */}
            <div className="absolute top-2.5 sm:top-3 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[900] pointer-events-auto max-w-full sm:max-w-4xl">
              <CategoryBar />
            </div>

            <MapLibreView places={approvedPlaces} isLoading={isLoading} />
          </div>
        </div>

        {/* Cột Phải: Bảng chi tiết pop-up — hiển thị ở cả chế độ Bản đồ, Danh sách và Đã lưu */}
        <PlaceDetailDrawer />
          </>
        )}
      </main>

      {/* Report Modal */}
      <PlaceReportModal />

      {/* Field Survey GPS Pinning Modal */}
      <SurveyPinModal onPlaceCreated={handlePlaceCreated} />

      {/* Admin & Surveyor Login Modal (JWT/Bcrypt) */}
      <AdminLoginModal />

      {/* Floating GIF Widget */}
      <FloatingGif />
    </div>
  );
};

export default App;
