"use client";

import Link from "next/link";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import type { Order } from "@/lib/types/order";

type MyPurchasesListProps = {
  orders: Order[];
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MyPurchasesList({ orders }: MyPurchasesListProps) {
  if (orders.length === 0) {
    return (
      <div className="glass-panel rounded-2xl px-6 py-14 text-center">
        <p className="text-lg font-bold text-white">Покупок пока нет</p>
        <p className="mt-2 text-sm text-zinc-500">
          Выберите лот в каталоге игры и нажмите «Купить»
        </p>
      </div>
    );
  }

  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="border-b border-zinc-800/80 px-6 py-5">
        <h2 className="text-lg font-black text-white">
          Мои покупки{" "}
          <span className="text-neon-gradient">({orders.length})</span>
        </h2>
      </div>
      <div className="divide-y divide-zinc-800/60">
        {orders.map((order) => (
          <div
            key={order.id}
            className="px-6 py-5 transition-colors duration-200 hover:bg-green-500/[0.03]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {order.gameSlug ? (
                    <Link
                      href={`/games/${order.gameSlug}`}
                      className="text-sm font-bold text-green-400 hover:text-green-300"
                    >
                      {order.gameTitle}
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-zinc-400">
                      {order.gameTitle}
                    </span>
                  )}
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  {order.offerDescription}
                </p>
                <p className="mt-2 text-xs text-zinc-600">
                  Продавец: {order.sellerName} · {formatDate(order.createdAt)}
                </p>
              </div>
              <p className="shrink-0 text-xl font-black text-green-400">
                {formatPrice(order.offerPrice)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
