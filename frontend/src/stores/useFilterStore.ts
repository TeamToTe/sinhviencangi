import { create } from 'zustand';
import type { FilterParams, PlaceCategory } from '../types/place';

interface FilterState extends FilterParams {
  setCategory: (category: PlaceCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  setArea: (area: string) => void;
  setPriceRange: (min?: number, max?: number) => void;
  toggleTag: (tag: string) => void;
  setOnlyAvailable: (val: boolean) => void;
  setSortBy: (sort: 'rating' | 'price_asc' | 'price_desc' | 'distance') => void;
  resetFilters: () => void;
}

const initialFilters: FilterParams = {
  category: 'all',
  searchQuery: '',
  area: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  tags: [],
  onlyAvailable: false,
  sortBy: 'rating',
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilters,

  setCategory: (category) => set({ category }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setArea: (area) => set({ area }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  toggleTag: (tag) =>
    set((state) => {
      const current = state.tags || [];
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { tags: updated };
    }),
  setOnlyAvailable: (onlyAvailable) => set({ onlyAvailable }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(initialFilters),
}));
