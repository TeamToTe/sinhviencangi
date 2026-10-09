import React, { useEffect, useState } from 'react';
import type { Place } from './types/place';
import { placesService } from './services/placesService';
import { useFilterStore } from './stores/useFilterStore';
import { useMapStore } from './stores/useMapStore';
import { Header } from './components/layout/Header';
import { CategoryBar } from './components/filter/CategoryBar';
import { Sidebar } from './components/layout/Sidebar';
import { MapLibreView } from './components/map/MapLibreView';
import { PlaceDetailDrawer } from './components/places/PlaceDetailDrawer';
import { PlaceReportModal } from './components/places/PlaceReportModal';
import { SurveyPinModal } from './components/survey/SurveyPinModal';
import { PlaceCard } from './components/places/PlaceCard';

import { useFavoritesStore } from './stores/useFavoritesStore';
import { FloatingGif } from './components/common/FloatingGif';
import { Sparkles, Heart, Search } from 'lucide-react';

export const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handlePlaceCreated = (newPlace: Place) => {
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
          setPlaces(data);
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

  const displayedListPlaces =
    activeTab === 'favorites'
      ? places.filter((p) => favoriteIds.includes(p.id))
      : places;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f4fbf3] text-gray-800 font-serif antialiased">
      {/* 1. Fixed Top Header */}
      <Header />

      {/* 2. Main Workspace */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* List View & Favorites Tab */}
        <div
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {displayedListPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>

        {/* Map View & 3-Column Layout */}
        <div
          className={`flex-1 flex h-full w-full relative overflow-hidden ${
            activeTab === 'map' ? 'flex' : 'hidden'
          }`}
        >
          {/* Cột Trái: Danh sách gợi ý địa điểm (Desktop only) */}
          <Sidebar places={places} isLoading={isLoading} />

          {/* Cột Giữa: Khung hình bản đồ tương tác */}
          <div className="flex-1 h-full relative overflow-hidden">
            {/* Floating Filter Bar centered on top of map */}
            <div className="absolute top-2.5 sm:top-3 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[900] pointer-events-auto max-w-full sm:max-w-4xl">
              <CategoryBar />
            </div>

            <MapLibreView places={places} isLoading={isLoading} />
          </div>

          {/* Cột Phải: Bảng chi tiết pop-up khi bấm vào địa điểm */}
          <PlaceDetailDrawer />
        </div>
      </main>

      {/* Report Modal */}
      <PlaceReportModal />

      {/* Field Survey GPS Pinning Modal */}
      <SurveyPinModal onPlaceCreated={handlePlaceCreated} />

      {/* Floating GIF Widget */}
      <FloatingGif />
    </div>
  );
};

export default App;
