"use client";

import { useEffect, useMemo, useState } from "react";

import { ChatConversationPanel } from "@/components/chat/chat-conversation-panel";
import { ChatThreadList } from "@/components/chat/chat-thread-list";
import type { ChatThread } from "@/lib/types/chat";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/types/message";
import { mapDbMessage, type DbMessageRow } from "@/lib/types/message";
import { cn } from "@/lib/utils";

type ChatsPageContentProps = {
  threads: ChatThread[];
  initialMessagesByOrder: Record<string, ChatMessage[]>;
  initialOrderId?: string | null;
};

export function ChatsPageContent({
  threads,
  initialMessagesByOrder,
  initialOrderId = null,
}: ChatsPageContentProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    initialOrderId
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messagesByOrder, setMessagesByOrder] = useState(
    initialMessagesByOrder
  );
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [threadPreviews, setThreadPreviews] = useState(() =>
    Object.fromEntries(
      threads.map((thread) => [
        thread.orderId,
        {
          preview: thread.lastMessagePreview,
          at: thread.lastMessageAt,
        },
      ])
    )
  );

  const sortedThreads = useMemo(() => {
    return [...threads].sort(
      (a, b) =>
        new Date(threadPreviews[b.orderId]?.at ?? b.lastMessageAt).getTime() -
        new Date(threadPreviews[a.orderId]?.at ?? a.lastMessageAt).getTime()
    );
  }, [threads, threadPreviews]);

  const filteredThreads = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return sortedThreads;

    return sortedThreads.filter(
      (thread) =>
        thread.counterpartName.toLowerCase().includes(normalized) ||
        thread.offerDescription.toLowerCase().includes(normalized) ||
        (threadPreviews[thread.orderId]?.preview ?? thread.lastMessagePreview)
          .toLowerCase()
          .includes(normalized)
    );
  }, [searchQuery, sortedThreads, threadPreviews]);

  const selectedThread =
    threads.find((thread) => thread.orderId === selectedOrderId) ?? null;

  const threadsWithPreview = sortedThreads.map((thread) => ({
    ...thread,
    lastMessagePreview:
      threadPreviews[thread.orderId]?.preview ?? thread.lastMessagePreview,
    lastMessageAt:
      threadPreviews[thread.orderId]?.at ?? thread.lastMessageAt,
  }));

  const filteredWithPreview = filteredThreads.map((thread) => ({
    ...thread,
    lastMessagePreview:
      threadPreviews[thread.orderId]?.preview ?? thread.lastMessagePreview,
    lastMessageAt:
      threadPreviews[thread.orderId]?.at ?? thread.lastMessageAt,
  }));

  const mobileConversationOpen = selectedOrderId !== null;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    function syncDesktopSelection() {
      if (!media.matches || threads.length === 0) return;
      setSelectedOrderId((current) => current ?? threads[0]?.orderId ?? null);
    }

    syncDesktopSelection();
    media.addEventListener("change", syncDesktopSelection);
    return () => media.removeEventListener("change", syncDesktopSelection);
  }, [threads]);

  useEffect(() => {
    if (!selectedOrderId || messagesByOrder[selectedOrderId]) return;

    let cancelled = false;
    setLoadingOrderId(selectedOrderId);

    async function loadMessages() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("order_id", selectedOrderId)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (!error && data) {
        setMessagesByOrder((prev) => ({
          ...prev,
          [selectedOrderId!]: (data as DbMessageRow[]).map(mapDbMessage),
        }));
      }

      setLoadingOrderId(null);
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedOrderId, messagesByOrder]);

  function handleSelect(orderId: string) {
    setSelectedOrderId(orderId);
  }

  function handleBack() {
    setSelectedOrderId(null);
  }

  function handleMessageSent(
    orderId: string,
    content: string,
    createdAt: string
  ) {
    setThreadPreviews((prev) => ({
      ...prev,
      [orderId]: { preview: content, at: createdAt },
    }));
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden border-t border-border">
      <aside
        className={cn(
          "h-full w-full shrink-0 border-r border-border md:w-1/3 md:max-w-sm lg:max-w-md",
          mobileConversationOpen ? "hidden md:block" : "block"
        )}
      >
        <ChatThreadList
          threads={threadsWithPreview}
          filteredThreads={filteredWithPreview}
          selectedOrderId={selectedOrderId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={handleSelect}
        />
      </aside>

      <main
        className={cn(
          "h-full min-w-0 flex-1",
          mobileConversationOpen ? "block" : "hidden md:block"
        )}
      >
        <ChatConversationPanel
          thread={selectedThread}
          initialMessages={
            selectedOrderId
              ? (messagesByOrder[selectedOrderId] ?? [])
              : []
          }
          loading={loadingOrderId === selectedOrderId}
          showBackButton={mobileConversationOpen}
          onBack={handleBack}
          onMessageSent={handleMessageSent}
        />
      </main>
    </div>
  );
}
