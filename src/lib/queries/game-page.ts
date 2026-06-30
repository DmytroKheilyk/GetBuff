import type { Game } from "@/lib/games";
import {
  createVirtualGame,
  getAllCatalogSlugs,
  getCatalogGameTitle,
  isValidGameSlug,
  resolveDbGameSlug,
} from "@/lib/game-slug";
import { createDataClient } from "@/lib/supabase";
import { mapDbGame, type DbGameRow } from "@/lib/types/game";

export async function resolveGameForCatalog(slug: string): Promise<Game | null> {
  if (!isValidGameSlug(slug)) {
    return null;
  }

  const dbSlug = resolveDbGameSlug(slug);
  const supabase = createDataClient();

  const { data, error } = await supabase
    .from("games")
    .select("*, offers(count)")
    .eq("slug", dbSlug)
    .maybeSingle();

  if (error) {
    console.error("[resolveGameForCatalog]", error.message);
  }

  if (data) {
    const game = mapDbGame(data as DbGameRow);
    return { ...game, slug, title: getCatalogGameTitle(slug) };
  }

  return createVirtualGame(slug);
}

export async function fetchAllGamePageSlugs(): Promise<string[]> {
  const supabase = createDataClient();
  const { data } = await supabase.from("games").select("slug");

  const dbSlugs = (data ?? []).map((row) => row.slug as string);
  return [...new Set([...getAllCatalogSlugs(), ...dbSlugs])];
}
