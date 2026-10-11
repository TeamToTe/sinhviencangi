import type { RoutePlan } from '../stores/useMapStore';

interface OsrmResponse {
  code: string;
  routes?: {
    distance: number;
    duration: number;
    geometry: {
      coordinates: [number, number][];
    };
  }[];
}

export async function getDrivingRoute(
  origin: [number, number],
  destination: [number, number],
  signal?: AbortSignal
): Promise<RoutePlan> {
  const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`,
    { signal }
  );

  if (!response.ok) {
    throw new Error('Không thể kết nối máy chủ chỉ đường.');
  }

  const data = (await response.json()) as OsrmResponse;
  const route = data.routes?.[0];
  if (data.code !== 'Ok' || !route) {
    throw new Error('Không tìm thấy tuyến đường phù hợp.');
  }

  return {
    origin,
    destination,
    coordinates: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}
