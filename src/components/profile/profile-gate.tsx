"use client";

import { UserCircle } from "lucide-react";
import { useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";

export function ProfileGate() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-20">
      <div className="max-w-md rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-[#1c1e27]">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#4f8cff]/15">
          <UserCircle className="size-8 text-[#2563eb] dark:text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Личный кабинет
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Войдите в аккаунт, чтобы управлять своими лотами, менять цены и
          отслеживать продажи.
        </p>
        <Button
          onClick={() => setAuthOpen(true)}
          className="mt-8 h-11 w-full rounded-2xl bg-linear-to-r from-[#4f8cff] to-[#6ba1ff] font-bold text-white shadow-[0_0_28px_rgba(79,140,255,0.35)] hover:from-[#6ba1ff] hover:to-[#8bb5ff]"
        >
          Войти в аккаунт
        </Button>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
