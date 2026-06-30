import { createClient, createDataClient } from "@/lib/supabase";
import { fetchSellerRatingStats } from "@/lib/queries/reviews";
import { mapDbOffer, type DbOfferRow } from "@/lib/types/offer";
import {
  resolveDeliveryLabel,
  type ProductOffer,
} from "@/lib/types/product-offer";
import { getSellerName } from "@/lib/user";
import type { User } from "@supabase/supabase-js";

type DbProductOfferRow = DbOfferRow & {
  games:
    | { title: string; slug: string }
    | { title: string; slug: string }[]
    | null;
};

function resolveGame(
  games: DbProductOfferRow["games"]
): { title: string; slug: string } | null {
  if (!games) return null;
  if (Array.isArray(games)) return games[0] ?? null;
  return games;
}

async function fetchSellerCompletedDealsCount(
  sellerName: string
): Promise<number> {
  const supabase = createDataClient();

  const { count, error } = await supabase
    .from("orders")
    .select("id, offers!inner(seller_name)", { count: "exact", head: true })
    .eq("offers.seller_name", sellerName)
    .eq("status", "completed");

  if (error) {
    console.error("[fetchSellerCompletedDealsCount]", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function fetchProductOfferById(
  id: string
): Promise<ProductOffer | null> {
  const supabase = createDataClient();

  const { data, error } = await supabase
    .from("offers")
    .select(
      `
      *,
      games ( title, slug )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[fetchProductOfferById]", error.message);
    return null;
  }

  const row = data as DbProductOfferRow;
  const game = resolveGame(row.games);
  if (!game) return null;

  const baseOffer = mapDbOffer(row, game.slug);
  const [statsMap, completedDealsCount] = await Promise.all([
    fetchSellerRatingStats([baseOffer.seller.nickname]),
    fetchSellerCompletedDealsCount(baseOffer.seller.nickname),
  ]);

  const stats = statsMap.get(baseOffer.seller.nickname);

  return {
    ...baseOffer,
    seller: {
      ...baseOffer.seller,
      reviewAverage: stats?.average ?? null,
      reviewCount: stats?.count ?? 0,
    },
    gameTitle: game.title,
    createdAt: row.created_at,
    completedDealsCount,
    deliveryLabel: resolveDeliveryLabel(row.description, row.category),
  };
}

export async function fetchUserOrderIdForOffer(
  user: User,
  offerId: string
): Promise<string | null> {
  const supabase = await createClient();
  const buyerName = getSellerName(user);

  const { data, error } = await supabase
    .from("orders")
    .select("id")
    .eq("offer_id", offerId)
    .eq("buyer_name", buyerName)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchUserOrderIdForOffer]", error.message);
    return null;
  }

  return data?.id ?? null;
}
