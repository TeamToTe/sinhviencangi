import React, { useState } from 'react';
import { CATEGORIES } from '../../data/mockPlaces';
import { useFilterStore } from '../../stores/useFilterStore';
import { IconRenderer } from '../common/IconRenderer';
import { ChevronUp, ChevronDown, Layers, ClipboardList } from 'lucide-react';
import type { PlaceCategory } from '../../types/place';

export const MapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { category, setCategory } = useFilterStore();

  return (
    <div className="absolute bottom-12 left-3 sm:bottom-8 sm:left-4 z-[950] select-none flex flex-col gap-2 items-start">
      {/* Form survey link - above legend */}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdFVsX1t_0yGQKbOhbYKbx9adKuzP8gp3bQHVT-H1d4oaZvmQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden w-10 h-10 bg-amber-500 text-white rounded-2xl shadow-xl border border-amber-400/80 flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:bg-amber-600"
        title="Điền khảo sát"
        aria-label="Điền khảo sát"
      >
        <ClipboardList className="w-5 h-5" />
      </a>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdFVsX1t_0yGQKbOhbYKbx9adKuzP8gp3bQHVT-H1d4oaZvmQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-2xl shadow-xl border border-amber-400/80 cursor-pointer hover:bg-amber-600 transition-all active:scale-95 text-xs font-black tracking-wider uppercase"
        title="Điền khảo sát"
      >
        <ClipboardList className="w-4 h-4 shrink-0" />
        <span>Khảo sát</span>
      </a>

      {/* Khi đóng: Nút icon trên mobile & nút pill ôm vừa chữ (không bị dài) trên desktop */}
      {!isExpanded && (
        <>
          {/* Mobile: Chỉ 1 icon gọn gàng */}
          <button
            onClick={() => setIsExpanded(true)}
            className="sm:hidden w-10 h-10 bg-emerald-900 text-lime-400 rounded-2xl shadow-xl border border-emerald-700/80 flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:bg-emerald-800"
            title="Chú giải bản đồ"
            aria-label="Chú giải bản đồ"
          >
            <Layers className="w-5 h-5 text-lime-400" />
          </button>

          {/* Desktop: Nút gọn gàng vừa vặn chữ, không bị kéo dài */}
          <button
            onClick={() => setIsExpanded(true)}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-emerald-900 text-white rounded-2xl shadow-xl border border-emerald-700/80 cursor-pointer hover:bg-emerald-800 transition-all active:scale-95 text-xs font-black tracking-wider uppercase"
            title="Mở chú giải bản đồ"
          >
            <Layers className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Chú giải bản đồ</span>
            <ChevronUp className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          </button>
        </>
      )}

      {/* Khi mở: Bảng danh mục mở rộng (hiển thị trên cả mobile & desktop) */}
      {isExpanded && (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-200/80 overflow-hidden w-[220px] sm:w-[230px] transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* Header Bar thu gọn */}
          <button
            onClick={() => setIsExpanded(false)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 bg-emerald-900 text-white text-xs font-black tracking-wider uppercase cursor-pointer hover:bg-emerald-800 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>Chú giải Bản đồ</span>
            </div>
            <ChevronDown className="w-4 h-4 shrink-0 text-emerald-300" />
          </button>

          {/* Nội dung danh mục */}
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto text-xs">
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(isSelected ? 'all' : (cat.id as PlaceCategory))}
                    className={`w-full flex items-center gap-2 p-1.5 rounded-xl transition-all text-left font-medium cursor-pointer ${
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
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Điểm đã xác thực sinh viên</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                <span>FPT Top Pick / Khuyến nghị</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
