import { mockChats, type Chat, type MockChatMessage } from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/types/message";

export const CHATS_STORAGE_KEY = "getbuff_chats";

export function loadStoredChats(): Chat[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Chat[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStoredChats(chats: Chat[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
}

export function getSeedChats(): Chat[] {
  return mockChats;
}

export function chatMessageToMockMessage(message: ChatMessage): MockChatMessage {
  return {
    id: message.id,
    senderName: message.senderName,
    content: message.content,
    createdAt: message.createdAt,
    isRead: message.isRead ?? true,
    type: message.type ?? "text",
    image: message.image,
  };
}
