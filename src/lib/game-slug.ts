import type { Game } from "@/lib/types/game";
import { getGameGradients } from "@/lib/types/game";

export type CatalogGameSlug = {
  title: string;
  dbSlug?: string;
};

/** Все публичные слаги каталога (категории + популярные игры) */
export const CATALOG_GAME_SLUGS: Record<string, CatalogGameSlug> = {
  steam: { title: "Steam" },
  "brawl-stars": { title: "Brawl Stars" },
  roblox: { title: "Roblox", dbSlug: "roblox" },
  genshin: { title: "Genshin Impact" },
  cs2: { title: "Counter-Strike 2", dbSlug: "cs2" },
  "dota-2": { title: "Dota 2", dbSlug: "dota-2" },
  minecraft: { title: "Minecraft" },
  "call-of-duty": { title: "Call of Duty" },
  "garrys-mod": { title: "Garry's Mod" },
  "mobile-legends": { title: "Mobile Legends" },
  playstation: { title: "PlayStation" },
  xbox: { title: "Xbox" },
  telegram: { title: "Telegram Premium" },
  "gta-6": { title: "GTA VI", dbSlug: "gta-v" },
  "discord-nitro": { title: "Discord Nitro" },
  "pubg-mobile": { title: "PUBG Mobile" },
  fortnite: { title: "Fortnite" },
  valorant: { title: "Valorant" },
  "free-fire": { title: "Free Fire" },
  "league-of-legends": { title: "League of Legends" },
  "google-play": { title: "Google Play" },
  "app-store": { title: "App Store" },
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidGameSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function isCatalogGameSlug(slug: string): boolean {
  return slug in CATALOG_GAME_SLUGS;
}

export function getCatalogGameTitle(slug: string): string {
  return CATALOG_GAME_SLUGS[slug]?.title ?? formatSlugToTitle(slug);
}

export function resolveDbGameSlug(slug: string): string {
  return CATALOG_GAME_SLUGS[slug]?.dbSlug ?? slug;
}

export function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createVirtualGame(slug: string): Game {
  const { gradientFrom, gradientTo } = getGameGradients(resolveDbGameSlug(slug));

  return {
    id: "",
    title: getCatalogGameTitle(slug),
    slug,
    imageUrl: null,
    platform: null,
    listingsCount: 0,
    gradientFrom,
    gradientTo,
  };
}

export function getAllCatalogSlugs(): string[] {
  return Object.keys(CATALOG_GAME_SLUGS);
}
