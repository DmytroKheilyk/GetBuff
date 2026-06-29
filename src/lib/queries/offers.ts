import { createDataClient } from "@/lib/supabase";
import { fetchSellerRatingStats } from "@/lib/queries/reviews";
import { mapDbOffer, type DbOfferRow, type Offer } from "@/lib/types/offer";

export async function fetchOffersByGameId(
  gameId: string,
  gameSlug: string
): Promise<Offer[]> {
  const supabase = createDataClient();

  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchOffersByGameId]", error.message);
    return [];
  }

  const offers = (data as DbOfferRow[]).map((row) => mapDbOffer(row, gameSlug));

  const sellerNames = offers.map((offer) => offer.seller.nickname);
  const statsMap = await fetchSellerRatingStats(sellerNames);

  return offers.map((offer) => {
    const stats = statsMap.get(offer.seller.nickname);
    if (!stats) return offer;

    return {
      ...offer,
      seller: {
        ...offer.seller,
        reviewAverage: stats.average,
        reviewCount: stats.count,
      },
    };
  });
}
