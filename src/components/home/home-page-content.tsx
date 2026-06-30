"use client";

import { SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CategoriesCarousel } from "@/components/home/categories-carousel";
import { HomePromoBanner } from "@/components/home/home-promo-banner";
import { PopularProductsCarousel } from "@/components/home/popular-products-carousel";
import {
  filterMockProducts,
  toPopularProductCard,
  type MockProduct,
} from "@/lib/mock-data";

const POPULAR_PRODUCTS_LIMIT = 15;

type HomePageContentProps = {
  initialSearch?: string;
  products: MockProduct[];
};

export function HomePageContent({
  initialSearch = "",
  products,
}: HomePageContentProps) {
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  const filteredProducts = useMemo(() => {
    const filtered = filterMockProducts(products, query);
    if (query.trim()) return filtered;
    return products.slice(0, POPULAR_PRODUCTS_LIMIT);
  }, [products, query]);

  const cardProducts = useMemo(
    () => filteredProducts.map(toPopularProductCard),
    [filteredProducts]
  );

  return (
    <div className="space-y-7 sm:space-y-9">
      <HomePromoBanner />

      <section aria-label="Категории маркетплейса" className="min-w-0">
        <CategoriesCarousel />
      </section>

      <section aria-label="Популярные товары" className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaef] sm:text-xl">
            Популярные товары
          </h2>
          {query.trim() ? (
            <span className="text-xs text-gray-500 dark:text-[#8b9199]">
              Найдено: {cardProducts.length}
            </span>
          ) : (
            <span className="text-xs text-gray-500 dark:text-[#8b9199]">
              Топ-{POPULAR_PRODUCTS_LIMIT}
            </span>
          )}
        </div>

        {cardProducts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-100 px-6 py-14 text-center dark:border-[#2a2d38] dark:bg-[#181a21]">
            <SearchX className="mx-auto size-9 text-gray-400 dark:text-[#6b7289]" />
            <p className="mt-3 font-semibold text-gray-900 dark:text-[#e8eaef]">
              Ничего не найдено
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#8b9199]">
              По запросу «{query.trim()}» товаров нет
            </p>
          </div>
        ) : (
          <PopularProductsCarousel products={cardProducts} />
        )}
      </section>
    </div>
  );
}
