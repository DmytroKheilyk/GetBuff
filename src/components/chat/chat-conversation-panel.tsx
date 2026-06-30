"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, ImageIcon, Loader2, Send } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { CatalogImage } from "@/components/home/catalog-image";
import { ChatMessageBubble } from "@/components/chat/chat-message-bubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  formatPrice,
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
import { getHomeCategoryBySlug } from "@/lib/home-catalog";
import { getMockProductById } from "@/lib/mock-data";

const messageInputClassName =
  "flex-1 rounded-xl border-neutral-200 bg-white text-neutral-900 placeholder:text-muted-foreground focus-visible:ring-primary/30 dark:border-border dark:bg-[#1c1e27] dark:text-white";

type ChatConversationPanelProps = {
  thread: ChatThread | null;
  initialMessages: ChatMessage[];
  loading?: boolean;
  showBackButton: boolean;
  onBack: () => void;
  onMessageSent: (orderId: string, content: string, createdAt: string) => void;
  useMockChat?: boolean;
  onMockMessageSent?: (orderId: string, message: ChatMessage) => void;
};

function ProductContextBar({ context }: { context: ChatContext }) {
  const product = context.productId
    ? getMockProductById(context.productId)
    : null;
  const category = product
    ? getHomeCategoryBySlug(product.gameSlug)
    : context.gameSlug
      ? getHomeCategoryBySlug(context.gameSlug)
      : undefined;

  const productHref = context.productId
    ? `/products/${context.productId}`
    : null;

  const title = product?.title ?? context.offerDescription;
  const price = product?.price ?? context.offerPrice;

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-[#14161d]">
      <div className="size-10 shrink-0 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700">
        {product?.image ? (
          <CatalogImage
            src={product.image}
            alt={title}
            fallbackClass={
              category?.fallbackTileClass ??
              "bg-neutral-200 dark:bg-[#2a2d38]"
            }
            fallbackText={category?.abbr ?? product.gameName.slice(0, 2)}
            fit="cover"
            roundedClass="rounded-full"
            className="size-full"
          />
        ) : (
          <CatalogImage
            src={category?.imageSrc ?? ""}
            alt={product?.gameName ?? context.gameTitle}
            fallbackClass={
              category?.fallbackTileClass ??
              "bg-neutral-200 dark:bg-[#2a2d38]"
            }
            fallbackText={
              category?.abbr ??
              (product?.gameName ?? context.gameTitle).slice(0, 2)
            }
            fit="cover"
            roundedClass="rounded-full"
            className="size-full"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title}
        </p>
        <p className="text-sm font-semibold tabular-nums text-blue-500 dark:text-blue-400">
          {formatPrice(price)}
        </p>
      </div>

      {productHref && !context.isArchived ? (
        <Link
          href={productHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-400/10"
        >
          Открыть лот
          <ExternalLink className="size-3.5" />
        </Link>
      ) : (
        <Badge variant="outline" className="shrink-0 text-muted-foreground">
          {context.isArchived ? "Архив" : "Недоступен"}
        </Badge>
      )}
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
  useMockChat = false,
  onMockMessageSent,
}: ChatConversationPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!thread || useMockChat) return;

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
  }, [thread, useMockChat]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!context || !thread) return;

    const text = draft.trim();
    if (!text || sending) return;

    setError(null);
    setSending(true);

    if (useMockChat) {
      const createdAt = new Date().toISOString();
      const message: ChatMessage = {
        id: `mock-msg-${Date.now()}`,
        orderId: thread.orderId,
        senderName: context.currentUserName,
        content: text,
        createdAt,
        isRead: true,
        type: "text",
      };

      setMessages((prev) => [...prev, message]);
      setDraft("");
      setSending(false);
      onMockMessageSent?.(thread.orderId, message);
      onMessageSent(thread.orderId, text, createdAt);
      return;
    }

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

  function sendMockMessage(message: ChatMessage) {
    if (!thread) return;

    setMessages((prev) => [...prev, message]);
    onMockMessageSent?.(thread.orderId, message);
    onMessageSent(
      thread.orderId,
      message.content.trim() || "📷 Изображение",
      message.createdAt
    );
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !context || !thread || !useMockChat) return;

    if (!file.type.startsWith("image/")) {
      setError("Можно прикрепить только изображение");
      e.target.value = "";
      return;
    }

    setError(null);
    setSending(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== "string") {
        setError("Не удалось загрузить изображение");
        setSending(false);
        e.target.value = "";
        return;
      }

      const createdAt = new Date().toISOString();
      const message: ChatMessage = {
        id: `mock-msg-${Date.now()}`,
        orderId: thread.orderId,
        senderName: context.currentUserName,
        content: draft.trim(),
        createdAt,
        isRead: true,
        type: "text",
        image: dataUrl,
      };

      sendMockMessage(message);
      setDraft("");
      setSending(false);
      e.target.value = "";
    };
    reader.onerror = () => {
      setError("Не удалось загрузить изображение");
      setSending(false);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  }

  if (!thread || !context) {
    return (
      <div className="hidden h-full flex-col items-center justify-center bg-white px-6 text-center dark:bg-[#111319] md:flex">
        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Выберите диалог слева
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Здесь откроется переписка по заказу с превью товара и историей сообщений
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white dark:bg-[#111319]">
      <div className="flex shrink-0 items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
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
            <p className="truncate text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {thread.counterpartName}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              {thread.isOnline && (
                <span className="text-[11px] text-[#22c55e]">В сети</span>
              )}
              <Badge
                variant="outline"
                className="h-5 border-neutral-200 px-1.5 py-0 text-[10px] text-muted-foreground dark:border-border"
              >
                {CHAT_ORDER_STATUS_LABELS[thread.status]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <ProductContextBar context={context} />

      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4 pb-6">
          {loading ? (
            <div className="flex w-full justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="w-full py-16 text-center">
              <p className="text-sm font-semibold text-muted-foreground">
                Чат пуст — напишите первое сообщение
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderName === context.currentUserName}
              />
            ))
          )}
          <div ref={bottomRef} className="h-px w-full shrink-0" />
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t border-neutral-200 bg-neutral-50/95 px-4 py-3 backdrop-blur-md dark:border-neutral-800 dark:bg-[#12131a]/95">
        <form onSubmit={handleSend} className="mx-auto flex max-w-3xl items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={!useMockChat || sending}
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 text-muted-foreground hover:text-neutral-900 dark:hover:text-neutral-100"
            aria-label="Прикрепить изображение"
          >
            <ImageIcon className="size-5" />
          </Button>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            disabled={sending}
            className={messageInputClassName}
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
