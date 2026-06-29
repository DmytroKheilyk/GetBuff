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
  "h-8 border-zinc-800/80 bg-black/40 focus-visible:border-green-500/40 focus-visible:ring-green-500/20";

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
      <section className="glass-panel rounded-2xl p-8 text-center">
        <p className="text-lg font-bold text-white">У вас пока нет лотов</p>
        <p className="mt-2 text-sm text-zinc-500">
          Выставите первый товар — он сразу появится в каталоге игры
        </p>
        <Button
          asChild
          className="neon-glow-hover mt-6 border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
        >
          <Link href="/offers/create">
            <Plus className="size-4" />
            Выставить первый товар
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="border-b border-zinc-800/80 px-6 py-5">
        <h2 className="text-lg font-black text-white">
          Мои лоты{" "}
          <span className="text-neon-gradient">({offers.length})</span>
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Управляйте ценами и удаляйте неактуальные предложения
        </p>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="divide-y divide-zinc-800/60">
        {offers.map((offer) => {
          const isDeleting = deletingId === offer.id;
          const isEditing = editingId === offer.id;
          const isSaving = savingId === offer.id;
          const isBusy = isDeleting || isSaving;

          return (
            <div
              key={offer.id}
              className={cn(
                "px-6 py-5 transition-colors",
                isBusy && "opacity-60"
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {offer.gameSlug ? (
                      <Link
                        href={`/games/${offer.gameSlug}`}
                        className="text-sm font-bold text-green-400 hover:text-green-300"
                      >
                        {offer.gameTitle}
                      </Link>
                    ) : (
                      <span className="text-sm font-bold text-zinc-400">
                        {offer.gameTitle}
                      </span>
                    )}
                    <span className="rounded-full border border-zinc-800 bg-black/40 px-2 py-0.5 text-xs text-zinc-500">
                      {getCategoryDisplayLabel(offer.categoryRaw)}
                    </span>
                    <span className="text-xs text-zinc-600">
                      {formatDate(offer.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                    {offer.description}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className={`w-28 ${fieldClassName}`}
                        disabled={isSaving}
                      />
                      <span className="text-sm text-zinc-500">₽</span>
                      <Button
                        size="sm"
                        disabled={isSaving}
                        onClick={() => handleSavePrice(offer.id)}
                        className="border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      >
                        {isSaving ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          "Сохранить"
                        )}
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={isSaving}
                        onClick={cancelEdit}
                        className="text-zinc-500 hover:text-white"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.25)]">
                        {formatPrice(offer.price)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy || editingId !== null}
                          onClick={() => startEdit(offer)}
                          className="border-zinc-700 bg-transparent text-zinc-400 hover:border-green-500/30 hover:text-green-400"
                        >
                          {isSaving ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <>
                              <Pencil className="size-3.5" />
                              Изменить цену
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy || editingId !== null}
                          onClick={() => handleDelete(offer.id)}
                          className="border-zinc-700 bg-transparent text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                        >
                          {isDeleting ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="size-3.5" />
                              Удалить
                            </>
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

      <div className="border-t border-zinc-800/80 px-6 py-4">
        <Button
          asChild
          variant="outline"
          className="neon-glow-hover border-green-500/30 text-green-400 hover:bg-green-500/10"
        >
          <Link href="/offers/create">
            <Plus className="size-4" />
            Добавить лот
          </Link>
        </Button>
      </div>
    </section>
  );
}
