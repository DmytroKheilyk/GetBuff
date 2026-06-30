import Link from "next/link";

import { CatalogImage } from "@/components/home/catalog-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  formatPriceFrom,
  type CategoryBadge,
  type ShowcaseGame,
} from "@/lib/home-catalog";
import { cn } from "@/lib/utils";

type ShowcaseGameCardProps = {
  game: ShowcaseGame;
};

function GameBadge({ badge }: { badge: CategoryBadge }) {
  const label = badge === "new" ? "НОВОЕ" : "ХИТ";
  return (
    <Badge className="absolute left-2 top-2 z-10 border-0 bg-[#22c55e] px-2 py-0.5 text-[10px] font-bold uppercase text-white hover:bg-[#22c55e]">
      {label}
    </Badge>
  );
}

export function ShowcaseGameCard({ game }: ShowcaseGameCardProps) {
  const isDisabled = game.href === "#";

  const content = (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-border bg-[#1c1e27] p-0",
        "shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300",
        "hover:scale-[1.02] hover:border-[#4f8cff]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
        isDisabled && "opacity-60"
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-square">
        {game.badge && <GameBadge badge={game.badge} />}
        <CatalogImage
          src={game.posterSrc}
          alt={game.title}
          fallbackClass={game.fallbackTileClass}
          fallbackText={game.abbr}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="space-y-0.5 border-t border-border bg-[#1c1e27] p-3">
        <h3 className="truncate text-sm font-bold text-[#e8eaef]">
          {game.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] text-[#8b9199]">
            {game.categoryLabel}
          </p>
          <p className="shrink-0 text-xs font-bold tabular-nums text-[#4f8cff]">
            {formatPriceFrom(game.priceFrom)}
          </p>
        </div>
      </div>
    </Card>
  );

  if (isDisabled) {
    return <div className="group block cursor-default">{content}</div>;
  }

  return (
    <Link href={game.href} className="group block">
      {content}
    </Link>
  );
}
