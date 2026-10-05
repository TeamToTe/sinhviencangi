import React, { useState } from 'react';
import catGif from '../../assets/Catty Scuba Cat GIF.gif';
import { X } from 'lucide-react';

export const FloatingGif: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-3 right-3 z-[990] bg-white/90 hover:bg-white text-gray-600 hover:text-emerald-700 p-2 rounded-full shadow-lg border border-emerald-100 transition-all hover:scale-110 cursor-pointer text-xs flex items-center justify-center"
        title="Hiện bé mèo"
      >
        🐱
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 z-[990] group select-none pointer-events-auto">
      {/* Container with shadow & hover interaction */}
      <div className="relative bg-white/90 backdrop-blur-xs p-1 rounded-2xl shadow-xl border border-emerald-200/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Close Button (appears on hover or easily clickable) */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -left-2 w-5 h-5 bg-gray-800/80 hover:bg-gray-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer z-10"
          title="Ẩn"
        >
          <X className="w-3 h-3" />
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
