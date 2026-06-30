"use client";

import Link from "next/link";
import {
  Check,
  ChevronRight,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { CatalogImage } from "@/components/home/catalog-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createOffer,
  type CreateOfferState,
} from "@/lib/actions/create-offer";
import type { Game } from "@/lib/games";
import {
  calculateSellerIncome,
  formatRubles,
  PLATFORM_COMMISSION_RATE,
  resolveGameIdBySlug,
  SELL_CATEGORY_OPTIONS,
  SELL_GAME_OPTIONS,
} from "@/lib/sell-catalog";
import { cn } from "@/lib/utils";

type SellOfferFormProps = {
  games: Game[];
};

const initialState: CreateOfferState = {};

const fieldClassName =
  "rounded-xl border border-gray-200 bg-gray-50 text-neutral-900 placeholder:text-muted-foreground focus-visible:ring-primary/30 dark:border-border dark:bg-[#1c1e27] dark:text-neutral-100";

const cardClassName =
  "rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-border dark:bg-[#1c1e27] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]";

const sectionTitleClassName = "text-base font-bold text-foreground";

const labelClassName = "text-sm text-foreground";

export function SellOfferForm({ games }: SellOfferFormProps) {
  const [state, formAction, pending] = useActionState(
    createOffer,
    initialState
  );

  const [selectedGameSlug, setSelectedGameSlug] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [instantDelivery, setInstantDelivery] = useState(true);
  const [price, setPrice] = useState("");

  const gameId = useMemo(
    () => resolveGameIdBySlug(selectedGameSlug, games),
    [selectedGameSlug, games]
  );

  const selectedCategoryOption = SELL_CATEGORY_OPTIONS.find(
    (item) => item.id === selectedCategory
  );

  const sellerIncome = useMemo(() => {
    const numericPrice = Number(price);
    return calculateSellerIncome(numericPrice);
  }, [price]);

  const canSubmit =
    Boolean(gameId) &&
    selectedCategory.length > 0 &&
    selectedGameSlug.length > 0;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pb-16 sm:py-10">
      <nav
        aria-label="Хлебные крошки"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="size-3.5 opacity-50" />
        <Link href="/profile" className="transition-colors hover:text-foreground">
          Панель продавца
        </Link>
        <ChevronRight className="size-3.5 opacity-50" />
        <span className="font-medium text-foreground">Создать лот</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          Выставить товар на продажу
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Заполните карточку лота — он появится в каталоге GetBuff и станет
          доступен покупателям с безопасной сделкой через баланс площадки.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="game_id" value={gameId ?? ""} />
        <input
          type="hidden"
          name="category"
          value={selectedCategoryOption?.dbCategory ?? ""}
        />
        <input
          type="hidden"
          name="instant_delivery"
          value={instantDelivery ? "true" : "false"}
        />
        <input type="hidden" name="redirect_to" value="product" />

        {state.error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {state.error}
          </p>
        )}

        <Card className={cardClassName}>
          <CardHeader className="pb-3">
            <CardTitle className={sectionTitleClassName}>
              1. Игра или сервис
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {SELL_GAME_OPTIONS.map((game) => {
                const isSelected = selectedGameSlug === game.slug;
                const isAvailable = Boolean(
                  resolveGameIdBySlug(game.slug, games)
                );

                return (
                  <button
                    key={game.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSelectedGameSlug(game.slug)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all",
                      isSelected
                        ? "border-[#4f8cff] bg-[#4f8cff]/10 shadow-[0_0_20px_rgba(79,140,255,0.18)]"
                        : "border-gray-200 bg-white hover:border-[#4f8cff]/40 dark:border-border dark:bg-[#12131a] dark:hover:border-[#4f8cff]/40",
                      !isAvailable && "cursor-not-allowed opacity-45"
                    )}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-[#4f8cff] text-white">
                        <Check className="size-3" />
                      </span>
                    )}
                    <div className="size-14 overflow-hidden rounded-xl border border-border">
                      <CatalogImage
                        src={game.imageSrc}
                        alt={game.title}
                        fallbackClass={game.fallbackClass}
                        fallbackText={game.title.slice(0, 2).toUpperCase()}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                        {game.title}
                      </p>
                      {game.subtitle && (
                        <p className="truncate text-[10px] text-muted-foreground">
                          {game.subtitle}
                        </p>
                      )}
                      {!isAvailable && (
                        <p className="mt-1 text-[10px] font-medium text-amber-400">
                          Скоро
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader className="pb-3">
            <CardTitle className={sectionTitleClassName}>
              2. Категория товара
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {SELL_CATEGORY_OPTIONS.map((category) => {
                const isSelected = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-[#4f8cff] bg-[#4f8cff]/10 shadow-[0_0_18px_rgba(79,140,255,0.15)]"
                        : "border-gray-200 bg-white hover:border-[#4f8cff]/35 dark:border-border dark:bg-[#12131a] dark:hover:border-[#4f8cff]/35"
                    )}
                  >
                    <p className="text-sm font-bold text-foreground">
                      {category.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {category.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader className="pb-3">
            <CardTitle className={sectionTitleClassName}>
              3. Описание и детали лота
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className={labelClassName}>
                Название объявления
              </Label>
              <Input
                id="title"
                name="title"
                required
                minLength={5}
                placeholder="1000 Робуксов | Моментальный трансфер"
                className={cn("h-11", fieldClassName)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className={labelClassName}>
                Описание товара
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                minLength={10}
                rows={6}
                placeholder="Подробно опишите состав лота, способ передачи, гарантии и сроки..."
                className={cn("min-h-36 resize-y", fieldClassName)}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-border dark:bg-[#12131a]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-[#22c55e]" />
                  <p className="text-sm font-semibold text-foreground">
                    Моментальная выдача
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Добавит зелёную плашку автоматической передачи после оплаты
                </p>
              </div>
              <Switch
                checked={instantDelivery}
                onCheckedChange={setInstantDelivery}
                aria-label="Моментальная выдача"
              />
            </div>

            {instantDelivery && (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1.5 text-xs font-semibold text-[#22c55e]">
                <Sparkles className="size-3.5" />
                Моментально
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader className="pb-3">
            <CardTitle className={sectionTitleClassName}>
              4. Стоимость и расчёт дохода
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price" className={labelClassName}>
                Цена для покупателя (в ₽)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                required
                min={1}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="850"
                className={cn("h-11", fieldClassName)}
              />
            </div>

            <div className="rounded-2xl border border-[#4f8cff]/20 bg-[#4f8cff]/5 p-4">
              <p className="text-sm text-muted-foreground">
                Комиссия площадки:{" "}
                <span className="font-semibold text-foreground">
                  {Math.round(PLATFORM_COMMISSION_RATE * 100)}%
                </span>
              </p>
              <p className="mt-2 text-base font-bold text-neutral-900 dark:text-neutral-100">
                Вы получите на баланс:{" "}
                <span className="text-[#2563eb] dark:text-primary">
                  {formatRubles(sellerIncome)}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={pending || !canSubmit}
          className="h-12 w-full rounded-2xl bg-linear-to-r from-[#4f8cff] to-[#6ba1ff] text-base font-bold text-white shadow-[0_0_28px_rgba(79,140,255,0.35)] hover:from-[#6ba1ff] hover:to-[#8bb5ff] disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Публикация...
            </>
          ) : (
            "Опубликовать лот"
          )}
        </Button>
      </form>
    </div>
  );
}
