import React from 'react';
import { CATEGORIES } from '../../data/mockPlaces';
import { useFilterStore } from '../../stores/useFilterStore';
import { IconRenderer } from '../common/IconRenderer';
import type { PlaceCategory } from '../../types/place';
import { Sparkles } from 'lucide-react';

const AREAS = [
  { id: 'all', label: 'Tất cả khu vực' },
  { id: 'Tân Xã', label: 'Hồ Tân Xã' },
  { id: 'Thạch Hòa', label: 'Thạch Hòa / Cổng 3' },
  { id: 'Bình Yên', label: 'Bình Yên' },
  { id: 'Khu CNC Hòa Lạc', label: 'Khu CNC FPT' },
];

export const CategoryBar: React.FC = () => {
  const { category, setCategory, area, setArea } = useFilterStore();

  return (
    <div className="bg-white/80 backdrop-blur-xs border-b border-emerald-100 py-2 px-3 sm:px-6 select-none">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Categories Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {/* All Category Pill */}
          <button
            onClick={() => setCategory('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              category === 'all'
                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tất cả</span>
          </button>

          {/* Category Items */}
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as PlaceCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
                  isSelected
                    ? 'text-white shadow-md ring-2'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
                style={{
                  backgroundColor: isSelected ? cat.color : undefined,
                  borderColor: isSelected ? cat.color : cat.borderColor,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    color: isSelected ? '#ffffff' : cat.color,
                  }}
                >
                  <IconRenderer name={cat.icon} size={13} />
                </div>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Area Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-[11px]">
          <span className="text-gray-600 font-semibold shrink-0 mr-1">Khu vực:</span>
          {AREAS.map((a) => (
            <button
              key={a.id}
              onClick={() => setArea(a.id)}
              className={`px-2.5 py-0.5 rounded-md font-bold transition-colors shrink-0 ${
                area === a.id
                  ? 'bg-emerald-200 text-emerald-950 ring-1 ring-emerald-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
