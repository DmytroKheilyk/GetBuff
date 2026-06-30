import type { ChatThread } from "@/lib/types/chat";
import type { ChatMessage } from "@/lib/types/message";
import {
  getMockProductById,
  getMockUserById,
  mockChats,
  type MockChat,
  type MockChatMessage,
} from "@/lib/mock-data";

export const MOCK_CHAT_READ_EVENT = "getbuff:mock-chat-read";

const READ_MESSAGES_STORAGE_KEY = "getbuff-read-message-ids";

function truncateLabel(value: string, max = 28): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
}

export function getReadMessageIds(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = sessionStorage.getItem(READ_MESSAGES_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function markMockChatAsRead(chat: MockChat | undefined) {
  if (!chat) return;

  const readIds = getReadMessageIds();
  chat.messages.forEach((message) => readIds.add(message.id));
  sessionStorage.setItem(
    READ_MESSAGES_STORAGE_KEY,
    JSON.stringify(Array.from(readIds))
  );
  window.dispatchEvent(new Event(MOCK_CHAT_READ_EVENT));
}

export function isMockMessageUnread(
  message: MockChatMessage,
  currentUserName: string,
  readIds: Set<string>
): boolean {
  if (message.type === "system") return false;
  if (message.senderName === currentUserName) return false;
  if (readIds.has(message.id)) return false;
  return !message.isRead;
}

export function countMockUnreadMessages(
  chats: MockChat[],
  currentUserName: string
): number {
  const readIds = getReadMessageIds();

  return chats.reduce((total, chat) => {
    if (chat.isHidden) return total;

    return (
      total +
      chat.messages.filter((message) =>
        isMockMessageUnread(message, currentUserName, readIds)
      ).length
    );
  }, 0);
}

export function getVisibleMockChats(chats: MockChat[] = mockChats): MockChat[] {
  return chats.filter((chat) => {
    if (chat.isHidden) return false;

    const product = getMockProductById(chat.productId);
    if (!product && !chat.isArchived) return false;

    return true;
  });
}

export function getMockChatById(
  chatId: string,
  chats: MockChat[] = mockChats
): MockChat | undefined {
  return chats.find((chat) => chat.id === chatId);
}

export function getMockChatByProductId(
  productId: string,
  chats: MockChat[] = mockChats
): MockChat | undefined {
  return chats.find((chat) => chat.productId === productId && !chat.isHidden);
}

export function createDraftMockChat(
  productId: string,
  buyerName: string
): MockChat | null {
  const product = getMockProductById(productId);
  if (!product) return null;

  const seller = getMockUserById(product.sellerId);
  if (!seller) return null;

  return {
    id: `chat-draft-${productId}`,
    productId,
    buyerName,
    sellerName: seller.name,
    sellerId: seller.id,
    isArchived: false,
    isHidden: false,
    createdAt: new Date().toISOString(),
    messages: [],
  };
}

export function mockChatToThread(
  chat: MockChat,
  currentUserName: string
): ChatThread | null {
  const product = getMockProductById(chat.productId);
  const isArchived = chat.isArchived || !product;
  const seller = product
    ? getMockUserById(product.sellerId)
    : getMockUserById(chat.sellerId);

  const isBuyer = currentUserName === chat.buyerName;
  const counterpartName = isBuyer
    ? (seller?.name ?? chat.sellerName)
    : chat.buyerName;

  const lastMessage = chat.messages.at(-1);
  const readIds = getReadMessageIds();
  const unreadCount = chat.messages.filter((message) =>
    isMockMessageUnread(message, currentUserName, readIds)
  ).length;

  const offerDescription = product?.title ?? chat.fallbackProductTitle ?? "Товар недоступен";
  const productShortLabel = product
    ? `${truncateLabel(product.title)} | ${product.gameName}`
    : `${truncateLabel(chat.fallbackProductTitle ?? "Архив")} | —`;

  return {
    orderId: chat.id,
    productId: chat.productId,
    status: isArchived ? "cancelled" : "pending",
    counterpartName,
    currentUserName,
    isBuyer,
    offerDescription,
    offerPrice: product?.price ?? 0,
    gameTitle: product?.gameName ?? "",
    gameSlug: product?.gameSlug ?? "",
    lastMessagePreview:
      lastMessage?.content.trim() ||
      (lastMessage?.image ? "📷 Изображение" : "Начните переписку по товару"),
    lastMessageAt: lastMessage?.createdAt ?? chat.createdAt,
    isOnline: seller?.status === "online",
    unreadCount,
    productShortLabel,
    isArchived,
  };
}

export function mockChatToMessages(chat: MockChat): ChatMessage[] {
  return chat.messages.map((message) => ({
    id: message.id,
    orderId: chat.id,
    senderName: message.senderName,
    content: message.content,
    createdAt: message.createdAt,
    isRead: message.isRead,
    type: message.type ?? "text",
    image: message.image,
  }));
}

export function buildMockThreads(
  currentUserName: string,
  chats: MockChat[] = mockChats
): ChatThread[] {
  return getVisibleMockChats(chats)
    .map((chat) => mockChatToThread(chat, currentUserName))
    .filter((thread): thread is ChatThread => thread !== null);
}

export function buildInitialMockMessagesMap(
  chatIds: string[],
  chats: MockChat[] = mockChats
): Record<string, ChatMessage[]> {
  const map: Record<string, ChatMessage[]> = {};

  for (const chatId of chatIds) {
    const chat = getMockChatById(chatId, chats);
    if (chat) {
      map[chatId] = mockChatToMessages(chat);
    }
  }

  return map;
}

export function buildMockMessagesMap(
  chats: MockChat[]
): Record<string, ChatMessage[]> {
  return Object.fromEntries(
    chats.map((chat) => [chat.id, mockChatToMessages(chat)])
  );
}
