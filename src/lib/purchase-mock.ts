import {
  getSeedChats,
  loadStoredChats,
  saveStoredChats,
} from "@/lib/chat-storage";
import { createDraftMockChat } from "@/lib/mock-chat";
import {
  getMockProductById,
  getMockUserById,
  type Chat,
  type MockChatMessage,
} from "@/lib/mock-data";

export function createPaymentSystemMessage(price: number): MockChatMessage {
  const formattedPrice = price.toLocaleString("ru-RU");

  return {
    id: `sys-${Date.now()}`,
    senderName: "GetBuff",
    content: `🛒 Покупатель оплатил заказ. ${formattedPrice} ₽ заморожены на балансе GetBuff. Продавец, передайте товар.`,
    createdAt: new Date().toISOString(),
    isRead: true,
    type: "system",
  };
}

export function appendPurchaseSystemMessageToChats(
  productId: string,
  buyerName: string,
  price: number
): { chats: Chat[]; chatId: string } | null {
  const product = getMockProductById(productId);
  if (!product) return null;

  const seller = getMockUserById(product.sellerId);
  if (seller?.name === buyerName || seller?.id === buyerName) {
    return null;
  }

  const systemMessage = createPaymentSystemMessage(price);
  const chats = loadStoredChats() ?? getSeedChats();
  const existingIndex = chats.findIndex(
    (chat) =>
      chat.productId === productId &&
      chat.buyerName === buyerName &&
      !chat.isHidden
  );

  if (existingIndex >= 0) {
    const existingChat = chats[existingIndex]!;
    const updatedChat: Chat = {
      ...existingChat,
      messages: [...existingChat.messages, systemMessage],
    };
    const updatedChats = chats.map((chat, index) =>
      index === existingIndex ? updatedChat : chat
    );

    saveStoredChats(updatedChats);
    return { chats: updatedChats, chatId: updatedChat.id };
  }

  const draftChat = createDraftMockChat(productId, buyerName);
  if (!draftChat) return null;

  const newChat: Chat = {
    ...draftChat,
    messages: [systemMessage],
  };
  const updatedChats = [
    newChat,
    ...chats.filter((chat) => chat.id !== newChat.id),
  ];

  saveStoredChats(updatedChats);
  return { chats: updatedChats, chatId: newChat.id };
}

export type MockPurchaseResult =
  | { success: true; newBalance: number; chatId: string }
  | { success: false; error: string };

export function executeMockPurchase(params: {
  productId: string;
  price: number;
  buyerName: string;
  currentBalance: number;
}): MockPurchaseResult {
  const { productId, price, buyerName, currentBalance } = params;

  if (currentBalance < price) {
    return {
      success: false,
      error: "Недостаточно средств на балансе!",
    };
  }

  const chatResult = appendPurchaseSystemMessageToChats(
    productId,
    buyerName,
    price
  );

  if (!chatResult) {
    return {
      success: false,
      error: "Не удалось оформить покупку для этого товара",
    };
  }

  return {
    success: true,
    newBalance: currentBalance - price,
    chatId: chatResult.chatId,
  };
}
