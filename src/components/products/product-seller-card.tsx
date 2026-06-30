import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInitial } from "@/lib/chat-ui";
import {
  formatDealsCount,
  type ProductOffer,
} from "@/lib/types/product-offer";
import { cn } from "@/lib/utils";

type ProductSellerCardProps = {
  offer: ProductOffer;
};

function SellerStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index + 1 <= Math.floor(rounded);
        const half = !filled && index + 0.5 === rounded;

        return (
          <Star
            key={index}
            className={cn(
              "size-3.5",
              filled || half
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        );
      })}
    </div>
  );
}

export function ProductSellerCard({ offer }: ProductSellerCardProps) {
  const { seller } = offer;
  const displayRating =
    seller.reviewAverage ?? (seller.reviewCount > 0 ? seller.rating : null);
  const dealsCount = Math.max(
    offer.completedDealsCount,
    seller.reviewCount
  );
  const sellerProfileHref = seller.id ? `/users/${seller.id}` : null;

  const sellerInfo = (
    <div className="flex min-w-0 items-center gap-4">
      <Avatar className="size-14 border-2 border-primary/30">
        <AvatarFallback
          className={cn(
            "text-lg font-bold",
            seller.avatarColor
          )}
        >
          {getInitial(seller.nickname)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-base font-bold text-neutral-900 dark:text-white">
            {seller.nickname}
          </p>
          {seller.online && (
            <Badge className="border-0 bg-[#22c55e]/15 px-2 py-0 text-[10px] font-semibold text-[#22c55e] hover:bg-[#22c55e]/15">
              <span className="mr-1 inline-block size-1.5 rounded-full bg-[#22c55e]" />
              В сети
            </Badge>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          {displayRating !== null ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400">
              <SellerStars rating={displayRating} />
              <span className="tabular-nums">{displayRating.toFixed(1)}</span>
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Новый продавец
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            {formatDealsCount(dealsCount)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm dark:border-neutral-800 dark:bg-[#1c1e27] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {sellerProfileHref ? (
          <Link
            href={sellerProfileHref}
            className="-m-2 min-w-0 rounded-xl p-2 transition-colors hover:bg-neutral-100/80 dark:hover:bg-[#14161d]/80"
          >
            {sellerInfo}
          </Link>
        ) : (
          sellerInfo
        )}

        <Button
          asChild
          variant="outline"
          className="shrink-0 rounded-xl border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-transparent dark:text-neutral-100 dark:hover:bg-[#12131a]"
        >
          <Link
            href={
              sellerProfileHref ??
              `/games/${offer.gameSlug}?seller=${encodeURIComponent(seller.nickname)}`
            }
          >
            Все товары продавца
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
