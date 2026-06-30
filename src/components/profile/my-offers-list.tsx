"use client";

import Link from "next/link";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteOffer,
  updateOfferPrice,
} from "@/lib/actions/manage-offer";
import { getCategoryDisplayLabel } from "@/lib/offers";
import type { ProfileOffer } from "@/lib/queries/profile-offers";
import { cn } from "@/lib/utils";

type MyOffersListProps = {
  initialOffers: ProfileOffer[];
};

const fieldClassName =
  "h-9 w-28 rounded-xl border border-neutral-200 bg-gray-50 text-neutral-900 focus-visible:ring-primary/30 dark:border-border dark:bg-[#1c1e27] dark:text-neutral-100";

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
  });
}

export function MyOffersList({ initialOffers }: MyOffersListProps) {
  const [offers, setOffers] = useState(initialOffers);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(offerId: string) {
    setError(null);
    setDeletingId(offerId);

    const result = await deleteOffer(offerId);

    setDeletingId(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  }

  function startEdit(offer: ProfileOffer) {
    setError(null);
    setEditingId(offer.id);
    setEditPrice(String(offer.price));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditPrice("");
  }

  async function handleSavePrice(offerId: string) {
    setError(null);
    const price = Number(editPrice);

    if (Number.isNaN(price) || price <= 0) {
      setError("Укажите корректную цену");
      return;
    }

    setSavingId(offerId);

    const result = await updateOfferPrice(offerId, price);

    setSavingId(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, price } : o))
    );
    setEditingId(null);
    setEditPrice("");
  }

  if (offers.length === 0) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-[#14161d]">
        <p className="text-lg font-bold text-neutral-900 dark:text-white">
          У вас пока нет лотов
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Выставите первый товар — он сразу появится в каталоге игры
        </p>
        <Button asChild className={cn("mt-6 h-11", primaryButtonClassName)}>
          <Link href="/sell">
            <Plus className="size-4" />
            Выставить первый товар
          </Link>
        </Button>
      </section>
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
        {offers.map((offer) => {
          const isDeleting = deletingId === offer.id;
          const isEditing = editingId === offer.id;
          const isSaving = savingId === offer.id;
          const isBusy = isDeleting || isSaving;

          return (
            <div
              key={offer.id}
              className={cn(
                "px-4 py-4 transition-colors sm:px-6 sm:py-5",
                isBusy && "opacity-60"
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {offer.gameSlug ? (
                      <Link
                        href={`/games/${offer.gameSlug}`}
                        className="inline-flex rounded-full bg-[#4f8cff]/10 px-2.5 py-0.5 text-xs font-bold text-[#2563eb] transition-colors hover:bg-[#4f8cff]/15 dark:text-[#4f8cff]"
                      >
                        {offer.gameTitle}
                      </Link>
                    ) : (
                      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        {offer.gameTitle}
                      </span>
                    )}
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-muted-foreground dark:border-neutral-700 dark:bg-neutral-900">
                      {getCategoryDisplayLabel(offer.categoryRaw)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(offer.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {offer.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {isEditing ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className={fieldClassName}
                        disabled={isSaving}
                      />
                      <span className="text-sm text-muted-foreground">₽</span>
                      <Button
                        size="sm"
                        disabled={isSaving}
                        onClick={() => handleSavePrice(offer.id)}
                        className="rounded-xl"
                      >
                        {isSaving ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          "Сохранить"
                        )}
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        disabled={isSaving}
                        onClick={cancelEdit}
                        className="rounded-xl border-neutral-200 dark:border-neutral-700"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-lg font-bold tabular-nums text-neutral-900 dark:text-white sm:text-xl">
                        {formatPrice(offer.price)}
                      </span>
                      <div className="flex gap-1.5">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          disabled={isBusy || editingId !== null}
                          onClick={() => startEdit(offer)}
                          aria-label="Изменить цену"
                          className="rounded-xl border-neutral-200 text-neutral-600 hover:text-[#2563eb] dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-[#4f8cff]"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          disabled={isBusy || editingId !== null}
                          onClick={() => handleDelete(offer.id)}
                          aria-label="Удалить лот"
                          className="rounded-xl border-neutral-200 text-neutral-600 hover:border-red-300 hover:text-red-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-red-500/40 dark:hover:text-red-400"
                        >
                          {isDeleting ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800 sm:px-6">
        <Button asChild className={cn("h-11", primaryButtonClassName)}>
          <Link href="/sell">
            <Plus className="size-4" />
            Добавить лот
          </Link>
        </Button>
      </div>
    </section>
  );
}
