"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type StarRatingPickerProps = {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
};

export function StarRatingPicker({
  value,
  onChange,
  disabled = false,
}: StarRatingPickerProps) {
  const [hovered, setHovered] = useState(0);

  const activeRating = hovered || value;

  return (
    <div
      className="flex items-center gap-1.5"
      onMouseLeave={() => setHovered(0)}
      role="radiogroup"
      aria-label="Оценка от 1 до 5 звёзд"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isLit = star <= activeRating;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            disabled={disabled}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
            className={cn(
              "group relative rounded-lg p-1 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Star
              className={cn(
                "size-9 transition-all duration-300",
                isLit
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.65)] scale-110"
                  : "fill-transparent text-zinc-700 group-hover:text-amber-400/40 group-hover:scale-105"
              )}
            />
            {isLit && (
              <span className="pointer-events-none absolute inset-0 animate-ping rounded-lg bg-amber-400/10 opacity-75" />
            )}
          </button>
        );
      })}
    </div>
  );
}
