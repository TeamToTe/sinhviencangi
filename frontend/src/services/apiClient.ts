/**
 * HTTP API Client for connecting to Backend
 * Can be switched dynamically via VITE_USE_MOCK environment variable
 */

function normalizeBaseUrl(url?: string): string {
  let base = (url || 'http://localhost:8080/api').trim();
  // Strip all trailing slashes
  base = base.replace(/\/+$/, '');
  // If the user configured just the domain without /api (e.g. https://holamap-api.onrender.com)
  if (!base.endsWith('/api')) {
    base = `${base}/api`;
  }
  return base;
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK !== 'false'; // Defaults to true in dev

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const rawUrl = `${API_BASE_URL}${cleanEndpoint}`;
  // Sanitize consecutive slashes, keeping protocol :// intact
  const url = rawUrl.replace(/([^:]\/)\/+/g, '$1');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = localStorage.getItem('connecthub_auth_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        response.status,
        errorData?.message || `HTTP Request failed with status ${response.status}`,
        errorData
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, (error as Error).message || 'Network connection failed');
  }
}
