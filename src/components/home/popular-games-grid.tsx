import { GameCard } from "@/components/home/game-card";
import { popularGames } from "@/lib/mock-games";

export function PopularGamesGrid() {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Популярные игры
        </h2>
        <p className="mt-2 text-muted-foreground">
          Выберите игру и найдите нужные предметы среди тысяч лотов
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {popularGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
