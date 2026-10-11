import type { RoutePlan, RouteVehicle } from '../stores/useMapStore';

interface ValhallaResponse {
  trip?: {
    summary?: {
      length: number;
      time: number;
    };
    legs?: { shape?: string }[];
  };
}

function decodePolyline6(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    latitude += (result & 1) ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    longitude += (result & 1) ? ~(result >> 1) : result >> 1;
    points.push([latitude / 1e6, longitude / 1e6]);
  }

  return points;
}

export async function getRoute(
  origin: [number, number],
  destination: [number, number],
  vehicle: RouteVehicle,
  signal?: AbortSignal
): Promise<RoutePlan> {
  const costing = vehicle === 'motorcycle' ? 'motorcycle' : 'auto';
  const costingOptions = vehicle === 'motorcycle'
    ? { motorcycle: { use_highways: 0 } }
    : undefined;
  const response = await fetch('https://valhalla1.openstreetmap.de/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locations: [
        { lon: origin[0], lat: origin[1] },
        { lon: destination[0], lat: destination[1] },
      ],
      costing,
      costing_options: costingOptions,
      units: 'kilometers',
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error('Không thể kết nối máy chủ chỉ đường.');
  }

  const data = (await response.json()) as ValhallaResponse;
  const summary = data.trip?.summary;
  const shape = data.trip?.legs?.[0]?.shape;
  if (!summary || !shape) {
    throw new Error('Không tìm thấy tuyến đường phù hợp.');
  }

  return {
    vehicle,
    origin,
    destination,
    coordinates: decodePolyline6(shape),
    distanceMeters: summary.length * 1000,
    durationSeconds: summary.time,
  };
}
