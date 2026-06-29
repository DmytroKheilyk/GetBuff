"use client";

import { useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import { BuyOfferDialog } from "@/components/games/buy-offer-dialog";
import { SellerRatingDisplay } from "@/components/reviews/seller-rating-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import {
  getCategoryDisplayLabel,
  type Offer,
} from "@/lib/offers";

type OffersTableProps = {
  offers: Offer[];
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function OffersTable({ offers }: OffersTableProps) {
  const [buyOffer, setBuyOffer] = useState<Offer | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  async function handleBuy(offer: Offer) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setAuthOpen(true);
      return;
    }

    setBuyOffer(offer);
    setBuyOpen(true);
  }

  return (
    <>
      <div className="glass-panel overflow-hidden rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800/80 bg-black/50 hover:bg-black/50">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-green-400/80">
                Описание
              </TableHead>
              <TableHead className="w-[160px] text-xs font-bold uppercase tracking-wider text-green-400/80">
                Продавец
              </TableHead>
              <TableHead className="w-[130px] text-xs font-bold uppercase tracking-wider text-green-400/80">
                Категория
              </TableHead>
              <TableHead className="w-[120px] text-right text-xs font-bold uppercase tracking-wider text-green-400/80">
                Цена
              </TableHead>
              <TableHead className="w-[110px] text-right text-xs font-bold uppercase tracking-wider text-green-400/80">
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
                <TableCell className="max-w-md whitespace-normal">
                  <p className="text-sm leading-relaxed text-zinc-200">
                    {offer.description}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="truncate font-semibold text-white">
                      {offer.seller.nickname}
                    </p>
                    <SellerRatingDisplay
                      reviewAverage={offer.seller.reviewAverage}
                      reviewCount={offer.seller.reviewCount}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="border-green-500/20 bg-green-500/10 text-xs font-medium text-green-400 hover:bg-green-500/10">
                    {getCategoryDisplayLabel(offer.categoryRaw)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-lg font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.35)]">
                    {formatPrice(offer.price)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    className="neon-glow-hover border border-green-500/30 bg-green-500 font-bold text-black transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
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

      <BuyOfferDialog
        offer={buyOffer}
        open={buyOpen}
        onOpenChange={setBuyOpen}
      />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
