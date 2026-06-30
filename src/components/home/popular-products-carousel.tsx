"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { PopularProductCard } from "@/components/home/popular-product-card";
import type { PopularProductCardData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SCROLL_STEP = 300;

type PopularProductsCarouselProps = {
  products: PopularProductCardData[];
};

export function PopularProductsCarousel({
  products,
}: PopularProductsCarouselProps) {
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
      scrollRef.current.scrollLeft += e.deltaY * 1.2;
    }
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
      }
    };

    element.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div className="group relative mt-6 min-w-0">
      <button
        type="button"
        aria-label="Прокрутить товары влево"
        onClick={() => scrollByStep("left")}
        className={cn(
          "absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-neutral-200",
          "bg-white/90 p-2 text-neutral-900 shadow-lg backdrop-blur",
          "opacity-0 transition-opacity group-hover:opacity-100 md:block",
          "dark:border-neutral-800 dark:bg-background/80 dark:text-foreground"
        )}
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Прокрутить товары вправо"
        onClick={() => scrollByStep("right")}
        className={cn(
          "absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-neutral-200",
          "bg-white/90 p-2 text-neutral-900 shadow-lg backdrop-blur",
          "opacity-0 transition-opacity group-hover:opacity-100 md:block",
          "dark:border-neutral-800 dark:bg-background/80 dark:text-foreground"
        )}
      >
        <ChevronRight className="size-5" />
      </button>

      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className={cn(
          "flex w-full items-stretch gap-4 overflow-x-auto pb-4 pt-2",
          "scrollbar-none snap-x snap-mandatory"
        )}
      >
        {products.map((product) => (
          <PopularProductCard
            key={product.id}
            product={product}
            className="w-[180px] shrink-0 snap-start sm:w-[220px]"
          />
        ))}
      </div>
    </div>
  );
}
