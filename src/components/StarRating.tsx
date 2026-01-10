import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showValue = true,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (!interactive) return;
    setAnimatingIndex(index);
    onRatingChange?.(index + 1);
    setTimeout(() => setAnimatingIndex(null), 300);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < displayRating;
          const isAnimating = animatingIndex === index;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(index)}
              onMouseEnter={() => interactive && setHoverRating(index + 1)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={cn(
                "transition-all duration-200",
                interactive && "cursor-pointer hover:scale-110",
                isAnimating && "animate-star-pulse"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors duration-200",
                  isFilled
                    ? "fill-star-filled text-star-filled"
                    : "fill-transparent text-star-empty"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
