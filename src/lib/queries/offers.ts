import { createDataClient } from "@/lib/supabase";
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

  return (data as DbOfferRow[]).map((row) => mapDbOffer(row, gameSlug));
}
