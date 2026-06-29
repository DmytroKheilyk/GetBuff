"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { SellerRatingDisplay } from "@/components/reviews/seller-rating-display";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FreshOffer } from "@/lib/types/fresh-offer";
import { getGameGradients } from "@/lib/types/game";
import { cn } from "@/lib/utils";

type FreshOfferCardProps = {
  offer: FreshOffer;
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

function truncateDescription(text: string, max = 90): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function FreshOfferCard({ offer }: FreshOfferCardProps) {
  const { gradientFrom, gradientTo } = getGameGradients(offer.gameSlug);

  return (
    <Link href={`/games/${offer.gameSlug}`} className="group block w-full">
      <Card className="glass-panel relative h-full overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/50 hover:shadow-[0_0_32px_-8px_rgba(34,197,94,0.35)]">
        <div className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-b from-green-500/0 to-green-500/0 opacity-0 transition-opacity duration-300 group-hover:from-green-500/10 group-hover:to-transparent group-hover:opacity-100" />

        <div
          className={cn(
            "relative flex h-24 items-end bg-linear-to-br p-3",
            gradientFrom,
            gradientTo
          )}
        >
          <div className="absolute inset-0 bg-black/40" />
          {offer.gameImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={offer.gameImageUrl}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-40 mix-blend-overlay"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(74,222,128,0.2),transparent_55%)]" />
          )}
          <Badge className="relative border-green-500/30 bg-black/50 text-[10px] font-bold uppercase tracking-wider text-green-400">
            {offer.gameTitle}
          </Badge>
        </div>

        <CardHeader className="relative space-y-2 pb-2">
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-300">
            {truncateDescription(offer.description)}
          </p>
        </CardHeader>

        <CardContent className="relative space-y-3 pb-5">
          <div className="space-y-1">
            <p className="truncate text-xs font-semibold text-zinc-400">
              {offer.sellerName}
            </p>
            <SellerRatingDisplay
              reviewAverage={offer.reviewAverage}
              reviewCount={offer.reviewCount}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.35)]">
              {formatPrice(offer.price)}
            </span>
            <Sparkles className="size-4 text-green-500/40 transition-colors group-hover:text-green-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
