import { createDataClient } from "@/lib/supabase";
import { mapDbGame, type DbGameRow, type Game } from "@/lib/types/game";

export type { Game } from "@/lib/types/game";

export async function fetchGames(): Promise<Game[]> {
  const supabase = createDataClient();

  const { data, error } = await supabase
    .from("games")
    .select("*, offers(count)")
    .order("title");

  if (error) {
    console.error("[fetchGames]", error.message);
    return [];
  }

  return (data as DbGameRow[]).map(mapDbGame);
}

export async function fetchGameBySlug(slug: string): Promise<Game | null> {
  const supabase = createDataClient();

  const { data, error } = await supabase
    .from("games")
    .select("*, offers(count)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[fetchGameBySlug]", error.message);
    return null;
  }

  if (!data) return null;

  return mapDbGame(data as DbGameRow);
}

export async function fetchGameSlugs(): Promise<string[]> {
  const games = await fetchGames();
  return games.map((game) => game.slug);
}
