import { Calendar, Package, Star } from "lucide-react";

import { PopularProductCard } from "@/components/home/popular-product-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitial } from "@/lib/chat-ui";
import type { MockProduct, MockUser } from "@/lib/mock-data";
import { toPopularProductCard } from "@/lib/mock-data";
import { formatDealsCount } from "@/lib/types/product-offer";
import { cn } from "@/lib/utils";

type PublicSellerProfileProps = {
  user: MockUser;
  products: MockProduct[];
};

function SellerStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index + 1 <= Math.floor(rounded);
        const half = !filled && index + 0.5 === rounded;

        return (
          <Star
            key={index}
            className={cn(
              "size-4",
              filled || half
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        );
      })}
    </div>
  );
}

export function PublicSellerProfile({ user, products }: PublicSellerProfileProps) {
  const cardProducts = products.map(toPopularProductCard);
  const isOnline = user.status === "online";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#1c1e27]">
          <div className="flex flex-col items-center text-center">
            <Avatar className="size-24 border-4 border-primary/20 sm:size-28">
              <AvatarFallback
                className={cn("text-2xl font-bold sm:text-3xl", user.avatar)}
              >
                {getInitial(user.name)}
              </AvatarFallback>
            </Avatar>

            <h1 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
              {user.name}
            </h1>

            <Badge
              className={cn(
                "mt-3 border-0 px-3 py-1 text-xs font-semibold",
                isOnline
                  ? "bg-[#22c55e]/15 text-[#22c55e] hover:bg-[#22c55e]/15"
                  : "bg-neutral-200 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
              )}
            >
              {isOnline ? (
                <>
                  <span className="mr-1.5 inline-block size-2 rounded-full bg-[#22c55e]" />
                  В сети
                </>
              ) : (
                "Не в сети"
              )}
            </Badge>

            <div className="mt-4 flex items-center gap-2">
              {user.totalSales > 0 ? (
                <>
                  <SellerStars rating={user.rating} />
                  <span className="text-sm font-semibold tabular-nums text-amber-500">
                    {user.rating.toFixed(1)}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Новый продавец</span>
              )}
            </div>

            <div className="mt-4 w-full space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Package className="size-4 shrink-0" />
                <span>{formatDealsCount(user.totalSales)}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4 shrink-0" />
                <span>Регистрация: {user.createdAt}</span>
              </div>
            </div>

            <div className="mt-5 w-full border-t border-neutral-200 pt-5 text-left dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                О себе
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {user.description}
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white sm:text-xl">
            Товары продавца ({cardProducts.length})
          </h2>

          {cardProducts.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-14 text-center dark:border-neutral-800 dark:bg-[#1c1e27]">
              <Package className="mx-auto size-9 text-muted-foreground" />
              <p className="mt-3 font-semibold text-neutral-900 dark:text-white">
                Нет активных товаров
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                У этого продавца пока нет опубликованных лотов
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3">
              {cardProducts.map((product) => (
                <PopularProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
