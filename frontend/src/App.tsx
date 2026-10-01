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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f4fbf3] text-gray-800 font-serif antialiased">
      {/* 1. Fixed Top Header */}
      <Header />

      {/* 2. Main Workspace: Map and Sidebar extend all the way up to Header */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* List View Tab */}
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4 ${
            activeTab === 'list' ? 'block' : 'hidden'
          }`}
        >
          {/* Centered Filter Bar in List view */}
          <div className="flex justify-center w-full">
            <CategoryBar />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>

        {/* Map View & 3-Column Layout */}
        <div
          className={`flex-1 flex h-full w-full relative overflow-hidden ${
            activeTab === 'list' ? 'hidden' : 'flex'
          }`}
        >
          {/* Cột Trái: Danh sách gợi ý địa điểm & phòng trọ */}
          <Sidebar places={places} isLoading={isLoading} />

          {/* Cột Giữa: Khung hình bản đồ tương tác cố định */}
          <div className="flex-1 h-full relative overflow-hidden">
            {/* Floating Filter Bar centered on top of map */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[900] pointer-events-auto max-w-[calc(100%-32px)]">
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
    </div>
  );
};

export default App;
