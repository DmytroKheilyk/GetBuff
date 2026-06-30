"use client";

import Link from "next/link";
import { Loader2, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder } from "@/lib/actions/create-order";
import { USE_MOCK_DATA } from "@/lib/mock-data";
import type { ProductOffer } from "@/lib/types/product-offer";
import { notifyWalletChanged } from "@/lib/types/wallet";
import { cn } from "@/lib/utils";

type ProductPurchaseCardProps = {
  offer: ProductOffer;
  existingOrderId: string | null;
  className?: string;
  variant?: "sidebar" | "mobile-sheet";
};

function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function ProductPurchaseCard({
  offer,
  existingOrderId,
  className,
  variant = "sidebar",
}: ProductPurchaseCardProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [expanded, setExpanded] = useState(variant === "sidebar");

  useEffect(() => {
    if (variant === "mobile-sheet") {
      setExpanded(false);
    }
  }, [variant]);

  async function ensureAuth(): Promise<boolean> {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setAuthOpen(true);
      return false;
    }

    return true;
  }

  async function handleBuy() {
    if (!nickname.trim()) {
      setError("Укажите игровой никнейм или логин");
      if (variant === "mobile-sheet") setExpanded(true);
      return;
    }

    const authed = await ensureAuth();
    if (!authed) return;

    setError(null);
    setLoading(true);

    const result = await createOrder(offer.id);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    notifyWalletChanged();
    router.push("/profile");
    router.refresh();
  }

  async function handleContactSeller() {
    const authed = await ensureAuth();
    if (!authed) return;

    if (USE_MOCK_DATA) {
      router.push(`/chats?product=${offer.id}`);
      return;
    }

    if (existingOrderId) {
      router.push(`/chats?order=${existingOrderId}`);
      return;
    }

    setContactLoading(true);
    setError(null);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setContactLoading(false);
      setAuthOpen(true);
      return;
    }

    const { getSellerName } = await import("@/lib/user");
    const buyerName = getSellerName(user);

    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("offer_id", offer.id)
      .eq("buyer_name", buyerName)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setContactLoading(false);

    if (data?.id) {
      router.push(`/chats?order=${data.id}`);
      return;
    }

    setError("Сначала оформите покупку — после этого откроется чат с продавцом");
    if (variant === "mobile-sheet") setExpanded(true);
  }

  if (variant === "mobile-sheet") {
    return (
      <>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur-lg dark:border-neutral-800 dark:bg-[#12131a]/95">
          {!expanded ? (
            <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Цена</p>
                <p className="text-xl font-black tabular-nums text-neutral-900 dark:text-white">
                  {formatPrice(offer.price)}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setExpanded(true)}
                className="h-11 shrink-0 rounded-xl bg-linear-to-r from-[#4f8cff] to-[#6ba1ff] px-6 font-bold text-white"
              >
                Купить
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 rounded-xl border-neutral-200 dark:border-neutral-800"
                onClick={() => void handleContactSeller()}
                aria-label="Написать продавцу"
              >
                {contactLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <MessageCircle className="size-4" />
                )}
              </Button>
            </div>
          ) : (
            <div className="max-h-[85dvh] overflow-y-auto px-4 py-4">
              <PurchaseCardBody
                offer={offer}
                nickname={nickname}
                onNicknameChange={setNickname}
                error={error}
                loading={loading}
                contactLoading={contactLoading}
                onBuy={() => void handleBuy()}
                onContact={() => void handleContactSeller()}
                onCollapse={() => setExpanded(false)}
                showCollapse
              />
            </div>
          )}
        </div>
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </>
    );
  }

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm dark:border-neutral-800 dark:bg-[#1c1e27] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
          className
        )}
      >
        <CardContent className="p-0">
          <PurchaseCardBody
            offer={offer}
            nickname={nickname}
            onNicknameChange={setNickname}
            error={error}
            loading={loading}
            contactLoading={contactLoading}
            onBuy={() => void handleBuy()}
            onContact={() => void handleContactSeller()}
          />
        </CardContent>
      </Card>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}

type PurchaseCardBodyProps = {
  offer: ProductOffer;
  nickname: string;
  onNicknameChange: (value: string) => void;
  error: string | null;
  loading: boolean;
  contactLoading: boolean;
  onBuy: () => void;
  onContact: () => void;
  onCollapse?: () => void;
  showCollapse?: boolean;
};

function PurchaseCardBody({
  offer,
  nickname,
  onNicknameChange,
  error,
  loading,
  contactLoading,
  onBuy,
  onContact,
  onCollapse,
  showCollapse,
}: PurchaseCardBodyProps) {
  return (
    <div className="space-y-5 p-5 sm:p-6">
      {showCollapse && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-neutral-900 dark:text-white">
            Оформление покупки
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className="text-muted-foreground"
          >
            Свернуть
          </Button>
        </div>
      )}

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Цена
        </p>
        <p className="mt-1 text-4xl font-black tabular-nums text-neutral-900 dark:text-white">
          {formatPrice(offer.price)}
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="game-nickname"
          className="text-sm text-neutral-900 dark:text-white"
        >
          Игровой никнейм / логин
        </Label>
        <Input
          id="game-nickname"
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          placeholder="Например, Player123"
          className="h-11 rounded-xl border-neutral-200 bg-white text-neutral-900 placeholder:text-muted-foreground focus-visible:ring-primary/30 dark:border-neutral-800 dark:bg-[#12131a] dark:text-white"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          disabled={loading}
          onClick={onBuy}
          className="h-12 w-full rounded-xl bg-linear-to-r from-[#4f8cff] to-[#6ba1ff] text-base font-bold text-white shadow-[0_0_24px_rgba(79,140,255,0.35)] hover:from-[#6ba1ff] hover:to-[#8bb5ff]"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Оформление...
            </>
          ) : (
            "Купить"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={contactLoading}
          onClick={onContact}
          className="h-11 w-full rounded-xl border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-transparent dark:text-neutral-100 dark:hover:bg-[#12131a]"
        >
          {contactLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <MessageCircle className="size-4" />
              Написать продавцу
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
        Оплата с баланса GetBuff. Средства замораживаются до подтверждения
        получения.
      </p>
    </div>
  );
}

export function ProductPurchaseBar(props: ProductPurchaseCardProps) {
  return <ProductPurchaseCard {...props} variant="mobile-sheet" />;
}
