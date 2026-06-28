"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SellerRating } from "@/components/games/seller-rating";
import type { Offer } from "@/lib/offers";
import { cn } from "@/lib/utils";

type OffersTableProps = {
  offers: Offer[];
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

function getInitials(nickname: string): string {
  return nickname.slice(0, 2).toUpperCase();
}

function handleBuy(offer: Offer) {
  alert(
    `Покупка лота «${offer.description.slice(0, 50)}...» за ${formatPrice(offer.price)} — скоро будет доступна!`
  );
}

export function OffersTable({ offers }: OffersTableProps) {
  if (offers.length === 0) {
    return (
      <div className="glass-panel rounded-xl px-6 py-16 text-center">
        <p className="text-lg font-bold text-white">Лот пока не создан</p>
        <p className="mt-2 text-sm text-zinc-500">
          В этой категории ещё нет предложений — загляните позже
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800/80 bg-black/50 hover:bg-black/50">
            <TableHead className="h-12 w-[220px] text-xs font-bold uppercase tracking-wider text-green-400/80">
              Продавец
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-green-400/80">
              Описание
            </TableHead>
            <TableHead className="w-[140px] text-right text-xs font-bold uppercase tracking-wider text-green-400/80">
              Цена
            </TableHead>
            <TableHead className="w-[120px] text-right text-xs font-bold uppercase tracking-wider text-green-400/80">
              Действие
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow
              key={offer.id}
              className="border-zinc-800/50 transition-colors duration-200 hover:bg-green-500/5"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-green-500/20 text-xs font-bold",
                      offer.seller.avatarColor
                    )}
                  >
                    {getInitials(offer.seller.nickname)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {offer.seller.nickname}
                    </p>
                    <SellerRating rating={offer.seller.rating} />
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          offer.seller.online
                            ? "animate-pulse bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]"
                            : "bg-zinc-600"
                        )}
                      />
                      <span className="text-xs text-zinc-500">
                        {offer.seller.online ? "В сети" : "Не в сети"}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-md whitespace-normal">
                <p className="text-sm leading-relaxed text-zinc-300">
                  {offer.description}
                </p>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-lg font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                  {formatPrice(offer.price)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  className="neon-glow-hover border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
                  onClick={() => handleBuy(offer)}
                >
                  Купить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
