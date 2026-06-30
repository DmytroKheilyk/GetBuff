"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ChatsPageContent } from "@/components/chat/chats-page-content";
import {
  buildMockMessagesMap,
  buildMockThreads,
  createDraftMockChat,
  getMockChatByProductId,
} from "@/lib/mock-chat";
import {
  chatMessageToMockMessage,
  getSeedChats,
  loadStoredChats,
  saveStoredChats,
} from "@/lib/chat-storage";
import type { Chat } from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/types/message";

type MockChatsPageClientProps = {
  currentUserName: string;
  initialOrderId?: string | null;
  initialProductId?: string | null;
};

export function MockChatsPageClient({
  currentUserName,
  initialOrderId = null,
  initialProductId = null,
}: MockChatsPageClientProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [initialChatId, setInitialChatId] = useState<string | null>(
    initialOrderId
  );

  useEffect(() => {
    const savedChats = loadStoredChats();
    let nextChats = savedChats ?? getSeedChats();

    if (!savedChats) {
      saveStoredChats(nextChats);
    }

    if (initialProductId) {
      const existingChat = getMockChatByProductId(initialProductId, nextChats);

      if (existingChat) {
        setInitialChatId(existingChat.id);
      } else {
        const draftChat = createDraftMockChat(
          initialProductId,
          currentUserName
        );

        if (draftChat) {
          nextChats = [
            draftChat,
            ...nextChats.filter((chat) => chat.id !== draftChat.id),
          ];
          saveStoredChats(nextChats);
          setInitialChatId(draftChat.id);
        }
      }
    } else if (
      initialOrderId &&
      nextChats.some((chat) => chat.id === initialOrderId)
    ) {
      setInitialChatId(initialOrderId);
    }

    setChats(nextChats);
    setHydrated(true);
  }, [currentUserName, initialOrderId, initialProductId]);

  const handleMockMessageSent = useCallback(
    (orderId: string, message: ChatMessage) => {
      const mockMessage = chatMessageToMockMessage(message);

      setChats((prev) => {
        const updatedChats = prev.map((chat) =>
          chat.id === orderId
            ? { ...chat, messages: [...chat.messages, mockMessage] }
            : chat
        );
        saveStoredChats(updatedChats);
        return updatedChats;
      });
    },
    []
  );

  if (!hydrated) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center border-t border-neutral-200 dark:border-neutral-800">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const threads = buildMockThreads(currentUserName, chats);
  const mockMessagesByOrder = buildMockMessagesMap(chats);

  return (
    <ChatsPageContent
      useMockChat
      currentUserName={currentUserName}
      threads={threads}
      initialMessagesByOrder={mockMessagesByOrder}
      mockMessagesByOrder={mockMessagesByOrder}
      mockChats={chats}
      initialOrderId={initialChatId}
      onMockMessageSent={handleMockMessageSent}
    />
  );
}
