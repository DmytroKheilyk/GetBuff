import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Game } from "@/lib/mock-games";
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
      <Card className="overflow-hidden border-border/60 bg-card/80 py-0 transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/40 hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.25)]">
        <div
          className={cn(
            "relative flex h-36 items-end bg-linear-to-br p-4",
            game.gradientFrom,
            game.gradientTo
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <span className="relative text-xs font-semibold uppercase tracking-widest text-white/70">
            {game.slug}
          </span>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{game.name}</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10"
          >
            {formatListingsCount(game.listingsCount)} лотов
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
