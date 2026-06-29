"use client";

import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { FreshOffersSection } from "@/components/home/fresh-offers-section";
import { GameCard } from "@/components/home/game-card";
import { Input } from "@/components/ui/input";
import type { Game } from "@/lib/games";
import type { FreshOffer } from "@/lib/types/fresh-offer";

type HomePageContentProps = {
  games: Game[];
  freshOffers: FreshOffer[];
};

const searchInputClassName =
  "h-14 border-green-500/25 bg-black/50 pl-12 text-base shadow-[0_0_24px_rgba(34,197,94,0.08)] transition-all duration-300 placeholder:text-zinc-600 focus-visible:border-green-500/50 focus-visible:shadow-[0_0_32px_rgba(34,197,94,0.18)] focus-visible:ring-green-500/25";

export function HomePageContent({ games, freshOffers }: HomePageContentProps) {
  const [query, setQuery] = useState("");

  const filteredGames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return games;
    return games.filter((game) =>
      game.title.toLowerCase().includes(normalized)
    );
  }, [games, query]);

  return (
    <>
      <section className="mb-14 max-w-4xl">
        <p className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
          P2P · Без посредников · Мгновенно
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
          <span className="text-white">МАРКЕТПЛЕЙС </span>
          <span className="text-neon-gradient">ИГРОВЫХ</span>
          <br />
          <span className="text-neon-gradient drop-shadow-[0_0_30px_rgba(34,197,94,0.25)]">
            ЦЕННОСТЕЙ
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          Покупай и продавай скины, валюту и аккаунты напрямую. GetBuff —
          премиальный хаб для геймеров, которые знают цену своему луту.
        </p>

        <div className="relative mt-8 max-w-2xl">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-green-400/70" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск любимой игры..."
            className={searchInputClassName}
            aria-label="Поиск игр"
          />
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              <span className="text-white">ПОПУЛЯРНЫЕ </span>
              <span className="text-neon-gradient">ИГРЫ</span>
            </h2>
            <p className="mt-2 text-zinc-500">
              {query.trim()
                ? `Найдено: ${filteredGames.length} из ${games.length}`
                : "Выберите игру — тысячи лотов ждут вас"}
            </p>
          </div>
          <div className="hidden h-px flex-1 bg-linear-to-r from-green-500/40 to-transparent sm:block" />
        </div>

        {games.length === 0 ? (
          <div className="glass-panel rounded-xl px-6 py-16 text-center">
            <p className="text-lg font-bold text-white">Игры пока не добавлены</p>
            <p className="mt-2 text-sm text-zinc-500">
              Выполните скрипт{" "}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-green-400">
                schema.sql
              </code>{" "}
              в Supabase SQL Editor, чтобы наполнить каталог
            </p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="glass-panel animate-in fade-in zoom-in-95 rounded-xl px-6 py-16 text-center duration-300">
            <SearchX className="mx-auto size-10 text-zinc-600" />
            <p className="mt-4 text-lg font-bold text-white">Ничего не найдено</p>
            <p className="mt-2 text-sm text-zinc-500">
              По запросу «{query.trim()}» игр нет. Попробуйте другое название.
            </p>
          </div>
        ) : (
          <div
            key={query.trim().toLowerCase()}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filteredGames.map((game, index) => (
              <div
                key={game.id}
                className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300"
                style={{ animationDelay: `${Math.min(index, 7) * 40}ms` }}
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </section>

      <FreshOffersSection offers={freshOffers} />
    </>
  );
}
