import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place } from '../../types/place';
import { useMapStore } from '../../stores/useMapStore';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';

interface MapLibreViewProps {
  places: Place[];
  isLoading?: boolean;
}

// 100% Free, crystal-clear, zero-watermark tile layers
const CLEAN_TILE_LAYERS = {
  osmHot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  esriStreet: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
};

// Format price with proper units
function formatPriceText(priceInfo: { amount: number; unit: string }): string {
  if (priceInfo.amount >= 1000000) {
    const val = (priceInfo.amount / 1000000).toFixed(1).replace('.0', '');
    return `${val}tr/${priceInfo.unit}`;
  }
  if (priceInfo.amount >= 1000) {
    return `${(priceInfo.amount / 1000).toLocaleString('vi-VN')}k/${priceInfo.unit}`;
  }
  return `${priceInfo.amount}đ/${priceInfo.unit}`;
}

// Clean Vector SVG Icons for Markers
function getCategorySvg(category: string): string {
  switch (category) {
    case 'boarding_house':
      return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    case 'food_drink':
      return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M12 2v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V2"/><path d="M15 11v11"/><path d="M6 2v20"/><path d="M4 2v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2"/></svg>`;
    case 'grocery':
      return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
    case 'pharmacy':
      return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`;
    case 'services':
      return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
    case 'entertainment':
      return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="6"/></svg>`;
    case 'campus':
      return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`;
    default:
      return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }
}

export const MapLibreView: React.FC<MapLibreViewProps> = ({ places, isLoading }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const {
    center,
    zoom,
    selectedPlace,
    hoveredPlaceId,
    setSelectedPlace,
    setHoveredPlaceId,
    setCenter,
    setZoom,
    isSidebarOpen,
    activeTab,
  } = useMapStore();

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const [lng, lat] = center;
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: zoom,
      zoomControl: false,
      attributionControl: true,
    });

    const tileLayer = L.tileLayer(CLEAN_TILE_LAYERS.osmHot, {
      subdomains: 'abc',
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Tiles by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OSM</a>',
    });

    tileLayer.on('tileerror', () => {
      tileLayer.setUrl(CLEAN_TILE_LAYERS.esriStreet);
    });

    tileLayer.addTo(map);

    map.on('moveend', () => {
      const c = map.getCenter();
      setCenter([c.lng, c.lat]);
      setZoom(map.getZoom());
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Invalidate map size when side panels expand/collapse or tab switches to map
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedPlace, isSidebarOpen, activeTab]);

  // Sync camera center when store center changes externally
  useEffect(() => {
    if (!mapRef.current) return;
    const currentCenter = mapRef.current.getCenter();
    const [targetLng, targetLat] = center;

    if (
      Math.abs(currentCenter.lng - targetLng) > 0.0001 ||
      Math.abs(currentCenter.lat - targetLat) > 0.0001
    ) {
      mapRef.current.flyTo([targetLat, targetLng], zoom, {
        duration: 0.8,
        easeLinearity: 0.5,
      });
    }
  }, [center, zoom]);

  // Render & Update Custom Festival-Style Speech Bubble Markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear old markers that are no longer in places
    const currentPlaceIds = new Set(places.map((p) => p.id));
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentPlaceIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Create or update markers
    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const isHovered = hoveredPlaceId === place.id;

      if (!markersRef.current[place.id]) {
        // Create custom divIcon with vector SVG icon and serif typography
        const priceLabel = place.priceInfo
          ? formatPriceText(place.priceInfo)
          : `${place.rating}★ (${place.reviewCount})`;

        const customIcon = L.divIcon({
          className: 'leaflet-custom-marker-wrapper',
          iconSize: [160, 56],
          iconAnchor: [80, 56],
          html: `
            <div class="speech-bubble-pin group transition-all duration-200 transform origin-bottom select-none cursor-pointer"
                 id="marker-${place.id}">
              <!-- Bubble Box -->
              <div class="relative bg-white text-gray-900 px-3 py-1.5 rounded-2xl shadow-xl border-2 flex items-center gap-2 whitespace-nowrap min-w-[110px] max-w-[220px]"
                   style="border-color: ${place.categoryColor}">
                
                <!-- Vector SVG Icon badge inside marker -->
                <div class="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                     style="background-color: ${place.categoryColor}">
                  ${getCategorySvg(place.category)}
                </div>

                <!-- Name & Subtext -->
                <div class="flex flex-col overflow-hidden text-left font-serif leading-tight">
                  <span class="font-bold text-[11px] tracking-tight truncate text-gray-900 max-w-[130px]">
                    ${place.name}
                  </span>
                  <span class="text-[10px] font-medium ${place.priceInfo ? 'text-amber-700' : 'text-emerald-700'}">
                    ${priceLabel}
                  </span>
                </div>

                <!-- Top/Right Mini Badge -->
                ${
                  place.badgeText
                    ? `<div class="absolute -top-2 -right-1 bg-amber-400 text-amber-950 text-[8px] font-bold px-1.5 py-0.2 rounded-full shadow-xs ring-1 ring-white font-serif">
                        ${place.badgeText.slice(0, 10)}
                      </div>`
                    : ''
                }
              </div>

              <!-- Tail Pointer -->
              <div class="w-0 h-0 mx-auto border-x-[6px] border-x-transparent border-t-[8px] -mt-[1px]"
                   style="border-top-color: ${place.categoryColor}">
              </div>
              
              <!-- Ground Dot -->
              <div class="w-2.5 h-2.5 rounded-full mx-auto -mt-0.5 shadow-sm ring-2 ring-white"
                 style="background-color: ${place.categoryColor}">
              </div>
            </div>
          `,
        });

        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
          icon: customIcon,
        }).addTo(map);

        marker.on('click', () => {
          setSelectedPlace(place);
        });

        marker.on('mouseover', () => {
          setHoveredPlaceId(place.id);
        });

        marker.on('mouseout', () => {
          setHoveredPlaceId(null);
        });

        markersRef.current[place.id] = marker;
      }

      // Update styling based on selected or hovered state
      const markerDom = document.getElementById(`marker-${place.id}`);
      if (markerDom) {
        if (isSelected) {
          markerDom.className =
            'speech-bubble-pin transition-all duration-200 transform scale-125 -translate-y-2 z-30 drop-shadow-2xl';
        } else if (isHovered) {
          markerDom.className =
            'speech-bubble-pin transition-all duration-200 transform scale-115 -translate-y-1 z-20 drop-shadow-lg';
        } else {
          markerDom.className =
            'speech-bubble-pin transition-all duration-200 transform scale-100 hover:scale-110 z-10';
        }
      }
    });
  }, [places, selectedPlace, hoveredPlaceId, activeTab]);

  // Controls Handlers
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        mapRef.current?.flyTo([latitude, longitude], 17);
      },
      (err) => {
        console.warn(err);
        alert('Không thể lấy vị trí hiện tại. Vui lòng cấp quyền định vị.');
      }
    );
  };

  const handleResetView = () => {
    mapRef.current?.flyTo([21.0135, 105.5252], 15.5);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#e8f5e9]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-900 animate-pulse font-serif">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Đang tải địa điểm Hòa Lạc...</span>
        </div>
      )}

      {/* Map Interactive Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocateMe={handleLocateMe}
        onResetView={handleResetView}
      />

      {/* Map Style Legend */}
      <MapLegend />
    </div>
  );
};
