"use client";

import { Loader2, Send } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { OrderChatHeader } from "@/components/chat/order-chat-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatContext } from "@/lib/queries/chat";
import { createClient } from "@/lib/supabase/client";
import {
  mapDbMessage,
  type ChatMessage,
  type DbMessageRow,
} from "@/lib/types/message";
import { cn } from "@/lib/utils";

type OrderChatRoomProps = {
  context: ChatContext;
  initialMessages: ChatMessage[];
};

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderChatRoom({
  context,
  initialMessages,
}: OrderChatRoomProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((smooth: boolean) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`order-chat-${context.orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `order_id=eq.${context.orderId}`,
        },
        (payload) => {
          const incoming = mapDbMessage(payload.new as DbMessageRow);
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [context.orderId]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setError(null);
    setSending(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("messages").insert({
      order_id: context.orderId,
      sender_name: context.currentUserName,
      content: text,
    });

    setSending(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-black">
      <OrderChatHeader context={context} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.06),transparent_70%)]" />

        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        >
          <div className="container mx-auto max-w-3xl space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm font-semibold text-zinc-500">
                  Чат пуст — напишите первое сообщение
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Сообщения доставляются мгновенно через Realtime
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn =
                  message.senderName === context.currentUserName;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex animate-in fade-in slide-in-from-bottom-2 duration-300",
                      isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-lg sm:max-w-[70%]",
                        isOwn
                          ? "rounded-br-md border border-green-500/30 bg-green-500/20 text-green-50 shadow-[0_0_20px_rgba(34,197,94,0.12)]"
                          : "rounded-bl-md border border-zinc-800/80 bg-zinc-900/80 text-zinc-200"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p
                        className={cn(
                          "mt-1.5 text-[10px] tabular-nums",
                          isOwn ? "text-green-400/60" : "text-zinc-600"
                        )}
                      >
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="relative border-t border-zinc-800/80 bg-zinc-950/90 px-4 py-4 backdrop-blur-md sm:px-6">
          <form
            onSubmit={handleSend}
            className="container mx-auto flex max-w-3xl gap-2"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите сообщение..."
              disabled={sending}
              className="flex-1 border-zinc-800/80 bg-black/60 focus-visible:border-green-500/40 focus-visible:ring-green-500/20"
            />
            <Button
              type="submit"
              disabled={sending || !draft.trim()}
              className="neon-glow-hover shrink-0 border border-green-500/30 bg-green-500 px-4 font-bold text-black transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)] disabled:opacity-40"
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </form>
          {error && (
            <p className="container mx-auto mt-2 max-w-3xl text-xs text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
