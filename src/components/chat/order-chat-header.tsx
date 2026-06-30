"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ChatContext } from "@/lib/types/chat";
import { CHAT_ORDER_STATUS_LABELS } from "@/lib/types/order";
import { cn } from "@/lib/utils";

type OrderChatHeaderProps = {
  context: ChatContext;
};

export function OrderChatHeader({ context }: OrderChatHeaderProps) {
  return (
    <div className="glass-panel border-b border-zinc-800/80 px-4 py-4 sm:px-6">
      <div className="container mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-3 -ml-2 text-zinc-500 hover:text-green-400"
          >
            <Link href="/profile">
              <ArrowLeft className="size-4" />
              Назад в профиль
            </Link>
          </Button>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 shadow-[0_0_16px_rgba(34,197,94,0.15)]">
              <MessageCircle className="size-5 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {context.offerDescription}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "font-semibold",
                    context.status === "pending" &&
                      "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10",
                    context.status === "completed" &&
                      "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/10",
                    context.status === "cancelled" &&
                      "border-zinc-600 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800/50"
                  )}
                >
                  {CHAT_ORDER_STATUS_LABELS[context.status]}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-green-400/80">
                Собеседник:{" "}
                <span className="font-semibold text-green-400">
                  {context.counterpartName}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
