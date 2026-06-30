"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { CatalogImage } from "@/components/home/catalog-image";
import { formatProductPrice } from "@/lib/home-catalog";
import {
  filterMockProducts,
  mockProducts,
  toPopularProductCard,
  USE_MOCK_DATA,
  type MockProduct,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SEARCH_PRODUCTS = USE_MOCK_DATA ? mockProducts : [];
const MAX_RESULTS = 12;

type HeaderSearchProps = {
  className?: string;
  inputClassName?: string;
};

export function HeaderSearch({ className, inputClassName }: HeaderSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<MockProduct[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setResults(filterMockProducts(SEARCH_PRODUCTS, trimmed).slice(0, MAX_RESULTS));
    setIsDropdownOpen(true);
  }, [searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setResults([]);
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setIsDropdownOpen(false);
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      clearSearch();
    }
  }

  function handleResultClick() {
    clearSearch();
  }

  const trimmedQuery = searchQuery.trim();
  const showDropdown = isDropdownOpen && trimmedQuery.length > 0;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (trimmedQuery) setIsDropdownOpen(true);
          }}
          placeholder="Поиск игр, ключей и услуг..."
          className={cn(
            "h-10 w-full rounded-2xl border-none bg-muted/50 pl-10 pr-10",
            "text-sm text-neutral-900 placeholder:text-muted-foreground",
            "transition-all duration-200 outline-none",
            "focus-visible:ring-1 focus-visible:ring-primary",
            "dark:text-neutral-100",
            inputClassName
          )}
          aria-label="Поиск игр, ключей и услуг"
          aria-expanded={showDropdown}
          aria-controls="header-search-results"
          autoComplete="off"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Очистить поиск"
            className={cn(
              "absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5",
              "text-muted-foreground transition-colors hover:text-foreground"
            )}
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div
          id="header-search-results"
          role="listbox"
          aria-label="Результаты поиска"
          className={cn(
            "absolute top-full left-0 z-[60] mt-2 w-full",
            "max-h-[380px] overflow-y-auto rounded-xl border",
            "border-neutral-200 bg-white shadow-xl",
            "dark:border-neutral-800 dark:bg-[#1c1e27]"
          )}
        >
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Ничего не найдено по запросу «{trimmedQuery}»
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {results.map((product) => {
                const card = toPopularProductCard(product);

                return (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      role="option"
                      onClick={handleResultClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5",
                        "transition-colors hover:bg-neutral-50",
                        "dark:hover:bg-[#14161d]"
                      )}
                    >
                      <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
                        {product.image ? (
                          <CatalogImage
                            src={product.image}
                            alt={product.title}
                            fallbackClass={card.fallbackTileClass}
                            fallbackText={card.gameAbbr}
                            roundedClass="rounded-lg"
                            className="size-full"
                          />
                        ) : (
                          <CatalogImage
                            src={card.gameIconSrc}
                            alt={product.gameName}
                            fallbackClass={card.fallbackTileClass}
                            fallbackText={card.gameAbbr}
                            roundedClass="rounded-lg"
                            className="size-full"
                            fit="contain"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                          {product.title}
                        </p>
                        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                          {product.gameName} • {product.category}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-bold tabular-nums text-[#4f8cff]">
                        {formatProductPrice(product.price)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
