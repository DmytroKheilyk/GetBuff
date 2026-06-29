"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Offer } from "@/lib/offers";

type BuyOfferDialogProps = {
  offer: Offer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function BuyOfferDialog({
  offer,
  open,
  onOpenChange,
}: BuyOfferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-zinc-800/80 bg-zinc-950/95 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-white">
            Механика покупки{" "}
            <span className="text-neon-gradient">в разработке</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Скоро вы сможете безопасно оформить сделку прямо на GetBuff.store
          </DialogDescription>
        </DialogHeader>

        {offer && (
          <div className="space-y-3 rounded-lg border border-zinc-800/80 bg-black/40 p-4">
            <p className="text-sm leading-relaxed text-zinc-300">
              {offer.description}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">{offer.seller.nickname}</span>
              <span className="text-lg font-black text-green-400">
                {formatPrice(offer.price)}
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={() => onOpenChange(false)}
          className="neon-glow-hover w-full border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400"
        >
          Понятно
        </Button>
      </DialogContent>
    </Dialog>
  );
}
