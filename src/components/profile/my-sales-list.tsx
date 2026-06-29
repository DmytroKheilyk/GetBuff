"use client";

import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

import { completeOrder } from "@/lib/actions/complete-order";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/lib/types/order";

type MySalesListProps = {
  initialOrders: Order[];
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

export function MySalesList({ initialOrders }: MySalesListProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete(orderId: string) {
    setError(null);
    setCompletingId(orderId);

    const result = await completeOrder(orderId);

    setCompletingId(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "completed" as OrderStatus } : o
      )
    );
  }

  if (orders.length === 0) {
    return (
      <div className="glass-panel rounded-2xl px-6 py-14 text-center">
        <p className="text-lg font-bold text-white">Продаж пока нет</p>
        <p className="mt-2 text-sm text-zinc-500">
          Когда покупатели оформят заказы на ваши лоты, они появятся здесь
        </p>
        <Button
          asChild
          className="neon-glow-hover mt-6 border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400"
        >
          <Link href="/offers/create">Выставить лот</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="border-b border-zinc-800/80 px-6 py-5">
        <h2 className="text-lg font-black text-white">
          Мои продажи{" "}
          <span className="text-neon-gradient">({orders.length})</span>
        </h2>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="divide-y divide-zinc-800/60">
        {orders.map((order) => {
          const isCompleting = completingId === order.id;

          return (
            <div
              key={order.id}
              className="px-6 py-5 transition-colors duration-200 hover:bg-green-500/[0.03]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                    Покупатель: {order.buyerName} ·{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3">
                  <p className="text-xl font-black text-green-400">
                    {formatPrice(order.offerPrice)}
                  </p>
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      disabled={isCompleting}
                      onClick={() => handleComplete(order.id)}
                      className="neon-glow-hover border border-green-500/30 bg-green-500/10 font-semibold text-green-400 transition-all duration-300 hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.25)]"
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="size-4" />
                          Подтвердить выполнение
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
