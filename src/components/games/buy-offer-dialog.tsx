"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { createOrder } from "@/lib/actions/create-order";
import { notifyWalletChanged } from "@/lib/types/wallet";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [chargedAmount, setChargedAmount] = useState<number | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setError(null);
      setSuccess(false);
      setChargedAmount(null);
      setLoading(false);
    }
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    if (!offer) return;
    setError(null);
    setLoading(true);

    const result = await createOrder(offer.id);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setChargedAmount(result.chargedAmount ?? offer.price);
    setSuccess(true);
    notifyWalletChanged();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-panel border-zinc-800/80 bg-zinc-950/95 sm:max-w-md">
        {success ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-white">
                Оплата{" "}
                <span className="text-neon-gradient">прошла успешно!</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                {chargedAmount !== null && (
                  <>
                    С вашего счета списано{" "}
                    <span className="font-bold text-green-400">
                      {formatPrice(chargedAmount)}
                    </span>
                    . Деньги заморожены до выполнения заказа.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            {offer && (
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <p className="text-sm text-zinc-300">{offer.description}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  Отслеживайте статус в личном кабинете → «Мои покупки»
                </p>
              </div>
            )}
            <Button
              onClick={() => handleOpenChange(false)}
              className="neon-glow-hover w-full border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400"
            >
              Отлично
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-white">
                Подтверждение{" "}
                <span className="text-neon-gradient">покупки</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-500">
                Оплата спишется с вашего виртуального баланса GetBuff
              </DialogDescription>
            </DialogHeader>

            {offer && (
              <div className="space-y-4 rounded-lg border border-zinc-800/80 bg-black/40 p-4">
                <p className="text-sm leading-relaxed text-zinc-300">
                  {offer.description}
                </p>
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                  <span className="text-sm text-zinc-500">
                    {offer.seller.nickname}
                  </span>
                  <span className="text-xl font-black text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.3)]">
                    {formatPrice(offer.price)}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => handleOpenChange(false)}
                className="flex-1 border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800/50"
              >
                Отмена
              </Button>
              <Button
                disabled={loading || !offer}
                onClick={handleConfirm}
                className="neon-glow-hover flex-1 border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Проведение платежа...
                  </>
                ) : (
                  "Оплатить и купить"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
