import Link from "next/link";

import { CatalogImage } from "@/components/home/catalog-image";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  HOME_CATEGORIES,
  type CategoryBadge,
  type HomeCategory,
} from "@/lib/home-catalog";
import { cn } from "@/lib/utils";

function CategoryBadgeTag({ badge }: { badge: CategoryBadge }) {
  const label = badge === "new" ? "НОВОЕ" : "ХИТ";
  return (
    <Badge className="absolute -right-1 -top-1 z-10 border-0 bg-[#22c55e] px-1.5 py-0 text-[9px] font-bold uppercase tracking-wide text-white hover:bg-[#22c55e]">
      {label}
    </Badge>
  );
}

function CategoryIcon({ category }: { category: HomeCategory }) {
  return (
    <div
      className={cn(
        "size-16 overflow-hidden rounded-2xl border border-[#2a2d38] sm:size-20",
        "shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-200",
        "group-hover:scale-105 group-hover:border-[#4f8cff]/30 group-hover:shadow-[0_0_24px_rgba(79,140,255,0.18)]"
      )}
    >
      <CatalogImage
        src={category.imageSrc}
        alt={category.label}
        fallbackClass={category.fallbackTileClass}
        fallbackText={category.abbr}
        fit="cover"
      />
    </div>
  );
}

export function GameCategoryScroll() {
  return (
    <ScrollArea className="w-full">
      <div className="flex w-max gap-3 pb-3 sm:gap-4">
        {HOME_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className={cn(
              "group flex w-16 shrink-0 flex-col items-center gap-2 sm:w-20",
              category.disabled && "pointer-events-none opacity-50"
            )}
          >
            <div className="relative">
              {category.badge && <CategoryBadgeTag badge={category.badge} />}
              <CategoryIcon category={category} />
            </div>
            <div className="w-full text-center leading-tight">
              <span className="block truncate text-[11px] font-semibold text-[#e8eaef] sm:text-xs">
                {category.label}
              </span>
              {category.subtitle && (
                <span className="block truncate text-[10px] text-[#8b9199]">
                  {category.subtitle}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="h-1.5" />
    </ScrollArea>
  );
}
