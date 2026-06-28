import { GameCard } from "@/components/home/game-card";
import { popularGames } from "@/lib/mock-games";

export function PopularGamesGrid() {
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {popularGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
