import { CATALOG_GAME_SLUGS } from "@/lib/game-slug";
import { HOME_CATEGORIES } from "@/lib/home-catalog";
import { USE_MOCK_DATA } from "@/lib/mock-data";
import type { Game } from "@/lib/types/game";
import { getGameGradients } from "@/lib/types/game";

export type SellGameOption = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  fallbackClass: string;
};

export type SellCategoryOption = {
  id: string;
  dbCategory: string;
  label: string;
  hint: string;
};

export const PLATFORM_COMMISSION_RATE = 0.1;

export const MOCK_SELL_GAME_ID_PREFIX = "mock-game-";

const SHOWCASE_IMAGES: Record<string, string> = {
  cs2: "/home/showcase/cs2.jpg",
  "dota-2": "/home/showcase/dota2.jpg",
  roblox: "/home/showcase/roblox.jpg",
  minecraft: "/home/showcase/minecraft.jpg",
  "call-of-duty": "/home/showcase/cod.jpg",
};

export const SELL_GAME_OPTIONS: SellGameOption[] = Object.entries(
  CATALOG_GAME_SLUGS
).map(([slug, meta]) => {
  const homeCategory = HOME_CATEGORIES.find((category) => category.slug === slug);

  return {
    id: slug,
    slug,
    title: meta.title,
    subtitle: slug === "steam" ? "Ключи и пополнение" : undefined,
    imageSrc:
      homeCategory?.imageSrc ??
      SHOWCASE_IMAGES[slug] ??
      "/home/showcase/cs2.jpg",
    fallbackClass:
      homeCategory?.fallbackTileClass ??
      "bg-linear-to-br from-neutral-300 to-neutral-500 dark:from-[#2a2d38] dark:to-[#14161d]",
  };
});

export const SELL_CATEGORY_OPTIONS: SellCategoryOption[] = [
  {
    id: "accounts",
    dbCategory: "accounts",
    label: "Аккаунты",
    hint: "Полный доступ, личные, брут",
  },
  {
    id: "currency",
    dbCategory: "currency",
    label: "Игровая валюта",
    hint: "Робуксы, гемы, золото, монеты",
  },
  {
    id: "keys",
    dbCategory: "keys",
    label: "Ключи и коды",
    hint: "Гифты, активация, Steam-ключи",
  },
  {
    id: "items",
    dbCategory: "items",
    label: "Скины и предметы",
    hint: "Оружие, ножи, кейсы, одежда",
  },
  {
    id: "boost",
    dbCategory: "boost",
    label: "Услуги и буст",
    hint: "Прокачка, калибровка, прохождение",
  },
  {
    id: "subscriptions",
    dbCategory: "subscriptions",
    label: "Подписки",
    hint: "Telegram Premium, PS Plus, Xbox Game Pass",
  },
];

export function buildSellGames(dbGames: Game[]): Game[] {
  const dbBySlug = new Map(dbGames.map((game) => [game.slug, game]));
  const merged = new Map<string, Game>();

  for (const option of SELL_GAME_OPTIONS) {
    const catalogMeta = CATALOG_GAME_SLUGS[option.slug];
    const dbSlug = catalogMeta?.dbSlug ?? option.slug;
    const dbGame = dbBySlug.get(dbSlug);

    if (dbGame) {
      merged.set(option.slug, {
        ...dbGame,
        slug: option.slug,
        title: option.title,
      });
      continue;
    }

    if (USE_MOCK_DATA) {
      const { gradientFrom, gradientTo } = getGameGradients(dbSlug);
      merged.set(option.slug, {
        id: `${MOCK_SELL_GAME_ID_PREFIX}${option.slug}`,
        title: option.title,
        slug: option.slug,
        imageUrl: option.imageSrc,
        platform: null,
        listingsCount: 0,
        gradientFrom,
        gradientTo,
      });
    }
  }

  if (!USE_MOCK_DATA) {
    return Array.from(merged.values());
  }

  for (const game of dbGames) {
    if (!Array.from(merged.values()).some((item) => item.id === game.id)) {
      merged.set(game.slug, game);
    }
  }

  return Array.from(merged.values());
}

export function calculateSellerIncome(
  buyerPrice: number,
  commissionRate = PLATFORM_COMMISSION_RATE
): number {
  if (!Number.isFinite(buyerPrice) || buyerPrice <= 0) return 0;
  return Math.floor(buyerPrice * (1 - commissionRate));
}

export function formatRubles(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function resolveGameIdBySlug(
  slug: string,
  games: Game[]
): string | null {
  const match = games.find((game) => game.slug === slug);
  return match?.id ?? null;
}

export function isMockSellGameId(gameId: string): boolean {
  return gameId.startsWith(MOCK_SELL_GAME_ID_PREFIX);
}
