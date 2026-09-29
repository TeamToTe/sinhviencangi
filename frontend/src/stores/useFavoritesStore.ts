import { create } from 'zustand';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
}

const STORAGE_KEY = 'holamap_favorites';

const getInitialFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: getInitialFavorites(),

  toggleFavorite: (placeId: string) => {
    const current = get().favoriteIds;
    const updated = current.includes(placeId)
      ? current.filter((id) => id !== placeId)
      : [...current, placeId];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist favorites', e);
    }

    set({ favoriteIds: updated });
  },

  isFavorite: (placeId: string) => {
    return get().favoriteIds.includes(placeId);
  },
}));
