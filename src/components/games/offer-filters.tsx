"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/lib/mock-offers";

type OfferFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
};

const fieldInputClassName =
  "border-zinc-800/80 bg-black/40 focus-visible:border-green-500/40 focus-visible:ring-green-500/20";

export function OfferFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: OfferFiltersProps) {
  return (
    <div className="glass-panel flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-[200px] flex-1">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-green-500/70">
          Поиск по описанию
        </label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-green-500/50" />
          <Input
            type="search"
            placeholder="Описание или продавец..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`pl-9 ${fieldInputClassName}`}
          />
        </div>
      </div>

      <div className="w-full sm:w-auto">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-green-500/70">
          Сортировка
        </label>
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as SortOption)}
        >
          <SelectTrigger
            className={`w-full min-w-[180px] sm:w-[200px] ${fieldInputClassName}`}
          >
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent className="border-zinc-800/80 bg-zinc-900/95 backdrop-blur-md">
            <SelectItem value="default">По умолчанию</SelectItem>
            <SelectItem value="price-asc">Сначала дешевле</SelectItem>
            <SelectItem value="price-desc">Сначала дороже</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <div className="w-full sm:w-28">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-green-500/70">
            Цена от, ₽
          </label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className={fieldInputClassName}
          />
        </div>
        <div className="w-full sm:w-28">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-green-500/70">
            Цена до, ₽
          </label>
          <Input
            type="number"
            min={0}
            placeholder="∞"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className={fieldInputClassName}
          />
        </div>
      </div>
    </div>
  );
}
