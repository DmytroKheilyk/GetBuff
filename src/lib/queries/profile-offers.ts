import { createClient } from "@/lib/supabase";
import { getSellerName } from "@/lib/user";
import type { OfferCategory } from "@/lib/types/offer";
import { normalizeCategory } from "@/lib/types/offer";
import type { User } from "@supabase/supabase-js";

export type ProfileOffer = {
  id: string;
  description: string;
  price: number;
  categoryRaw: string;
  categoryKey: OfferCategory | null;
  createdAt: string;
  gameTitle: string;
  gameSlug: string;
};

type DbProfileOfferRow = {
  id: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  games: { title: string; slug: string } | { title: string; slug: string }[] | null;
};

function resolveGame(
  games: DbProfileOfferRow["games"]
): { title: string; slug: string } | null {
  if (!games) return null;
  if (Array.isArray(games)) return games[0] ?? null;
  return games;
}

export async function fetchProfileOffers(
  user: User
): Promise<ProfileOffer[]> {
  const supabase = await createClient();
  const sellerName = getSellerName(user);

  const { data, error } = await supabase
    .from("offers")
    .select(
      `
      id,
      description,
      price,
      category,
      created_at,
      games ( title, slug )
    `
    )
    .eq("seller_name", sellerName)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchProfileOffers]", error.message);
    return [];
  }

  return (data as DbProfileOfferRow[]).map((row) => {
    const game = resolveGame(row.games);
    return {
      id: row.id,
      description: row.description,
      price: Number(row.price),
      categoryRaw: row.category,
      categoryKey: normalizeCategory(row.category),
      createdAt: row.created_at,
      gameTitle: game?.title ?? "—",
      gameSlug: game?.slug ?? "",
    };
  });
}
