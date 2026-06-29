import { createClient } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/lib/types/order";
import { getSellerName } from "@/lib/user";
import type { User } from "@supabase/supabase-js";

type DbOrderRow = {
  id: string;
  status: string;
  created_at: string;
  buyer_name: string;
  offers: DbOfferEmbed | DbOfferEmbed[] | null;
};

type DbOfferEmbed = {
  description: string;
  price: number;
  seller_name: string;
  games: { title: string; slug: string } | { title: string; slug: string }[] | null;
};

function resolveOffer(offers: DbOfferEmbed | DbOfferEmbed[] | null): DbOfferEmbed | null {
  if (!offers) return null;
  if (Array.isArray(offers)) return offers[0] ?? null;
  return offers;
}

function resolveGame(
  games: { title: string; slug: string } | { title: string; slug: string }[] | null
): { title: string; slug: string } | null {
  if (!games) return null;
  if (Array.isArray(games)) return games[0] ?? null;
  return games;
}

function mapOrderRow(row: DbOrderRow): Order | null {
  const offer = resolveOffer(row.offers);
  if (!offer) return null;
  const game = resolveGame(offer.games);

  return {
    id: row.id,
    status: row.status as OrderStatus,
    createdAt: row.created_at,
    buyerName: row.buyer_name,
    offerDescription: offer.description,
    offerPrice: Number(offer.price),
    sellerName: offer.seller_name,
    gameTitle: game?.title ?? "—",
    gameSlug: game?.slug ?? "",
  };
}

export async function fetchMyPurchases(user: User): Promise<Order[]> {
  const supabase = await createClient();
  const buyerName = getSellerName(user);

  const { data, error } = await supabase
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
    .eq("buyer_name", buyerName)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchMyPurchases]", error.message);
    return [];
  }

  return (data as DbOrderRow[])
    .map(mapOrderRow)
    .filter((order): order is Order => order !== null);
}

export async function fetchMySales(user: User): Promise<Order[]> {
  const supabase = await createClient();
  const sellerName = getSellerName(user);

  const { data, error } = await supabase
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
    .eq("offers.seller_name", sellerName)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchMySales]", error.message);
    return [];
  }

  return (data as DbOrderRow[])
    .map(mapOrderRow)
    .filter((order): order is Order => order !== null);
}
