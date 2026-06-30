import type { OrderStatus } from "@/lib/types/order";

export type ChatContext = {
  orderId: string;
  productId?: string;
  status: OrderStatus;
  offerDescription: string;
  offerPrice: number;
  gameTitle: string;
  gameSlug: string;
  counterpartName: string;
  currentUserName: string;
  isBuyer: boolean;
  isArchived?: boolean;
};

export type ChatThread = {
  orderId: string;
  productId?: string;
  status: OrderStatus;
  counterpartName: string;
  currentUserName: string;
  isBuyer: boolean;
  offerDescription: string;
  offerPrice: number;
  gameTitle: string;
  gameSlug: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  isOnline: boolean;
  unreadCount?: number;
  productShortLabel?: string;
  isArchived?: boolean;
};

export function threadToChatContext(thread: ChatThread): ChatContext {
  return {
    orderId: thread.orderId,
    productId: thread.productId,
    status: thread.status,
    offerDescription: thread.offerDescription,
    offerPrice: thread.offerPrice,
    gameTitle: thread.gameTitle,
    gameSlug: thread.gameSlug,
    counterpartName: thread.counterpartName,
    currentUserName: thread.currentUserName,
    isBuyer: thread.isBuyer,
    isArchived: thread.isArchived,
  };
}
