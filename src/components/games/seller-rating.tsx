import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type SellerRatingProps = {
  rating: number;
};

export function SellerRating({ rating }: SellerRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3",
            index < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : index < rating
                ? "fill-amber-400/50 text-amber-400/50"
                : "fill-muted text-muted-foreground/30"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
