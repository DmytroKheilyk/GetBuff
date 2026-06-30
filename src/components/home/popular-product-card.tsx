import Link from "next/link";
import { Zap } from "lucide-react";

import { CatalogImage } from "@/components/home/catalog-image";
import { formatProductPrice } from "@/lib/home-catalog";
import type { PopularProductCardData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type PopularProductCardProps = {
  product: PopularProductCardData;
  className?: string;
};

function ProductPreview({ product }: { product: PopularProductCardData }) {
  if (product.imageSrc) {
    return (
      <CatalogImage
        src={product.imageSrc}
        alt={product.title}
        fallbackClass={product.fallbackTileClass}
        fallbackText={product.gameAbbr}
        roundedClass="rounded-xl"
        className="size-full"
      />
    );
  }

  return (
    <div
      className={cn(
        "relative size-full overflow-hidden rounded-xl",
        "bg-linear-to-br from-neutral-200/90 via-neutral-100/80 to-neutral-200/70",
        "dark:from-[#1c1e27]/95 dark:via-[#14161d]/90 dark:to-[#0e1015]/95"
      )}
    >
      <div className="absolute inset-0 bg-neutral-900/5 dark:bg-black/25" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-14 overflow-hidden rounded-full opacity-35 dark:opacity-25">
          <CatalogImage
            src={product.gameIconSrc}
            alt={product.gameLabel}
            fallbackClass={product.fallbackTileClass}
            fallbackText={product.gameAbbr}
            fit="cover"
            roundedClass="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export function PopularProductCard({ product, className }: PopularProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={cn("group block h-full", className)}
    >
      <div
        className={cn(
          "flex h-full cursor-pointer flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-3",
          "transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
          "dark:border-neutral-800/40 dark:bg-[#1c1e27]"
        )}
      >
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <div className="size-4 shrink-0 overflow-hidden rounded-full">
            <CatalogImage
              src={product.gameIconSrc}
              alt={product.gameLabel}
              fallbackClass={product.fallbackTileClass}
              fallbackText={product.gameAbbr}
              fit="cover"
              roundedClass="rounded-full"
            />
          </div>
          <span className="truncate">
            {product.gameLabel} • {product.categoryLabel}
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 h-10 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {product.title}
        </h3>

        <div className="mt-2 aspect-video w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-[#14161d]">
          <ProductPreview product={product} />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-base font-bold text-neutral-900 dark:text-white">
            {formatProductPrice(product.price)}
          </span>
          {product.instantDelivery && (
            <span className="inline-flex max-w-full items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium leading-tight text-emerald-600 dark:text-emerald-500 sm:text-[11px]">
              <Zap className="size-3 shrink-0" />
              <span className="truncate">Моментально</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
