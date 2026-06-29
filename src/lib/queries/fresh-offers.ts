import { createDataClient } from "@/lib/supabase";
import { fetchSellerRatingStats } from "@/lib/queries/reviews";
import type { FreshOffer } from "@/lib/types/fresh-offer";

type DbFreshOfferRow = {
  id: string;
  description: string;
  price: number;
  seller_name: string;
  created_at: string;
  games: DbGameEmbed | DbGameEmbed[] | null;
};

type DbGameEmbed = {
  title: string;
  slug: string;
  image_url: string | null;
};

function resolveGame(
  games: DbGameEmbed | DbGameEmbed[] | null
): DbGameEmbed | null {
  if (!games) return null;
  if (Array.isArray(games)) return games[0] ?? null;
  return games;
}

export async function fetchLatestOffers(limit = 8): Promise<FreshOffer[]> {
  const supabase = createDataClient();

  const { data, error } = await supabase
    .from("offers")
    .select(
      `
      id,
      description,
      price,
      seller_name,
      created_at,
      games ( title, slug, image_url )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[fetchLatestOffers]", error.message);
    return [];
  }

  const rows = data as DbFreshOfferRow[];
  const sellerNames = rows.map((row) => row.seller_name);
  const statsMap = await fetchSellerRatingStats(sellerNames);

  return rows
    .map((row) => {
      const game = resolveGame(row.games);
      if (!game) return null;

      const stats = statsMap.get(row.seller_name);

      return {
        id: row.id,
        description: row.description,
        price: Number(row.price),
        sellerName: row.seller_name,
        reviewAverage: stats?.average ?? null,
        reviewCount: stats?.count ?? 0,
        gameTitle: game.title,
        gameSlug: game.slug,
        gameImageUrl: game.image_url,
        createdAt: row.created_at,
      } satisfies FreshOffer;
    })
    .filter((offer): offer is FreshOffer => offer !== null);
}
