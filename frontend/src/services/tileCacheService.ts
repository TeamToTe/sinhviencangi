/**
 * Tile Pre-caching & Offline Storage Service for HolaMap
 * Caches map tiles covering the 3.5km radius around FPT University (Hoa Lac).
 */

const CACHE_NAME = 'holamap-tiles-v3';
const FPTU_COORDS = { lat: 21.0135, lng: 105.5252 };
const RADIUS_KM = 3.5;

// Convert lat/lng to tile coordinate x, y at specific zoom level
function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n);
  return { x, y };
}

// Calculate bounding box for radius in km
function getBoundingBox(lat: number, lng: number, radiusKm: number) {
  const deltaLat = radiusKm / 111.32;
  const deltaLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - deltaLat,
    maxLat: lat + deltaLat,
    minLng: lng - deltaLng,
    maxLng: lng + deltaLng,
  };
}

// Generate tile URLs for the 3.5km area across zoom levels 13 to 16
export function getFPTUTileUrls(zoomLevels: number[] = [13, 14, 15, 16]): string[] {
  const bounds = getBoundingBox(FPTU_COORDS.lat, FPTU_COORDS.lng, RADIUS_KM);
  const urls: string[] = [];
  const subdomains = ['a', 'b', 'c'];

  zoomLevels.forEach((zoom) => {
    const nw = latLngToTile(bounds.maxLat, bounds.minLng, zoom);
    const se = latLngToTile(bounds.minLat, bounds.maxLng, zoom);

    const minX = Math.min(nw.x, se.x);
    const maxX = Math.max(nw.x, se.x);
    const minY = Math.min(nw.y, se.y);
    const maxY = Math.max(nw.y, se.y);

    let subIndex = 0;
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const s = subdomains[subIndex % subdomains.length];
        subIndex++;
        // OSM Hot tiles (100% Free, no API key required)
        urls.push(`https://${s}.tile.openstreetmap.fr/hot/${zoom}/${x}/${y}.png`);
      }
    }
  });

  return urls;
}

// Register Service Worker
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] Service Worker registered with scope:', reg.scope);
          reg.update();
          // Defer pre-warming to idle time (after initial UI and visible tiles load)
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => prewarmMapTiles(), { timeout: 4000 });
          } else {
            setTimeout(() => prewarmMapTiles(), 3500);
          }
        })
        .catch((err) => {
          console.warn('[SW] Service Worker registration failed:', err);
          setTimeout(() => prewarmMapTiles(), 4000);
        });
    });
  }
}

// Pre-warm / Cache initial tiles for landing zoom around FPT University
export async function prewarmMapTiles(): Promise<number> {
  if (!('caches' in window)) return 0;

  try {
    const cache = await caches.open(CACHE_NAME);
    // Pre-warm only landing zoom 15 to keep network light and eliminate lag
    const urls = getFPTUTileUrls([15]);
    let cachedCount = 0;

    // Gentle background download: concurrency 2
    const concurrency = 2;
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      await Promise.all(
        batch.map(async (url) => {
          try {
            const match = await cache.match(url);
            if (!match) {
              const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
              if (res.ok) {
                await cache.put(url, res);
                cachedCount++;
              }
            }
          } catch {
            // Silently ignore individual tile fetch failures
          }
        })
      );
      // Small pause to yield event loop & network to user actions
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    console.log(`[TileCache] Pre-warmed ${cachedCount} landing tiles in background.`);
    return cachedCount;
  } catch (err) {
    console.warn('[TileCache] Error prewarming tiles:', err);
    return 0;
  }
}
