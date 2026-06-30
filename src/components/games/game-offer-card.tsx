import Link from "next/link";

import { SellerRatingDisplay } from "@/components/reviews/seller-rating-display";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Offer } from "@/lib/offers";
import { cn } from "@/lib/utils";

type GameOfferCardProps = {
  offer: Offer;
  categoryLabel: string;
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function GameOfferCard({ offer, categoryLabel }: GameOfferCardProps) {
  const preview = offer.description.split("\n")[0] ?? offer.description;

  return (
    <Link href={`/products/${offer.id}`} className="group block h-full">
      <Card
        className={cn(
          "flex h-full flex-col rounded-2xl border-border bg-[#1c1e27] p-0",
          "transition-all duration-300 hover:border-[#4f8cff]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="border-b border-border p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <Badge
              variant="outline"
              className="rounded-full border-border bg-[#12131a] text-[11px] text-[#e8eaef]"
            >
              {categoryLabel}
            </Badge>
            <span className="text-lg font-black tabular-nums text-[#4f8cff]">
              {formatPrice(offer.price)}
            </span>
          </div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#e8eaef] group-hover:text-[#6ba1ff]">
            {preview}
          </h3>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 p-4 pt-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#e8eaef]">
              {offer.seller.nickname}
            </p>
            <SellerRatingDisplay
              reviewAverage={offer.seller.reviewAverage}
              reviewCount={offer.seller.reviewCount}
            />
          </div>
          {offer.seller.online && (
            <Badge className="shrink-0 rounded-full border-0 bg-[#22c55e]/15 px-2 py-0.5 text-[10px] font-bold text-[#22c55e] hover:bg-[#22c55e]/15">
              В сети
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
