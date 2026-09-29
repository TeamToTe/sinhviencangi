import React, { useState } from 'react';
import { CATEGORIES } from '../../data/mockPlaces';
import { useFilterStore } from '../../stores/useFilterStore';
import { IconRenderer } from '../common/IconRenderer';
import { ChevronUp, ChevronDown, Layers } from 'lucide-react';
import type { PlaceCategory } from '../../types/place';

export const MapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { category, setCategory } = useFilterStore();

  return (
    <div className="absolute bottom-6 left-4 z-20 select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-200/80 overflow-hidden max-w-[240px] transition-all duration-300">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 bg-emerald-900 text-white text-xs font-black tracking-wider uppercase"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-lime-400" />
            <span>Chú giải Bản đồ</span>
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {/* Legend Content */}
        {isExpanded && (
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto text-xs animate-in slide-in-from-bottom-2">
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(isSelected ? 'all' : (cat.id as PlaceCategory))}
                    className={`w-full flex items-center gap-2 p-1.5 rounded-xl transition-all text-left font-medium ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconRenderer name={cat.icon} size={11} />
                    </div>
                    <span className="truncate text-[11px]">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-600 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Điểm đã xác thực sinh viên</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>FPT Top Pick / Khuyến nghị</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
