import { createClient } from "@/lib/supabase";
import { mapDbMessage, type ChatMessage, type DbMessageRow } from "@/lib/types/message";
import type { OrderStatus } from "@/lib/types/order";
import { getSellerName } from "@/lib/user";
import type { User } from "@supabase/supabase-js";

export type ChatContext = {
  orderId: string;
  status: OrderStatus;
  offerDescription: string;
  counterpartName: string;
  currentUserName: string;
  isBuyer: boolean;
};

type DbOfferEmbed = {
  description: string;
  seller_name: string;
};

function resolveOffer(
  offers: DbOfferEmbed | DbOfferEmbed[] | null
): DbOfferEmbed | null {
  if (!offers) return null;
  if (Array.isArray(offers)) return offers[0] ?? null;
  return offers;
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
      offers ( description, seller_name )
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

  return {
    orderId: order.id,
    status: order.status as OrderStatus,
    offerDescription: offer.description,
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
