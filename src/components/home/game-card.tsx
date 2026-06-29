import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Game } from "@/lib/games";
import { cn } from "@/lib/utils";

type GameCardProps = {
  game: Game;
};

function formatListingsCount(count: number): string {
  return count.toLocaleString("ru-RU");
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <Card className="glass-panel relative overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-green-500/50 hover:shadow-[0_0_40px_-8px_rgba(34,197,94,0.35)]">
        <div className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-b from-green-500/0 to-green-500/0 opacity-0 transition-opacity duration-300 group-hover:from-green-500/10 group-hover:to-transparent group-hover:opacity-100" />
        <div
          className={cn(
            "relative flex h-40 items-end overflow-hidden bg-linear-to-br p-4",
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
                className="absolute inset-0 size-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(74,222,128,0.2),transparent_55%)]" />
            </>
          )}
          <span className="relative text-xs font-bold uppercase tracking-[0.25em] text-green-400/80">
            {game.slug}
          </span>
        </div>
        <CardHeader className="relative pb-2">
          <CardTitle className="text-base font-bold text-white">
            {game.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative pb-5">
          <Badge className="border-green-500/20 bg-green-500/10 font-semibold text-green-400 hover:bg-green-500/10">
            {formatListingsCount(game.listingsCount)} лотов
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
