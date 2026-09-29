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
  // OSM Humanitarian (Beautiful pastel greens, sharp Vietnamese roads & landmarks, 0 API key, 0 watermark)
  osmHot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  // Esri World Street (Ultra-reliable global CDN)
  esriStreet: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
};

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

    // Add High-Quality OSM Hot / Esri Street Tile Layer (Zero watermarks, 100% free)
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

  // Invalidate map size when side panels expand/collapse so tiles fill the center area perfectly
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedPlace, isSidebarOpen]);

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
        // Create custom divIcon with speech bubble design
        const customIcon = L.divIcon({
          className: 'leaflet-custom-marker-wrapper',
          iconSize: [160, 56],
          iconAnchor: [80, 56],
          html: `
            <div class="speech-bubble-pin group transition-all duration-200 transform origin-bottom select-none cursor-pointer"
                 id="marker-${place.id}">
              <!-- Bubble Box -->
              <div class="relative bg-white text-gray-900 px-3 py-1.5 rounded-2xl shadow-xl border-2 flex items-center gap-1.5 whitespace-nowrap min-w-[110px] max-w-[210px]"
                   style="border-color: ${place.categoryColor}">
                
                <!-- Icon badge inside marker -->
                <div class="w-5 h-5 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs text-[11px] font-bold"
                     style="background-color: ${place.categoryColor}">
                  ${getCategoryEmoji(place.category)}
                </div>

                <!-- Name & Subtext -->
                <div class="flex flex-col overflow-hidden text-left">
                  <span class="font-black text-[11px] tracking-tight uppercase truncate text-gray-900 max-w-[130px]">
                    ${place.name}
                  </span>
                  ${
                    place.priceInfo
                      ? `<span class="text-[9px] font-bold text-amber-600">${(place.priceInfo.amount / 1000000).toFixed(1)}tr/${place.priceInfo.unit}</span>`
                      : `<span class="text-[9px] font-semibold text-emerald-700">${place.rating}★ (${place.reviewCount})</span>`
                  }
                </div>

                <!-- Top/Right Mini Badge -->
                ${
                  place.badgeText
                    ? `<div class="absolute -top-2 -right-1 bg-amber-400 text-amber-950 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full shadow-xs ring-1 ring-white">
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
  }, [places, selectedPlace, hoveredPlaceId]);

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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-900 animate-pulse">
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

// Helper emoji for map pins
function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'boarding_house':
      return '🏠';
    case 'food_drink':
      return '🍜';
    case 'grocery':
      return '🛒';
    case 'pharmacy':
      return '💊';
    case 'services':
      return '🏍️';
    case 'entertainment':
      return '🎮';
    case 'campus':
      return '🎓';
    default:
      return '📍';
  }
}
