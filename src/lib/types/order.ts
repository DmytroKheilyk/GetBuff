export type OrderStatus = "pending" | "completed" | "cancelled";

export type Order = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  buyerName: string;
  offerDescription: string;
  offerPrice: number;
  sellerName: string;
  gameTitle: string;
  gameSlug: string;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "В обработке",
  completed: "Выполнен",
  cancelled: "Отменён",
};

export const CHAT_ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Ожидает выполнения",
  completed: "Выполнен",
  cancelled: "Отменён",
};
