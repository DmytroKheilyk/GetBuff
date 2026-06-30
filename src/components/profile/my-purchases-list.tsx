"use client";

import Link from "next/link";
import { useState } from "react";

import { OpenChatButton } from "@/components/chat/open-chat-button";
import { LeaveReviewButton } from "@/components/reviews/leave-review-button";
import { LeaveReviewDialog } from "@/components/reviews/leave-review-dialog";
import { ReviewLeftBadge } from "@/components/reviews/review-left-badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import type { Order } from "@/lib/types/order";
import type { OrderReviewSummary } from "@/lib/types/review";

type MyPurchasesListProps = {
  orders: Order[];
  initialReviews: OrderReviewSummary[];
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

export function MyPurchasesList({
  orders,
  initialReviews,
}: MyPurchasesListProps) {
  const [reviewsByOrderId, setReviewsByOrderId] = useState(() => {
    const map = new Map<string, number>();
    for (const review of initialReviews) {
      map.set(review.orderId, review.rating);
    }
    return map;
  });

  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  function openReviewDialog(order: Order) {
    setReviewOrder(order);
    setReviewOpen(true);
  }

  function handleReviewSubmitted(orderId: string, rating: number) {
    setReviewsByOrderId((prev) => new Map(prev).set(orderId, rating));
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center dark:border-neutral-800 dark:bg-[#14161d]">
        <p className="text-lg font-bold text-neutral-900 dark:text-white">
          Покупок пока нет
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Выберите лот в каталоге игры и нажмите «Купить»
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#14161d]">
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {orders.map((order) => {
            const existingRating = reviewsByOrderId.get(order.id);

            return (
              <div
                key={order.id}
                className="px-4 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/40 sm:px-6 sm:py-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
                      Продавец: {order.sellerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <p className="text-lg font-bold tabular-nums text-neutral-900 dark:text-white">
                      {formatPrice(order.offerPrice)}
                    </p>
                    <OpenChatButton orderId={order.id} />
                    {order.status === "completed" &&
                      (existingRating !== undefined ? (
                        <ReviewLeftBadge rating={existingRating} />
                      ) : (
                        <LeaveReviewButton
                          onClick={() => openReviewDialog(order)}
                        />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <LeaveReviewDialog
        order={reviewOrder}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onSubmitted={handleReviewSubmitted}
      />
    </>
  );
}
