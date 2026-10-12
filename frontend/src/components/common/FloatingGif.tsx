import React, { useState } from 'react';
import catGif from '../../assets/Catty Scuba Cat GIF.gif';
import { X, Sparkles } from 'lucide-react';

export const FloatingGif: React.FC = () => {
  // Mặc định ẩn trên màn hình điện thoại (< 640px), chỉ hiện trên desktop
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 640;
    }
    return false;
  });

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-12 sm:bottom-4 right-3 sm:right-4 z-[990] bg-white/95 hover:bg-white text-gray-600 hover:text-emerald-700 p-2.5 rounded-full shadow-lg border border-emerald-200 transition-all hover:scale-110 active:scale-95 cursor-pointer text-xs flex items-center justify-center"
        title="Hiện bé mèo"
        aria-label="Hiện bé mèo"
      >
        <Sparkles className="w-4 h-4 text-emerald-600" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-12 sm:bottom-4 right-3 sm:right-4 z-[990] select-none pointer-events-auto">
      {/* Container with shadow & hover interaction */}
      <div className="relative bg-white/95 backdrop-blur-xs p-1.5 rounded-2xl shadow-xl border border-emerald-200/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Nút X đóng bé mèo - luôn hiển thị nổi bật dễ bấm */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900/90 hover:bg-black text-white rounded-full flex items-center justify-center shadow-lg border border-white/60 cursor-pointer z-10 transition-transform active:scale-90"
          title="Đóng bé mèo"
          aria-label="Đóng bé mèo"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Small GIF Image */}
        <img
          src={catGif}
          alt="Catty Scuba Cat"
          className="w-20 sm:w-24 h-auto rounded-xl object-contain pointer-events-none block"
        />
      </div>
    </div>
  );
};
