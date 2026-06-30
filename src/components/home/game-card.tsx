import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Game } from "@/lib/games";
import { cn } from "@/lib/utils";

type GameCardProps = {
  game: Game;
};

function formatListingsCount(count: number): string {
  if (count === 0) return "Нет лотов";
  return `${count.toLocaleString("ru-RU")} лотов`;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <Card className="overflow-hidden rounded-2xl border-[#2a2d38] bg-[#181a21] p-0 transition-all duration-200 hover:border-[#4f8cff]/35 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden bg-linear-to-br",
            !game.imageUrl && game.gradientFrom,
            !game.imageUrl && game.gradientTo
          )}
        >
          {game.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.imageUrl}
                alt=""
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#181a21] via-transparent to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,140,255,0.2),transparent_55%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black uppercase tracking-wider text-white/20">
                  {game.title.slice(0, 3)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-1 p-3">
          <h3 className="truncate text-sm font-bold text-[#e8eaef] sm:text-base">
            {game.title}
          </h3>
          <p className="text-xs text-[#8b9199]">
            {formatListingsCount(game.listingsCount)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
