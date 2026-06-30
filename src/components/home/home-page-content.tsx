"use client";

import { SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CategoriesCarousel } from "@/components/home/categories-carousel";
import { HomePromoBanner } from "@/components/home/home-promo-banner";
import { ShowcaseGameCard } from "@/components/home/showcase-game-card";
import {
  buildShowcaseGames,
  filterShowcaseGames,
} from "@/lib/home-catalog";
import type { Game } from "@/lib/games";

type HomePageContentProps = {
  games: Game[];
  initialSearch?: string;
};

export function HomePageContent({
  games,
  initialSearch = "",
}: HomePageContentProps) {
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  const showcaseGames = useMemo(() => buildShowcaseGames(games), [games]);

  const filteredGames = useMemo(
    () => filterShowcaseGames(showcaseGames, query),
    [showcaseGames, query]
  );

  return (
    <div className="space-y-7 sm:space-y-9">
      <HomePromoBanner />

      <section aria-label="Категории маркетплейса" className="min-w-0">
        <CategoriesCarousel />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaef] sm:text-xl">
            Популярные игры
          </h2>
          {query.trim() && (
            <span className="text-xs text-gray-500 dark:text-[#8b9199]">
              Найдено: {filteredGames.length}
            </span>
          )}
        </div>

        {filteredGames.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-100 px-6 py-14 text-center dark:border-[#2a2d38] dark:bg-[#181a21]">
            <SearchX className="mx-auto size-9 text-gray-400 dark:text-[#6b7289]" />
            <p className="mt-3 font-semibold text-gray-900 dark:text-[#e8eaef]">
              Ничего не найдено
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#8b9199]">
              По запросу «{query.trim()}» игр нет
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {filteredGames.map((game) => (
              <ShowcaseGameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
