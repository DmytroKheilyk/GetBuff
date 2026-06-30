export type ChatMessageType = "text" | "system";

export type ChatMessage = {
  id: string;
  orderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
  type?: ChatMessageType;
  image?: string;
};

/** Алиас сообщения в UI чата. */
export type Message = ChatMessage;

export function getChatMessageType(message: ChatMessage): ChatMessageType {
  return message.type ?? "text";
}

export function isSystemChatMessage(message: ChatMessage): boolean {
  return getChatMessageType(message) === "system";
}

export type DbMessageRow = {
  id: string;
  order_id: string;
  sender_name: string;
  content: string;
  created_at: string;
};

export function mapDbMessage(row: DbMessageRow): ChatMessage {
  return {
    id: row.id,
    orderId: row.order_id,
    senderName: row.sender_name,
    content: row.content,
    createdAt: row.created_at,
    type: "text",
  };
}
