"use client";

import { PackageOpen } from "lucide-react";
import { useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";

export function CreateOfferGate() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-20">
      <div className="glass-panel max-w-md rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <PackageOpen className="size-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-black text-white">
          Продажа доступна{" "}
          <span className="text-neon-gradient">авторизованным</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Чтобы продать товар, необходимо войти в аккаунт. После входа вы
          сможете создавать лоты и управлять ими.
        </p>
        <Button
          onClick={() => setAuthOpen(true)}
          className="neon-glow-hover mt-8 w-full border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
        >
          Войти в аккаунт
        </Button>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
