"use client";

import { Loader2, Plus, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { fetchWalletBalance, topUpWallet } from "@/lib/actions/wallet";
import {
  formatWalletBalance,
  WALLET_CHANGED_EVENT,
} from "@/lib/types/wallet";
import { cn } from "@/lib/utils";

type HeaderWalletProps = {
  user: User;
};

export function HeaderWallet({ user }: HeaderWalletProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalance = useCallback(async () => {
    setError(null);
    const result = await fetchWalletBalance();
    if (result.error) {
      console.error("[wallet:HeaderWallet] fetchWalletBalance failed", result.error);
      setError(result.error);
      setBalance(null);
    } else if (result.balance !== undefined) {
      setBalance(result.balance);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    void loadBalance();
  }, [loadBalance, user.id]);

  useEffect(() => {
    function handleWalletChanged() {
      void loadBalance();
    }

    window.addEventListener(WALLET_CHANGED_EVENT, handleWalletChanged);
    return () =>
      window.removeEventListener(WALLET_CHANGED_EVENT, handleWalletChanged);
  }, [loadBalance]);

  async function handleTopUp() {
    setTopUpLoading(true);
    setError(null);

    const result = await topUpWallet();

    setTopUpLoading(false);

    if (result.error) {
      setError(result.error);
      console.error("[wallet:HeaderWallet] topUpWallet failed", result.error);
      return;
    }

    if (result.balance !== undefined) {
      setBalance(result.balance);
    }
  }

  if (loading) {
    return (
      <div className="h-9 w-28 animate-pulse rounded-xl bg-zinc-800/80" />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-green-500/25 bg-green-500/5 px-3 py-1.5",
          "shadow-[0_0_16px_rgba(34,197,94,0.12)]"
        )}
        title={error ?? undefined}
      >
        <Wallet className="size-4 shrink-0 text-green-400/80" />
        <span className="hidden text-xs font-semibold text-zinc-500 sm:inline">
          Баланс:
        </span>
        <span className="text-xs font-black tabular-nums text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.35)] sm:text-sm">
          {balance !== null ? formatWalletBalance(balance) : "—"}
        </span>
        <button
          type="button"
          onClick={handleTopUp}
          disabled={topUpLoading}
          aria-label="Пополнить баланс на 1000 рублей"
          className={cn(
            "flex size-6 items-center justify-center rounded-md border border-green-500/40 bg-green-500/20 text-green-400",
            "transition-all duration-200 hover:bg-green-500/35 hover:shadow-[0_0_12px_rgba(34,197,94,0.35)]",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {topUpLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
