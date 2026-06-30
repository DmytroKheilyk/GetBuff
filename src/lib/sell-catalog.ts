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

export const SELL_GAME_OPTIONS: SellGameOption[] = [
  {
    id: "gta-vi",
    slug: "gta-v",
    title: "GTA VI",
    imageSrc: "/home/categories/gtavi.png",
    fallbackClass: "bg-linear-to-br from-[#f03067] to-[#f7941d]",
  },
  {
    id: "cs2",
    slug: "cs2",
    title: "Counter-Strike 2",
    imageSrc: "/home/showcase/cs2.jpg",
    fallbackClass: "bg-linear-to-br from-[#141414] to-[#e87500]",
  },
  {
    id: "dota-2",
    slug: "dota-2",
    title: "Dota 2",
    imageSrc: "/home/showcase/dota2.jpg",
    fallbackClass: "bg-linear-to-br from-[#1a0505] to-[#8b0000]",
  },
  {
    id: "roblox",
    slug: "roblox",
    title: "Roblox",
    imageSrc: "/home/categories/roblox.png",
    fallbackClass: "bg-[#3a3a3a]",
  },
  {
    id: "brawl-stars",
    slug: "brawl-stars",
    title: "Brawl Stars",
    imageSrc: "/home/categories/brawlstars.png",
    fallbackClass: "bg-linear-to-br from-[#ffc83d] to-[#ff6b00]",
  },
  {
    id: "genshin",
    slug: "genshin",
    title: "Genshin Impact",
    imageSrc: "/home/categories/genshin.png",
    fallbackClass: "bg-linear-to-br from-[#4c3d8f] to-[#2d2b42]",
  },
  {
    id: "gmod",
    slug: "gmod",
    title: "Garry's Mod",
    imageSrc: "/home/categories/gmod.svg",
    fallbackClass: "bg-linear-to-br from-[#1a1a2e] to-[#2563eb]",
  },
  {
    id: "mlbb",
    slug: "mlbb",
    title: "Mobile Legends",
    imageSrc: "/home/categories/mlbb.svg",
    fallbackClass: "bg-linear-to-br from-[#0a1628] to-[#be123c]",
  },
  {
    id: "minecraft",
    slug: "minecraft",
    title: "Minecraft",
    imageSrc: "/home/showcase/minecraft.jpg",
    fallbackClass: "bg-linear-to-br from-[#3d8b40] to-[#2d5a27]",
  },
  {
    id: "cod",
    slug: "call-of-duty",
    title: "Call of Duty",
    imageSrc: "/home/showcase/cod.jpg",
    fallbackClass: "bg-linear-to-br from-[#1a1a1a] to-[#555]",
  },
  {
    id: "steam",
    slug: "steam",
    title: "Steam",
    subtitle: "Ключи и пополнение",
    imageSrc: "/home/categories/steam.png",
    fallbackClass: "bg-linear-to-br from-[#1b3a5c] to-[#0d1b2a]",
  },
  {
    id: "playstation",
    slug: "playstation",
    title: "PlayStation",
    imageSrc: "/home/categories/playstation.png",
    fallbackClass: "bg-[#003791]",
  },
  {
    id: "xbox",
    slug: "xbox",
    title: "Xbox",
    imageSrc: "/home/categories/xbox.png",
    fallbackClass: "bg-[#107C10]",
  },
  {
    id: "telegram",
    slug: "telegram",
    title: "Telegram Premium",
    imageSrc: "/home/categories/telegram.png",
    fallbackClass: "bg-linear-to-br from-[#229ED9] to-[#1a7fb5]",
  },
];

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
  dbGames: { id: string; slug: string }[]
): string | null {
  const match = dbGames.find((game) => game.slug === slug);
  return match?.id ?? null;
}
