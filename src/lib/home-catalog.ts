import type { Game } from "@/lib/games";

export type CategoryBadge = "new" | "hit";

export type HomeCategory = {
  id: string;
  label: string;
  subtitle?: string;
  href: string;
  abbr: string;
  imageSrc: string;
  fallbackTileClass: string;
  badge?: CategoryBadge;
  disabled?: boolean;
  slug?: string | null;
};

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "steam",
    label: "Steam",
    subtitle: "Ключи",
    href: "/",
    abbr: "ST",
    imageSrc: "/home/categories/steam.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#1b3a5c] to-[#0d1b2a] border border-[#2a4a6b]/50",
    badge: "new",
  },
  {
    id: "brawl-stars",
    label: "Brawl Stars",
    subtitle: "Аккаунты",
    href: "#",
    abbr: "BS",
    imageSrc: "/home/categories/brawlstars.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#ffc83d] to-[#ff6b00] border border-orange-400/30",
    badge: "new",
    disabled: true,
  },
  {
    id: "roblox",
    label: "Roblox",
    subtitle: "Робуксы",
    href: "/games/roblox",
    slug: "roblox",
    abbr: "RB",
    imageSrc: "/home/categories/roblox.png",
    fallbackTileClass: "bg-[#3a3a3a] border border-white/10",
  },
  {
    id: "genshin",
    label: "Genshin",
    subtitle: "Impact",
    href: "#",
    abbr: "GI",
    imageSrc: "/home/categories/genshin.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#4c3d8f] to-[#2d2b42] border border-violet-400/20",
    disabled: true,
  },
  {
    id: "cs2",
    label: "CS2",
    subtitle: "Скины",
    href: "/games/cs2",
    slug: "cs2",
    abbr: "CS2",
    imageSrc: "/home/categories/cs2.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#1a1a1a] to-[#c45c00] border border-orange-500/30",
  },
  {
    id: "gmod",
    label: "Garry's Mod",
    href: "#",
    abbr: "GM",
    imageSrc: "/home/categories/gmod.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#1a1a2e] to-[#2563eb] border border-blue-400/20",
    disabled: true,
  },
  {
    id: "mlbb",
    label: "Mobile",
    subtitle: "Legends",
    href: "#",
    abbr: "ML",
    imageSrc: "/home/categories/mlbb.svg",
    fallbackTileClass:
      "bg-linear-to-br from-[#0a1628] to-[#be123c] border border-rose-400/20",
    disabled: true,
  },
  {
    id: "playstation",
    label: "PlayStation",
    href: "#",
    abbr: "PS",
    imageSrc: "/home/categories/playstation.png",
    fallbackTileClass: "bg-[#003791] border border-blue-400/30",
    disabled: true,
  },
  {
    id: "xbox",
    label: "Xbox",
    href: "#",
    abbr: "XB",
    imageSrc: "/home/categories/xbox.png",
    fallbackTileClass: "bg-[#107C10] border border-green-400/30",
    disabled: true,
  },
  {
    id: "telegram",
    label: "Telegram",
    subtitle: "Premium",
    href: "#",
    abbr: "TG",
    imageSrc: "/home/categories/telegram.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#229ED9] to-[#1a7fb5] border border-sky-300/30",
    disabled: true,
  },
  {
    id: "gta-vi",
    label: "GTA VI",
    subtitle: "Ключи",
    href: "/games/gta-v",
    slug: "gta-v",
    abbr: "VI",
    imageSrc: "/home/categories/gtavi.png",
    fallbackTileClass:
      "bg-linear-to-br from-[#f03067] to-[#f7941d] border border-pink-400/30",
    badge: "hit",
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
    href: "/games/cs2",
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
    href: "/games/dota-2",
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
    href: "/games/roblox",
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
    href: "#",
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
    href: "#",
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
