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
import type { Offer } from "@/lib/mock-offers";
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
      <div className="rounded-xl border border-border/60 bg-card/50 px-6 py-16 text-center">
        <p className="text-lg font-medium">Лоты не найдены</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Попробуйте изменить фильтры или выберите другую категорию
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="w-[220px]">Продавец</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead className="w-[140px] text-right">Цена</TableHead>
            <TableHead className="w-[120px] text-right">Действие</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow
              key={offer.id}
              className="border-border/40 hover:bg-muted/30"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      offer.seller.avatarColor
                    )}
                  >
                    {getInitials(offer.seller.nickname)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {offer.seller.nickname}
                    </p>
                    <SellerRating rating={offer.seller.rating} />
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          offer.seller.online
                            ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                            : "bg-muted-foreground/40"
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {offer.seller.online ? "В сети" : "Не в сети"}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-md whitespace-normal">
                <p className="text-sm leading-relaxed">{offer.description}</p>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-lg font-bold text-emerald-400">
                  {formatPrice(offer.price)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
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
