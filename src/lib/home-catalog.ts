import type { Game } from "@/lib/games";

export type CategoryBadge = "new" | "hit";

export type HomeCategory = {
  id: string;
  slug: string;
  label: string;
  abbr: string;
  imageSrc: string;
  fallbackTileClass: string;
  badge?: CategoryBadge;
};

export function getCategoryHref(slug: string): string {
  return `/games/${slug}`;
}

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "steam",
    slug: "steam",
    label: "Steam",
    abbr: "ST",
    imageSrc: "/home/categories/steam.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#1b3a5c] to-[#0d1b2a] border border-[#2a4a6b]/50",
    badge: "new",
  },
  {
    id: "brawl-stars",
    slug: "brawl-stars",
    label: "Brawl Stars",
    abbr: "BS",
    imageSrc: "/home/categories/brawlstars.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#ffc83d] to-[#ff6b00] border border-orange-400/30",
    badge: "new",
  },
  {
    id: "roblox",
    slug: "roblox",
    label: "Roblox",
    abbr: "RB",
    imageSrc: "/home/categories/roblox.png",
    fallbackTileClass: "bg-[#3a3a3a] border border-white/10",
    badge: "hit",
  },
  {
    id: "genshin",
    slug: "genshin",
    label: "Genshin Impact",
    abbr: "GI",
    imageSrc: "/home/categories/genshin.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#4c3d8f] to-[#2d2b42] border border-violet-400/20",
  },
  {
    id: "cs2",
    slug: "cs2",
    label: "CS2",
    abbr: "CS2",
    imageSrc: "/home/categories/cs2.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#1a1a1a] to-[#c45c00] border border-orange-500/30",
  },
  {
    id: "gmod",
    slug: "garrys-mod",
    label: "Garry's Mod",
    abbr: "GM",
    imageSrc: "/home/categories/gmod.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#1a1a2e] to-[#2563eb] border border-blue-400/20",
  },
  {
    id: "mlbb",
    slug: "mobile-legends",
    label: "Mobile Legends",
    abbr: "ML",
    imageSrc: "/home/categories/mlbb.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#0a1628] to-[#be123c] border border-rose-400/20",
  },
  {
    id: "playstation",
    slug: "playstation",
    label: "PlayStation",
    abbr: "PS",
    imageSrc: "/home/categories/playstation.png",
    fallbackTileClass: "bg-[#003791] border border-blue-400/30",
  },
  {
    id: "xbox",
    slug: "xbox",
    label: "Xbox",
    abbr: "XB",
    imageSrc: "/home/categories/xbox.png",
    fallbackTileClass: "bg-[#107C10] border border-green-400/30",
  },
  {
    id: "telegram",
    slug: "telegram",
    label: "Telegram Premium",
    abbr: "TG",
    imageSrc: "/home/categories/telegram.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#229ED9] to-[#1a7fb5] border border-sky-300/30",
  },
  {
    id: "gta-vi",
    slug: "gta-6",
    label: "GTA VI",
    abbr: "VI",
    imageSrc: "/home/categories/gtavi.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#f03067] to-[#f7941d] border border-pink-400/30",
    badge: "hit",
  },
  {
    id: "discord-nitro",
    slug: "discord-nitro",
    label: "Discord Nitro",
    abbr: "DN",
    imageSrc: "/home/categories/discord-nitro.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#5865F2] to-[#3c45a5] border border-indigo-400/30",
    badge: "new",
  },
  {
    id: "pubg-mobile",
    slug: "pubg-mobile",
    label: "PUBG Mobile",
    abbr: "PG",
    imageSrc: "/home/categories/pubg-mobile.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#1a1a1a] to-[#f2a900] border border-amber-500/30",
    badge: "new",
  },
  {
    id: "fortnite",
    slug: "fortnite",
    label: "Fortnite",
    abbr: "FN",
    imageSrc: "/home/categories/fortnite.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#5b2c83] to-[#00d4ff] border border-violet-400/30",
    badge: "hit",
  },
  {
    id: "valorant",
    slug: "valorant",
    label: "Valorant",
    abbr: "VAL",
    imageSrc: "/home/categories/valorant.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#ff4655] to-[#0f1923] border border-rose-400/30",
    badge: "new",
  },
  {
    id: "free-fire",
    slug: "free-fire",
    label: "Free Fire",
    abbr: "FF",
    imageSrc: "/home/categories/free-fire.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#ff6b00] to-[#1a1a1a] border border-orange-500/30",
    badge: "hit",
  },
  {
    id: "league-of-legends",
    slug: "league-of-legends",
    label: "League of Legends",
    abbr: "LoL",
    imageSrc: "/home/categories/league-of-legends.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#0a1428] to-[#c89b3c] border border-amber-400/30",
  },
  {
    id: "google-play",
    slug: "google-play",
    label: "Google Play",
    abbr: "GP",
    imageSrc: "/home/categories/google-play.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#34a853] via-[#4285f4] to-[#ea4335] border border-white/10",
    badge: "new",
  },
  {
    id: "app-store",
    slug: "app-store",
    label: "App Store",
    abbr: "AS",
    imageSrc: "/home/categories/app-store.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#0a84ff] to-[#1c1c1e] border border-sky-400/30",
    badge: "new",
  },
];

