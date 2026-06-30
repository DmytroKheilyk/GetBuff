"use client";

import type { User } from "@supabase/supabase-js";
import { Calendar, Loader2, Mail, Wallet } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { topUpWallet } from "@/lib/actions/wallet";
import { formatWalletBalance, notifyWalletChanged } from "@/lib/types/wallet";
import { formatUserRegisteredAt, getUserInitial } from "@/lib/user";

type UserInfoCardProps = {
  user: User;
  balance: number;
};

export function UserInfoCard({ user, balance: initialBalance }: UserInfoCardProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const registeredAt = formatUserRegisteredAt(user);

  async function handleTopUp() {
    setTopUpLoading(true);
    const result = await topUpWallet();
    setTopUpLoading(false);

    if (result.balance !== undefined) {
      setBalance(result.balance);
      notifyWalletChanged();
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#1c1e27] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#4f8cff]/15 text-xl font-bold text-[#2563eb] dark:bg-primary/20 dark:text-primary sm:size-20 sm:text-2xl">
            {getUserInitial(user)}
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Личный кабинет
            </h1>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm sm:justify-start">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-muted-foreground">{user.email}</span>
              </div>

              {registeredAt && (
                <div className="flex items-center justify-center gap-2 text-sm sm:justify-start">
                  <Calendar className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Регистрация: {registeredAt}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-[#14161d] sm:min-w-[220px] sm:items-end">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Wallet className="size-4" />
            Баланс кошелька
          </div>
          <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatWalletBalance(balance)}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={topUpLoading}
            onClick={handleTopUp}
            className="rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {topUpLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Пополнить"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
