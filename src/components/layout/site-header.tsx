"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useCallback, useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";

import { AuthModal } from "@/components/auth/auth-modal";
import { HeaderSearch } from "@/components/layout/header-search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchWalletBalance } from "@/lib/actions/wallet";
import { createClient } from "@/lib/supabase/client";
import {
  formatWalletBalance,
  WALLET_CHANGED_EVENT,
} from "@/lib/types/wallet";
import { getUserInitial } from "@/lib/user";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-3 md:gap-4">
          {/* Левая часть: лого + переключатель темы */}
          <div className="flex shrink-0 items-center gap-4 md:gap-6">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter text-primary transition-opacity hover:opacity-90"
              aria-label="GetBuff — на главную"
            >
              GetBuff
            </Link>
            <ThemeToggle />
          </div>

          {/* Центр: поиск */}
          <HeaderSearch className="hidden max-w-xl flex-1 md:block" />

          {/* Правая часть */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() =>
                requireAuth(() => router.push("/sell"))
              }
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Продать</span>
            </button>

            <button
              type="button"
              onClick={() => requireAuth(() => router.push("/chats"))}
              className="relative transition-colors hover:text-primary"
              aria-label="Чаты"
            >
              <MessageCircle className="size-6" />
              {user && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  2
                </span>
              )}
            </button>

            {loading ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-muted/50" />
            ) : user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-full border border-border bg-muted/50 p-1 pr-3 transition-colors hover:bg-muted/70 sm:pr-4"
              >
                <Avatar className="size-8 border-2 border-primary">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {getUserInitial(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col sm:flex">
                  <span className="text-[10px] leading-none text-muted-foreground">
                    Профиль
                  </span>
                  <span className="text-sm leading-tight font-bold tabular-nums">
                    {walletLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : balance !== null ? (
                      formatWalletBalance(balance)
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className={cn(
                  "rounded-full border border-border bg-muted/50 px-4 py-2",
                  "text-sm font-medium transition-colors hover:bg-muted/70 hover:text-primary"
                )}
              >
                Войти
              </button>
            )}
          </div>
        </div>

        {/* Поиск на мобильных */}
        <div className="border-t border-border/40 px-4 py-2 md:hidden">
          <HeaderSearch />
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