export type ShowcaseGame = {
  id: string;
  slug: string;
  title: string;
  categoryLabel: string;
  priceFrom: number;
  href: string;
  posterSrc: string;
  fallbackTileClass: string;
  abbr: string;
  listingsCount: number;
  badge?: CategoryBadge;
};

const SHOWCASE_DEFS: Omit<ShowcaseGame, "listingsCount">[] = [
  {
    id: "cs2",
    slug: "cs2",
    title: "Counter-Strike 2",
    categoryLabel: "Скины",
    priceFrom: 120,
    href: getCategoryHref("cs2"),
    posterSrc: "/home/showcase/cs2.jpg",
    fallbackTileClass:
      "bg-linear-to-br from-[#141414] via-[#2a1500] to-[#e87500]",
    abbr: "CS2",
  },
  {
    id: "dota-2",
    slug: "dota-2",
    title: "Dota 2",
    categoryLabel: "Скины",
    priceFrom: 89,
    href: getCategoryHref("dota-2"),
    posterSrc: "/home/showcase/dota2.jpg",
    fallbackTileClass:
      "bg-linear-to-br from-[#1a0505] via-[#4a0a0a] to-[#8b0000]",
    abbr: "DOTA",
  },
  {
    id: "roblox",
    slug: "roblox",
    title: "Roblox",
    categoryLabel: "Робуксы",
    priceFrom: 45,
    href: getCategoryHref("roblox"),
    posterSrc: "/home/showcase/roblox.jpg",
    fallbackTileClass:
      "bg-linear-to-br from-[#2d2d2d] via-[#4a4a4a] to-[#1e3a5f]",
    abbr: "RBX",
  },
  {
    id: "minecraft",
    slug: "minecraft",
    title: "Minecraft",
    categoryLabel: "Ключи",
    priceFrom: 299,
    href: getCategoryHref("minecraft"),
    posterSrc: "/home/showcase/minecraft.jpg",
    fallbackTileClass:
      "bg-linear-to-br from-[#3d8b40] via-[#5cb85c] to-[#2d5a27]",
    abbr: "MC",
    badge: "hit",
  },
  {
    id: "call-of-duty",
    slug: "call-of-duty",
    title: "Call of Duty",
    categoryLabel: "Аккаунты",
    priceFrom: 150,
    href: getCategoryHref("call-of-duty"),
    posterSrc: "/home/showcase/cod.jpg",
    fallbackTileClass:
      "bg-linear-to-br from-[#1a1a1a] via-[#333] to-[#555]",
    abbr: "COD",
    badge: "new",
  },
];

export function buildShowcaseGames(dbGames: Game[]): ShowcaseGame[] {
  const dbBySlug = new Map(dbGames.map((g) => [g.slug, g]));

  return SHOWCASE_DEFS.map((def) => ({
    ...def,
    listingsCount: dbBySlug.get(def.slug)?.listingsCount ?? 0,
  }));
}

export function filterShowcaseGames(
  items: ShowcaseGame[],
  query: string
): ShowcaseGame[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(normalized) ||
      item.categoryLabel.toLowerCase().includes(normalized) ||
      item.abbr.toLowerCase().includes(normalized)
  );
}

export function filterDbGames(games: Game[], query: string): Game[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return games;
  return games.filter((game) =>
    game.title.toLowerCase().includes(normalized)
  );
}

export function formatPriceFrom(price: number): string {
  return `от ${price.toLocaleString("ru-RU")} ₽`;
}

export function formatProductPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function getHomeCategoryBySlug(slug: string): HomeCategory | undefined {
  return HOME_CATEGORIES.find((category) => category.slug === slug);
}
