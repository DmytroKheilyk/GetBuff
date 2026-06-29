import { Star } from "lucide-react";

import { formatReviewCount } from "@/lib/types/review";
import { cn } from "@/lib/utils";

type SellerRatingDisplayProps = {
  reviewAverage: number | null;
  reviewCount: number;
  className?: string;
};

export function SellerRatingDisplay({
  reviewAverage,
  reviewCount,
  className,
}: SellerRatingDisplayProps) {
  if (reviewCount === 0 || reviewAverage === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium text-zinc-500",
          className
        )}
      >
        <Star className="size-3 fill-zinc-600 text-zinc-600" />
        Новый продавец
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium text-amber-400/90",
        className
      )}
    >
      <Star className="size-3 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]" />
      <span className="tabular-nums">{reviewAverage.toFixed(1)}</span>
      <span className="text-zinc-500">({formatReviewCount(reviewCount)})</span>
    </span>
  );
}
