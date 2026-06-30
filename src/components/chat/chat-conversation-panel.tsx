"use client";

import { ArrowLeft, Loader2, Paperclip, Send } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { CatalogImage } from "@/components/home/catalog-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  formatMessageTime,
  formatPrice,
  getGamePosterSrc,
  getInitial,
} from "@/lib/chat-ui";
import {
  threadToChatContext,
  type ChatContext,
  type ChatThread,
} from "@/lib/types/chat";
import { createClient } from "@/lib/supabase/client";
import { CHAT_ORDER_STATUS_LABELS } from "@/lib/types/order";
import {
  mapDbMessage,
  type ChatMessage,
  type DbMessageRow,
} from "@/lib/types/message";
import { cn } from "@/lib/utils";

type ChatConversationPanelProps = {
  thread: ChatThread | null;
  initialMessages: ChatMessage[];
  loading?: boolean;
  showBackButton: boolean;
  onBack: () => void;
  onMessageSent: (orderId: string, content: string, createdAt: string) => void;
};

function OfferMiniCard({ context }: { context: ChatContext }) {
  const posterSrc = getGamePosterSrc(context.gameSlug);

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-[#1c1e27] px-2.5 py-2">
      <div className="size-9 shrink-0 overflow-hidden rounded-lg border border-border">
        {posterSrc ? (
          <CatalogImage
            src={posterSrc}
            alt={context.gameTitle}
            fallbackClass="bg-[#2a2d38]"
            fallbackText={context.gameTitle.slice(0, 2).toUpperCase()}
            fit="cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-[#2a2d38] text-[10px] font-bold text-[#e8eaef]">
            {context.gameTitle.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-[#e8eaef]">
          {context.offerDescription}
        </p>
        <p className="text-[11px] font-bold text-[#4f8cff]">
          {formatPrice(context.offerPrice)}
        </p>
      </div>
    </div>
  );
}

export function ChatConversationPanel({
  thread,
  initialMessages,
  loading = false,
  showBackButton,
  onBack,
  onMessageSent,
}: ChatConversationPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const context = thread ? threadToChatContext(thread) : null;

  useEffect(() => {
    setMessages(initialMessages);
    setDraft("");
    setError(null);
  }, [thread?.orderId, initialMessages]);

  const scrollToBottom = useCallback((smooth: boolean) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [thread?.orderId, scrollToBottom]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!thread) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`chats-page-${thread.orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `order_id=eq.${thread.orderId}`,
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
  }, [thread]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!context || !thread) return;

    const text = draft.trim();
    if (!text || sending) return;

    setError(null);
    setSending(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("messages")
      .insert({
        order_id: context.orderId,
        sender_name: context.currentUserName,
        content: text,
      })
      .select("*")
      .single();

    setSending(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    const createdAt =
      (data as DbMessageRow | null)?.created_at ?? new Date().toISOString();
    setDraft("");
    onMessageSent(thread.orderId, text, createdAt);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  if (!thread || !context) {
    return (
      <div className="hidden h-full flex-col items-center justify-center bg-[#0f1016] px-6 text-center md:flex">
        <p className="text-base font-semibold text-[#e8eaef]">
          Выберите диалог слева
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Здесь откроется переписка по заказу с превью товара и историей сообщений
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0f1016]">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        {showBackButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 md:hidden"
            aria-label="Назад к списку чатов"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
            {getInitial(thread.counterpartName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#e8eaef]">
              {thread.counterpartName}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              {thread.isOnline && (
                <span className="text-[11px] text-[#22c55e]">В сети</span>
              )}
              <Badge
                variant="outline"
                className="h-5 border-border px-1.5 py-0 text-[10px] text-muted-foreground"
              >
                {CHAT_ORDER_STATUS_LABELS[thread.status]}
              </Badge>
            </div>
          </div>
        </div>

        <div className="hidden max-w-[220px] sm:block">
          <OfferMiniCard context={context} />
        </div>
      </div>

      <div className="border-b border-border px-4 py-2 sm:hidden">
        <OfferMiniCard context={context} />
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold text-muted-foreground">
                Чат пуст — напишите первое сообщение
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
                    "flex",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-md sm:max-w-[70%]",
                      isOwn
                        ? "rounded-br-md bg-[#4f8cff] text-white"
                        : "rounded-bl-md bg-[#1c1e27] text-[#e8eaef]"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={cn(
                        "mt-1.5 text-[10px] tabular-nums",
                        isOwn ? "text-white/70" : "text-muted-foreground"
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
      </ScrollArea>

      <div className="border-t border-border bg-[#12131a]/95 px-4 py-3 backdrop-blur-md">
        <form onSubmit={handleSend} className="mx-auto flex max-w-3xl gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            className="shrink-0 text-muted-foreground"
            aria-label="Прикрепить скриншот"
          >
            <Paperclip className="size-5" />
          </Button>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            disabled={sending}
            className="flex-1 rounded-xl border-border bg-[#1c1e27] focus-visible:ring-primary/30"
          />
          <Button
            type="submit"
            disabled={sending || !draft.trim()}
            className="shrink-0 rounded-xl bg-[#4f8cff] px-4 font-semibold text-white hover:bg-[#6ba1ff]"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Send className="size-4 sm:hidden" />
                <span className="hidden sm:inline">Отправить</span>
              </>
            )}
          </Button>
        </form>
        {error && (
          <p className="mx-auto mt-2 max-w-3xl text-xs text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
