import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showText?: boolean;
  reviewCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 14,
  showText = true,
  reviewCount,
}) => {
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-bold text-gray-800 ml-0.5">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-gray-600 font-normal ml-0.5">
              ({reviewCount})
            </span>
          )}
        </span>
      )}
    </div>
  );
};
