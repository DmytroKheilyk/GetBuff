"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { CatalogImage } from "@/components/home/catalog-image";
import {
  getCategoryHref,
  HOME_CATEGORIES,
  type CategoryBadge,
  type HomeCategory,
} from "@/lib/home-catalog";
import { cn } from "@/lib/utils";

const SCROLL_STEP = 240;

function CategoryBadgeTag({ badge }: { badge: CategoryBadge }) {
  const label = badge === "new" ? "НОВОЕ" : "ХИТ";

  return (
    <span className="pointer-events-none absolute -top-1.5 -right-1.5 z-20 inline-flex rounded-full bg-[#22c55e] px-2 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-white shadow-[0_2px_8px_rgba(34,197,94,0.35)]">
      {label}
    </span>
  );
}

function CategoryIcon({ category }: { category: HomeCategory }) {
  return (
    <div
      className={cn(
        "size-16 rounded-2xl border border-gray-200 dark:border-[#2a2d38] sm:size-20",
        "shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)]",
        "group-hover/card:scale-105 group-hover/card:border-[#4f8cff]/30 group-hover/card:shadow-[0_0_24px_rgba(79,140,255,0.18)]"
      )}
    >
      <CatalogImage
        src={category.imageSrc}
        alt={category.label}
        fallbackClass={category.fallbackTileClass}
        fallbackText={category.abbr}
        fit="cover"
        roundedClass="rounded-2xl"
      />
    </div>
  );
}

export function CategoriesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByStep = useCallback((direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth",
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        element.scrollLeft += event.deltaY;
      }
    };

    element.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div className="group/carousel relative min-w-0">
      <button
        type="button"
        aria-label="Прокрутить категории влево"
        onClick={() => scrollByStep("left")}
        className={cn(
          "absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-border",
          "bg-background/80 p-2 text-foreground opacity-0 shadow-lg backdrop-blur",
          "transition-opacity group-hover/carousel:opacity-100 md:block"
        )}
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Прокрутить категории вправо"
        onClick={() => scrollByStep("right")}
        className={cn(
          "absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-border",
          "bg-background/80 p-2 text-foreground opacity-0 shadow-lg backdrop-blur",
          "transition-opacity group-hover/carousel:opacity-100 md:block"
        )}
      >
        <ChevronRight className="size-5" />
      </button>

      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className={cn(
          "flex w-full flex-nowrap items-start gap-4 overflow-x-auto pb-3 pt-2",
          "scrollbar-none"
        )}
      >
        {HOME_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={getCategoryHref(category.slug)}
            className="group/card flex w-[72px] shrink-0 flex-col items-center overflow-visible sm:w-20"
          >
            <div className="relative h-[72px] w-full shrink-0 overflow-visible pt-2 pr-2 sm:h-20">
              {category.badge && <CategoryBadgeTag badge={category.badge} />}
              <CategoryIcon category={category} />
            </div>

            <div className="mt-2 flex h-10 w-full items-start justify-center text-center">
              <p
                className={cn(
                  "line-clamp-2 max-w-[80px] text-xs font-medium text-gray-900 dark:text-white sm:max-w-[100px] sm:text-sm",
                  "leading-tight"
                )}
              >
                {category.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
