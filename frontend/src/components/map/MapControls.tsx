import React from 'react';
import { Plus, Minus, LocateFixed, Compass } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateMe: () => void;
  onResetView: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onLocateMe,
  onResetView,
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 select-none">
      {/* Zoom and Locate Group */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-200/80 p-1 flex flex-col gap-1">
        <button
          onClick={onZoomIn}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          title="Phóng to"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="w-6 h-px bg-gray-200 mx-auto" />

        <button
          onClick={onZoomOut}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          title="Thu nhỏ"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Locate Me */}
      <button
        onClick={onLocateMe}
        className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-200/80 flex items-center justify-center text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all group"
        title="Vị trí của tôi"
      >
        <LocateFixed className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Reset to FPT Campus Center */}
      <button
        onClick={onResetView}
        className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-200/80 flex items-center justify-center text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all group"
        title="Về ĐH FPT Hòa Lạc"
      >
        <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
      </button>
    </div>
  );
};
