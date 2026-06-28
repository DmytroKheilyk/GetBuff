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

function StatBlock({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="glass-panel rounded-xl px-5 py-4">
      <p
        className={cn(
          "text-2xl font-black tabular-nums",
          accent ? "text-neon-gradient" : "text-white"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </p>
    </div>
  );
}

export function GameHero({ game, onlineSellers, totalProducts }: GameHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80">
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-40 blur-3xl",
          game.gradientFrom,
          game.gradientTo
        )}
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_60%)]" />

      <div className="container relative mx-auto px-4 py-10 sm:py-14">
        <p className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.25em] text-green-400">
          ◆ Каталог лотов
        </p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
          {game.name}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <StatBlock
            value={formatCount(onlineSellers)}
            label="продавцов онлайн"
            accent
          />
          <StatBlock
            value={formatCount(totalProducts)}
            label="товаров в каталоге"
          />
          <StatBlock
            value={formatCount(game.listingsCount)}
            label="всего лотов"
          />
        </div>
      </div>
    </section>
  );
}
