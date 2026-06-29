"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getUserInitial } from "@/lib/user";
import { cn } from "@/lib/utils";

export function HeaderAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

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

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
  }

  if (loading) {
    return (
      <div className="ml-auto size-8 animate-pulse rounded-full bg-zinc-800" />
    );
  }

  if (user) {
    return (
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link
          href="/profile"
          className={cn(
            "flex size-9 items-center justify-center rounded-full transition-opacity hover:opacity-80",
            "border border-green-500/30 bg-green-500/10 text-sm font-bold text-green-400",
            "shadow-[0_0_12px_rgba(34,197,94,0.2)]"
          )}
          title={user.email ?? "Личный кабинет"}
        >
          {getUserInitial(user)}
        </Link>
        <Button
          variant="outline"
          size="sm"
          disabled={signingOut}
          onClick={handleSignOut}
          className="neon-glow-hover border-zinc-700 bg-transparent text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
        >
          {signingOut ? "..." : "Выйти"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setAuthOpen(true)}
        className="neon-glow-hover ml-auto border-green-500/30 bg-green-500/10 font-semibold text-green-400 hover:border-green-400/50 hover:bg-green-500/20 hover:text-green-300"
      >
        Войти
      </Button>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
