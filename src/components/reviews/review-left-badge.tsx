import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type ReviewLeftBadgeProps = {
  rating: number;
  className?: string;
};

export function ReviewLeftBadge({ rating, className }: ReviewLeftBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.12)]",
        className
      )}
    >
      <Star className="size-4 fill-amber-400 text-amber-400" />
      <span>Отзыв оставлен</span>
      <span className="tabular-nums text-amber-400">({rating} ★)</span>
    </div>
  );
}
