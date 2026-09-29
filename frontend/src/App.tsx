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
import { FilterModal } from './components/filter/FilterModal';
import { PlaceReportModal } from './components/places/PlaceReportModal';
import { PlaceCard } from './components/places/PlaceCard';

export const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    category,
    searchQuery,
    area,
    minPrice,
    maxPrice,
    tags,
    onlyAvailable,
    sortBy,
  } = useFilterStore();

  const { activeTab } = useMapStore();

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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f4fbf3] text-gray-800 font-sans antialiased">
      {/* 1. Fixed Top Header */}
      <Header />

      {/* 2. Category Pill Filter Bar */}
      <CategoryBar />

      {/* 3. Main 3-Column Layout: Left (Suggestions) | Middle (Fixed Map) | Right (Place Details) */}
      <main className="flex-1 flex relative overflow-hidden">
        {activeTab === 'list' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Cột Trái: Danh sách gợi ý địa điểm & phòng trọ */}
            <Sidebar places={places} isLoading={isLoading} />

            {/* Cột Giữa: Khung hình bản đồ tương tác cố định */}
            <div className="flex-1 h-full relative overflow-hidden">
              <MapLibreView places={places} isLoading={isLoading} />
            </div>

            {/* Cột Phải: Bảng chi tiết pop-up khi bấm vào địa điểm (không đè lấn navbar hay map) */}
            <PlaceDetailDrawer />
          </>
        )}
      </main>

      {/* Advanced Filter Modal */}
      <FilterModal />

      {/* Report Modal */}
      <PlaceReportModal />
    </div>
  );
};

export default App;
