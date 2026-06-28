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
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-[200px] flex-1">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Поиск по описанию
        </label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Описание или продавец..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-border/60 bg-muted/40 pl-9 focus-visible:ring-emerald-500/30"
          />
        </div>
      </div>

      <div className="w-full sm:w-auto">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Сортировка
        </label>
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as SortOption)}
        >
          <SelectTrigger className="w-full min-w-[180px] border-border/60 bg-muted/40 sm:w-[200px]">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">По умолчанию</SelectItem>
            <SelectItem value="price-asc">Сначала дешевле</SelectItem>
            <SelectItem value="price-desc">Сначала дороже</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <div className="w-full sm:w-28">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Цена от, ₽
          </label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="border-border/60 bg-muted/40 focus-visible:ring-emerald-500/30"
          />
        </div>
        <div className="w-full sm:w-28">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Цена до, ₽
          </label>
          <Input
            type="number"
            min={0}
            placeholder="∞"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="border-border/60 bg-muted/40 focus-visible:ring-emerald-500/30"
          />
        </div>
      </div>
    </div>
  );
}
