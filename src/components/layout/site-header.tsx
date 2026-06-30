"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useCallback, useEffect, useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import { HeaderSearch } from "@/components/layout/header-search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/user-context";
import { fetchWalletBalance } from "@/lib/actions/wallet";
import {
  MOCK_CHAT_BUYER_NAME,
  mockChats,
  USE_MOCK_DATA,
} from "@/lib/mock-data";
import { getReadMessageIds, MOCK_CHAT_READ_EVENT } from "@/lib/mock-chat";
import {
  formatWalletBalance,
  WALLET_CHANGED_EVENT,
} from "@/lib/types/wallet";
import { getUserInitial } from "@/lib/user";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const router = useRouter();
  const { authUser: user, profile, loading } = useUser();
  const [authOpen, setAuthOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

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

  useEffect(() => {
    if (!USE_MOCK_DATA || !user) {
      setUnreadChatCount(0);
      return;
    }

    const updateUnreadCount = () => {
      const userName = user.email ?? MOCK_CHAT_BUYER_NAME;
      const readIds = getReadMessageIds();

      const count = mockChats.reduce((total, chat) => {
        if (chat.isHidden) return total;

        return (
          total +
          chat.messages.filter(
            (message) =>
              message.type !== "system" &&
              !message.isRead &&
              message.senderName !== userName &&
              !readIds.has(message.id)
          ).length
        );
      }, 0);

      setUnreadChatCount(count);
    };

    updateUnreadCount();
    window.addEventListener(MOCK_CHAT_READ_EVENT, updateUnreadCount);
    return () =>
      window.removeEventListener(MOCK_CHAT_READ_EVENT, updateUnreadCount);
  }, [user]);

  function requireAuth(action: () => void) {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    action();
  }

  const avatarInitial = profile?.nickname
    ? profile.nickname.charAt(0).toUpperCase()
    : user
      ? getUserInitial(user)
      : "?";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-3 md:gap-4">
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

          <HeaderSearch className="hidden max-w-xl flex-1 md:block" />

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => requireAuth(() => router.push("/sell"))}
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
                <span
                  className={cn(
                    "absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground",
                    unreadChatCount === 0 && "hidden"
                  )}
                >
                  {unreadChatCount > 9 ? "9+" : unreadChatCount}
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
                  {profile?.avatarBase64 ? (
                    <AvatarImage
                      src={profile.avatarBase64}
                      alt={profile.nickname}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {avatarInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col sm:flex">
                  <span className="max-w-[120px] truncate text-[10px] leading-none text-muted-foreground">
                    {profile?.nickname ?? "Профиль"}
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

        <div className="border-t border-border/40 px-4 py-2 md:hidden">
          <HeaderSearch />
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
