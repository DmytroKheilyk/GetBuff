import type { OrderStatus } from "@/lib/types/order";

export type ChatContext = {
  orderId: string;
  status: OrderStatus;
  offerDescription: string;
  offerPrice: number;
  gameTitle: string;
  gameSlug: string;
  counterpartName: string;
  currentUserName: string;
  isBuyer: boolean;
};

export type ChatThread = {
  orderId: string;
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
};

export function threadToChatContext(thread: ChatThread): ChatContext {
  return {
    orderId: thread.orderId,
    status: thread.status,
    offerDescription: thread.offerDescription,
    offerPrice: thread.offerPrice,
    gameTitle: thread.gameTitle,
    gameSlug: thread.gameSlug,
    counterpartName: thread.counterpartName,
    currentUserName: thread.currentUserName,
    isBuyer: thread.isBuyer,
  };
}
