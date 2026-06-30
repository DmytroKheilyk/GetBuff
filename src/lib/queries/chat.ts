import { createClient } from "@/lib/supabase";
import { mapDbMessage, type ChatMessage, type DbMessageRow } from "@/lib/types/message";
import type { ChatContext, ChatThread } from "@/lib/types/chat";
import type { OrderStatus } from "@/lib/types/order";
import { getSellerName } from "@/lib/user";
import type { User } from "@supabase/supabase-js";

export type { ChatContext, ChatThread } from "@/lib/types/chat";
export { threadToChatContext } from "@/lib/types/chat";

type DbOfferEmbed = {
  description: string;
  price: number;
  seller_name: string;
  games: { title: string; slug: string } | { title: string; slug: string }[] | null;
};

function resolveGame(
  games: { title: string; slug: string } | { title: string; slug: string }[] | null
): { title: string; slug: string } | null {
  if (!games) return null;
  if (Array.isArray(games)) return games[0] ?? null;
  return games;
}

function resolveOffer(
  offers: DbOfferEmbed | DbOfferEmbed[] | null
): DbOfferEmbed | null {
  if (!offers) return null;
  if (Array.isArray(offers)) return offers[0] ?? null;
  return offers;
}

type DbOrderForChat = {
  id: string;
  status: string;
  created_at: string;
  buyer_name: string;
  offers: DbOfferEmbed | DbOfferEmbed[] | null;
};

type DbMessagePreview = {
  order_id: string;
  content: string;
  created_at: string;
};

function mapOrderToThread(
  row: DbOrderForChat,
  userName: string,
  latestMessage: DbMessagePreview | null
): ChatThread | null {
  const offer = resolveOffer(row.offers);
  if (!offer) return null;

  const isBuyer = row.buyer_name === userName;
  const isSeller = offer.seller_name === userName;
  if (!isBuyer && !isSeller) return null;

  const game = resolveGame(offer.games);

  return {
    orderId: row.id,
    status: row.status as OrderStatus,
    counterpartName: isBuyer ? offer.seller_name : row.buyer_name,
    currentUserName: userName,
    isBuyer,
    offerDescription: offer.description,
    offerPrice: Number(offer.price),
    gameTitle: game?.title ?? "—",
    gameSlug: game?.slug ?? "",
    lastMessagePreview:
      latestMessage?.content ?? "Начните диалог по заказу",
    lastMessageAt: latestMessage?.created_at ?? row.created_at,
    isOnline: true,
  };
}

export async function fetchChatContext(
  orderId: string,
  user: User
): Promise<ChatContext | null> {
  const userName = getSellerName(user);
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      buyer_name,
      offers ( description, price, seller_name, games ( title, slug ) )
    `
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) {
    return null;
  }

  const offer = resolveOffer(order.offers as DbOfferEmbed | DbOfferEmbed[] | null);
  if (!offer) return null;

  const isBuyer = order.buyer_name === userName;
  const isSeller = offer.seller_name === userName;

  if (!isBuyer && !isSeller) {
    return null;
  }

  const game = resolveGame(offer.games);

  return {
    orderId: order.id,
    status: order.status as OrderStatus,
    offerDescription: offer.description,
    offerPrice: Number(offer.price),
    gameTitle: game?.title ?? "—",
    gameSlug: game?.slug ?? "",
    counterpartName: isBuyer ? offer.seller_name : order.buyer_name,
    currentUserName: userName,
    isBuyer,
  };
}

export async function fetchOrderMessages(orderId: string): Promise<ChatMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[fetchOrderMessages]", error.message);
    return [];
  }

  return (data as DbMessageRow[]).map(mapDbMessage);
}

export async function fetchUserChatThreads(user: User): Promise<ChatThread[]> {
  const userName = getSellerName(user);
  const supabase = await createClient();

  const [purchasesResult, salesResult] = await Promise.all([
    supabase
      .from("orders")
      .select(
        `
        id,
        status,
        created_at,
        buyer_name,
        offers ( description, price, seller_name, games ( title, slug ) )
      `
      )
      .eq("buyer_name", userName),
    supabase
      .from("orders")
      .select(
        `
        id,
        status,
        created_at,
        buyer_name,
        offers!inner ( description, price, seller_name, games ( title, slug ) )
      `
      )
      .eq("offers.seller_name", userName),
  ]);

  if (purchasesResult.error) {
    console.error("[fetchUserChatThreads:purchases]", purchasesResult.error.message);
  }
  if (salesResult.error) {
    console.error("[fetchUserChatThreads:sales]", salesResult.error.message);
  }

  const orderMap = new Map<string, DbOrderForChat>();
  for (const row of [
    ...(purchasesResult.data ?? []),
    ...(salesResult.data ?? []),
  ] as DbOrderForChat[]) {
    orderMap.set(row.id, row);
  }

  const orderIds = Array.from(orderMap.keys());
  if (orderIds.length === 0) return [];

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("order_id, content, created_at")
    .in("order_id", orderIds)
    .order("created_at", { ascending: false });

  if (messagesError) {
    console.error("[fetchUserChatThreads:messages]", messagesError.message);
  }

  const latestByOrder = new Map<string, DbMessagePreview>();
  for (const message of (messages ?? []) as DbMessagePreview[]) {
    if (!latestByOrder.has(message.order_id)) {
      latestByOrder.set(message.order_id, message);
    }
  }

  return Array.from(orderMap.values())
    .map((row) =>
      mapOrderToThread(row, userName, latestByOrder.get(row.id) ?? null)
    )
    .filter((thread): thread is ChatThread => thread !== null)
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
}
