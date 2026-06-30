"use client";

import { useMemo, useState } from "react";

import { CatalogEmptyState } from "@/components/games/catalog-empty-state";
import { OfferFilters } from "@/components/games/offer-filters";
import { OffersTable } from "@/components/games/offers-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  filterOffers,
  matchesCategory,
  OFFER_CATEGORIES,
  type Offer,
  type OfferCategory,
  type SortOption,
} from "@/lib/offers";

type GameCatalogProps = {
  offers: Offer[];
  gameTitle: string;
  initialSearch?: string;
  initialCategory?: OfferCategory;
};

export function GameCatalog({
  offers,
  gameTitle,
  initialSearch = "",
  initialCategory = "currency",
}: GameCatalogProps) {
  const [category, setCategory] = useState<OfferCategory>(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortOption>("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredOffers = useMemo(
    () =>
      filterOffers(offers, {
        category,
        search,
        minPrice,
        maxPrice,
        sort,
      }),
    [offers, category, search, minPrice, maxPrice, sort]
  );

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        OFFER_CATEGORIES.map((cat) => [
          cat.id,
          offers.filter((o) => matchesCategory(o.categoryRaw, cat.id)).length,
        ])
      ) as Record<OfferCategory, number>,
    [offers]
  );

  if (offers.length === 0) {
    return <CatalogEmptyState variant="game" gameTitle={gameTitle} />;
  }

  return (
    <Tabs
      value={category}
      onValueChange={(value) => setCategory(value as OfferCategory)}
      className="gap-6"
    >
      <TabsList className="glass-panel h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
        {OFFER_CATEGORIES.map((cat) => (
          <TabsTrigger
            key={cat.id}
            value={cat.id}
            className="font-semibold text-zinc-400 transition-all duration-300 data-active:border-green-500/30 data-active:bg-green-500/15 data-active:text-green-400 data-active:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
          >
            {cat.label}
            {categoryCounts[cat.id] > 0 && (
              <span className="ml-1.5 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] text-green-400">
                {categoryCounts[cat.id]}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {OFFER_CATEGORIES.map((cat) => (
        <TabsContent key={cat.id} value={cat.id} className="space-y-4">
          <OfferFilters
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
          />
          {filteredOffers.length === 0 ? (
            <CatalogEmptyState variant="category" />
          ) : (
            <OffersTable offers={filteredOffers} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
