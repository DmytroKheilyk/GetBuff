import { GameCard } from "@/components/home/game-card";
import type { Game } from "@/lib/games";

type PopularGamesGridProps = {
  games: Game[];
};

export function PopularGamesGrid({ games }: PopularGamesGridProps) {
  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            <span className="text-white">ПОПУЛЯРНЫЕ </span>
            <span className="text-neon-gradient">ИГРЫ</span>
          </h2>
          <p className="mt-2 text-zinc-500">
            Выберите игру — тысячи лотов ждут вас
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
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}
