"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MessageCircle,
  Moon,
  Plus,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { AuthModal } from "@/components/auth/auth-modal";
import { fetchWalletBalance, topUpWallet } from "@/lib/actions/wallet";
import { createClient } from "@/lib/supabase/client";
import {
  formatWalletBalance,
  WALLET_CHANGED_EVENT,
} from "@/lib/types/wallet";
import { getUserInitial } from "@/lib/user";
import { cn } from "@/lib/utils";

const actionBtnClass =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#b4b9c9] transition-all duration-200 hover:bg-white/[0.06] hover:text-white";

export function HeaderUserActions() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);

  const loadBalance = useCallback(async () => {
    if (!user) return;
    setWalletLoading(true);
    const result = await fetchWalletBalance();
    if (result.balance !== undefined) {
      setBalance(result.balance);
    }
    setWalletLoading(false);
  }, [user]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      void loadBalance();
    } else {
      setBalance(null);
    }
  }, [user, loadBalance]);

  useEffect(() => {
    function handleWalletChanged() {
      void loadBalance();
    }
    window.addEventListener(WALLET_CHANGED_EVENT, handleWalletChanged);
    return () =>
      window.removeEventListener(WALLET_CHANGED_EVENT, handleWalletChanged);
  }, [loadBalance]);

  function requireAuth(action: () => void) {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    action();
  }

  async function handleTopUp(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setTopUpLoading(true);
    const result = await topUpWallet();
    setTopUpLoading(false);
    if (result.balance !== undefined) {
      setBalance(result.balance);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 animate-pulse rounded-xl bg-[#23262f]" />
        <div className="h-9 w-16 animate-pulse rounded-xl bg-[#23262f]" />
        <div className="h-10 w-28 animate-pulse rounded-2xl bg-[#23262f]" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={() =>
            requireAuth(() => router.push("/offers/create"))
          }
          className={cn(
            actionBtnClass,
            "hidden font-semibold text-[#4f8cff] hover:bg-[#4f8cff]/10 hover:text-[#6ba1ff] sm:flex"
          )}
        >
          <span className="flex size-6 items-center justify-center rounded-lg bg-[#4f8cff]/15">
            <Plus className="size-4" />
          </span>
          Продать
        </button>

        <button
          type="button"
          onClick={() => requireAuth(() => router.push("/profile"))}
          className={cn(actionBtnClass, "relative hidden sm:flex")}
        >
          <MessageCircle className="size-[18px]" />
          Чаты
          {user && (
            <span className="absolute top-1.5 right-2 size-2 rounded-full bg-[#4f8cff] ring-2 ring-[#181a21]" />
          )}
        </button>

        {user ? (
          <div
            className={cn(
              "flex items-center gap-1 rounded-2xl border border-[#2a2d38] bg-[#23262f]/80 p-1",
              "transition-all duration-200 hover:border-[#353945] hover:bg-[#282b36]"
            )}
          >
            <Link
              href="/profile"
              className="flex items-center gap-2.5 rounded-xl py-0.5 pl-0.5 pr-2 transition-opacity hover:opacity-90"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  "bg-linear-to-br from-[#4f8cff]/25 to-[#6366f1]/20 text-sm font-bold text-[#93b4ff]"
                )}
              >
                {getUserInitial(user)}
              </span>
              <span className="hidden min-w-0 flex-col sm:flex">
                <span className="text-xs font-medium text-[#8b919e]">Профиль</span>
                <span className="text-sm font-bold tabular-nums text-[#e8eaef]">
                  {walletLoading ? (
                    <Loader2 className="size-3.5 animate-spin text-[#6b7289]" />
                  ) : balance !== null ? (
                    formatWalletBalance(balance)
                  ) : (
                    "—"
                  )}
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={handleTopUp}
              disabled={topUpLoading}
              aria-label="Пополнить баланс"
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-lg",
                "bg-[#4f8cff]/15 text-[#6ba1ff] transition-all duration-200",
                "hover:bg-[#4f8cff]/25 disabled:opacity-50"
              )}
            >
              {topUpLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className={cn(
              "flex items-center gap-2 rounded-2xl border border-[#2a2d38] bg-[#23262f]/80 px-3 py-2",
              "text-sm font-semibold text-[#e8eaef] transition-all duration-200",
              "hover:border-[#353945] hover:bg-[#282b36]"
            )}
          >
            <UserRound className="size-[18px] text-[#8b919e]" />
            <span className="hidden sm:inline">Войти</span>
          </button>
        )}

        <Link
          href="/offers/create"
          className={cn(
            "flex size-9 items-center justify-center rounded-xl sm:hidden",
            "bg-[#4f8cff]/15 text-[#6ba1ff] transition-all hover:bg-[#4f8cff]/25"
          )}
          aria-label="Продать"
        >
          <Plus className="size-5" />
        </Link>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
