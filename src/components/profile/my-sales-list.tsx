"use client";

import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

import { OpenChatButton } from "@/components/chat/open-chat-button";
import { completeOrder } from "@/lib/actions/complete-order";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/lib/types/order";
import { cn } from "@/lib/utils";

type MySalesListProps = {
  initialOrders: Order[];
};

const primaryButtonClassName =
  "rounded-2xl bg-linear-to-r from-[#4f8cff] to-[#6ba1ff] font-bold text-white shadow-[0_0_28px_rgba(79,140,255,0.35)] hover:from-[#6ba1ff] hover:to-[#8bb5ff]";

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
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center dark:border-neutral-800 dark:bg-[#14161d]">
        <p className="text-lg font-bold text-neutral-900 dark:text-white">
          Продаж пока нет
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Когда покупатели оформят заказы на ваши лоты, они появятся здесь
        </p>
        <Button asChild className={cn("mt-6 h-11", primaryButtonClassName)}>
          <Link href="/sell">Выставить лот</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#14161d]">
      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500 dark:text-red-400 sm:mx-6">
          {error}
        </div>
      )}

      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {orders.map((order) => {
          const isCompleting = completingId === order.id;

          return (
            <div
              key={order.id}
              className="px-4 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/40 sm:px-6 sm:py-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {order.gameSlug ? (
                      <Link
                        href={`/games/${order.gameSlug}`}
                        className="inline-flex rounded-full bg-[#4f8cff]/10 px-2.5 py-0.5 text-xs font-bold text-[#2563eb] transition-colors hover:bg-[#4f8cff]/15 dark:text-[#4f8cff]"
                      >
                        {order.gameTitle}
                      </Link>
                    ) : (
                      <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                        {order.gameTitle}
                      </span>
                    )}
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {order.offerDescription}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Покупатель: {order.buyerName} ·{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                  <p className="text-lg font-bold tabular-nums text-neutral-900 dark:text-white">
                    {formatPrice(order.offerPrice)}
                  </p>
                  <OpenChatButton orderId={order.id} />
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      disabled={isCompleting}
                      onClick={() => handleComplete(order.id)}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400"
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
