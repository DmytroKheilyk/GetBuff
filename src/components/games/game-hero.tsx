import { cn } from "@/lib/utils";
import type { Game } from "@/lib/mock-games";

type GameHeroProps = {
  game: Game;
  onlineSellers: number;
  totalProducts: number;
};

function formatCount(count: number): string {
  return count.toLocaleString("ru-RU");
}

export function GameHero({ game, onlineSellers, totalProducts }: GameHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-60 blur-3xl",
          game.gradientFrom,
          game.gradientTo
        )}
      />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="container relative mx-auto px-4 py-10 sm:py-14">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-emerald-400">
          Каталог
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {game.name}
        </h1>
        <div className="mt-6 flex flex-wrap gap-6 sm:gap-10">
          <div>
            <p className="text-2xl font-bold text-emerald-400">
              {formatCount(onlineSellers)}
            </p>
            <p className="text-sm text-muted-foreground">продавцов онлайн</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatCount(totalProducts)}</p>
            <p className="text-sm text-muted-foreground">товаров в каталоге</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {formatCount(game.listingsCount)}
            </p>
            <p className="text-sm text-muted-foreground">всего лотов</p>
          </div>
        </div>
      </div>
    </section>
  );
}
