import { create } from 'zustand';
import type { Place } from '../types/place';

interface MapState {
  selectedPlace: Place | null;
  hoveredPlaceId: string | null;
  center: [number, number]; // [lng, lat]
  zoom: number;
  activeTab: 'map' | 'list' | 'favorites';
  isReportModalOpen: boolean;
  reportPlaceId: string | null;
  isSurveyModalOpen: boolean;
  isFilterModalOpen: boolean;
  isSidebarOpen: boolean;
  mapStyleMode: 'festival' | 'streets' | 'satellite';

  // Actions
  setSelectedPlace: (place: Place | null) => void;
  setHoveredPlaceId: (id: string | null) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  flyToPlace: (place: Place) => void;
  setActiveTab: (tab: 'map' | 'list' | 'favorites') => void;
  setReportModal: (isOpen: boolean, placeId?: string | null) => void;
  setSurveyModalOpen: (isOpen: boolean) => void;
  setFilterModalOpen: (isOpen: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setMapStyleMode: (mode: 'festival' | 'streets' | 'satellite') => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedPlace: null,
  hoveredPlaceId: null,
  center: [105.5252, 21.0135], // FPT University Hoa Lac
  zoom: 15,
  activeTab: 'map',
  isReportModalOpen: false,
  reportPlaceId: null,
  isSurveyModalOpen: false,
  isFilterModalOpen: false,
  isSidebarOpen: true,
  mapStyleMode: 'festival',

  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setHoveredPlaceId: (id) => set({ hoveredPlaceId: id }),
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  flyToPlace: (place) =>
    set({
      selectedPlace: place,
      center: [place.coordinates.lng, place.coordinates.lat],
      zoom: 16.5,
    }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setReportModal: (isOpen, placeId = null) =>
    set({ isReportModalOpen: isOpen, reportPlaceId: placeId }),
  setSurveyModalOpen: (isOpen) => set({ isSurveyModalOpen: isOpen }),
  setFilterModalOpen: (isOpen) => set({ isFilterModalOpen: isOpen }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setMapStyleMode: (mode) => set({ mapStyleMode: mode }),
}));
