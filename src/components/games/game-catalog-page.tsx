"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { GameOfferCard } from "@/components/games/game-offer-card";
import type { Offer } from "@/lib/offers";
import {
  getCategoryDisplayLabel,
  matchesCategory,
  normalizeCategory,
  type OfferCategory,
} from "@/lib/types/offer";
import { cn } from "@/lib/utils";

type GameFilterId = "all" | OfferCategory | "keys";

const GAME_FILTERS: { id: GameFilterId; label: string }[] = [
  { id: "all", label: "Все товары" },
  { id: "accounts", label: "Аккаунты" },
  { id: "currency", label: "Валюта" },
  { id: "keys", label: "Ключи" },
  { id: "boost", label: "Услуги" },
];

type GameCatalogPageProps = {
  gameTitle: string;
  gameSlug: string;
  offers: Offer[];
  initialSeller?: string;
};

function filterByTab(offers: Offer[], filter: GameFilterId): Offer[] {
  if (filter === "all") return offers;
  if (filter === "keys") {
    return offers.filter(
      (offer) =>
        offer.categoryRaw.toLowerCase() === "keys" ||
        normalizeCategory(offer.categoryRaw) === "items"
    );
  }
  return offers.filter((offer) => matchesCategory(offer.categoryRaw, filter));
}

export function GameCatalogPage({
  gameTitle,
  gameSlug,
  offers,
  initialSeller = "",
}: GameCatalogPageProps) {
  const [activeFilter, setActiveFilter] = useState<GameFilterId>("all");
  const [sellerQuery] = useState(initialSeller);

  const filteredOffers = useMemo(() => {
    let result = filterByTab(offers, activeFilter);

    const normalizedSeller = sellerQuery.trim().toLowerCase();
    if (normalizedSeller) {
      result = result.filter((offer) =>
        offer.seller.nickname.toLowerCase().includes(normalizedSeller)
      );
    }

    return result;
  }, [offers, activeFilter, sellerQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {GAME_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
              activeFilter === filter.id
                ? "border-[#4f8cff] bg-[#4f8cff]/10 text-[#2563eb] shadow-sm dark:bg-[#4f8cff]/15 dark:text-white dark:shadow-[0_0_18px_rgba(79,140,255,0.15)]"
                : "border-neutral-200 bg-neutral-100 text-neutral-800 hover:border-[#4f8cff]/35 dark:border-neutral-800 dark:bg-[#1c1e27] dark:text-muted-foreground dark:hover:text-white"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredOffers.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center dark:border-neutral-800 dark:bg-[#1c1e27]">
          <p className="text-lg font-bold text-neutral-900 dark:text-white">
            В этой категории пока нет активных объявлений
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Станьте первым продавцом {gameTitle}! Выставьте лот — он сразу
            появится в каталоге.
          </p>
          <Button
            asChild
            className="mt-8 rounded-xl bg-linear-to-r from-[#4f8cff] to-[#6ba1ff] font-bold text-white hover:from-[#6ba1ff] hover:to-[#8bb5ff]"
          >
            <Link href="/sell">
              <Plus className="size-4" />
              Выставить товар
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredOffers.map((offer) => (
            <GameOfferCard
              key={offer.id}
              offer={offer}
              categoryLabel={getCategoryDisplayLabel(offer.categoryRaw)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
