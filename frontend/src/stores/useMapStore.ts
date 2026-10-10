import { create } from 'zustand';
import type { Place } from '../types/place';

export type SurveyStep = 'closed' | 'map_pin' | 'form';

interface MapState {
  selectedPlace: Place | null;
  hoveredPlaceId: string | null;
  center: [number, number]; // [lng, lat]
  zoom: number;
  activeTab: 'map' | 'list' | 'favorites' | 'admin';
  isReportModalOpen: boolean;
  reportPlaceId: string | null;
  isSurveyModalOpen: boolean;
  surveyStep: SurveyStep;
  isFilterModalOpen: boolean;
  isSidebarOpen: boolean;
  mapStyleMode: 'festival' | 'streets' | 'satellite';
  isPickingLocation: boolean;

  // Actions
  setSelectedPlace: (place: Place | null) => void;
  setHoveredPlaceId: (id: string | null) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  flyToPlace: (place: Place) => void;
  flyToCoordinates: (lat: number, lng: number, zoom?: number) => void;
  setActiveTab: (tab: 'map' | 'list' | 'favorites' | 'admin') => void;
  setReportModal: (isOpen: boolean, placeId?: string | null) => void;
  setSurveyModalOpen: (isOpen: boolean) => void;
  setSurveyStep: (step: SurveyStep) => void;
  setFilterModalOpen: (isOpen: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setMapStyleMode: (mode: 'festival' | 'streets' | 'satellite') => void;
  setIsPickingLocation: (val: boolean) => void;
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
  surveyStep: 'closed',
  isFilterModalOpen: false,
  isSidebarOpen: true,
  mapStyleMode: 'festival',
  isPickingLocation: false,

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
  flyToCoordinates: (lat, lng, zoom = 16.5) =>
    set({
      center: [lng, lat],
      zoom,
    }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setReportModal: (isOpen, placeId = null) =>
    set({ isReportModalOpen: isOpen, reportPlaceId: placeId }),
  setSurveyStep: (step) =>
    set({
      surveyStep: step,
      isSurveyModalOpen: step === 'form',
      isPickingLocation: step === 'map_pin',
      ...(step === 'map_pin' ? { activeTab: 'map' } : {}),
    }),
  setSurveyModalOpen: (isOpen) =>
    set((state) => ({
      isSurveyModalOpen: isOpen,
      surveyStep: isOpen ? (state.surveyStep === 'form' ? 'form' : 'map_pin') : 'closed',
      isPickingLocation: isOpen && state.surveyStep !== 'form',
      ...(isOpen ? { activeTab: 'map' } : {}),
    })),
  setFilterModalOpen: (isOpen) => set({ isFilterModalOpen: isOpen }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setMapStyleMode: (mode) => set({ mapStyleMode: mode }),
  setIsPickingLocation: (val) => set({ isPickingLocation: val }),
}));
