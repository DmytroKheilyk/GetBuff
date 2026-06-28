export type OfferCategory = "currency" | "accounts" | "items" | "boost";

export const OFFER_CATEGORIES: {
  id: OfferCategory;
  label: string;
}[] = [
  { id: "currency", label: "Валюта" },
  { id: "accounts", label: "Аккаунты" },
  { id: "items", label: "Предметы" },
  { id: "boost", label: "Буст / Услуги" },
];

export type Seller = {
  nickname: string;
  avatarColor: string;
  rating: number;
  online: boolean;
};

export type Offer = {
  id: string;
  gameSlug: string;
  category: OfferCategory;
  seller: Seller;
  description: string;
  price: number;
};

export const mockOffers: Offer[] = [
  // Counter-Strike 2
  {
    id: "cs2-c-1",
    gameSlug: "cs2",
    category: "currency",
    seller: {
      nickname: "SkinLord42",
      avatarColor: "bg-orange-500/20 text-orange-400",
      rating: 4.9,
      online: true,
    },
    description: "5000 руб. на Steam-кошелёк, перевод за 5 минут",
    price: 4850,
  },
  {
    id: "cs2-c-2",
    gameSlug: "cs2",
    category: "currency",
    seller: {
      nickname: "TradeKing",
      avatarColor: "bg-amber-500/20 text-amber-400",
      rating: 4.7,
      online: false,
    },
    description: "10000 руб. Steam, без комиссии с вашей стороны",
    price: 9600,
  },
  {
    id: "cs2-i-1",
    gameSlug: "cs2",
    category: "items",
    seller: {
      nickname: "AWP_Master",
      avatarColor: "bg-sky-500/20 text-sky-400",
      rating: 5.0,
      online: true,
    },
    description: "AWP | Dragon Lore (FT) — чистый трейд, без бана",
    price: 890000,
  },
  {
    id: "cs2-i-2",
    gameSlug: "cs2",
    category: "items",
    seller: {
      nickname: "KnifeDealer",
      avatarColor: "bg-violet-500/20 text-violet-400",
      rating: 4.8,
      online: true,
    },
    description: "Karambit | Doppler Phase 2 (MW), instant trade",
    price: 245000,
  },
  {
    id: "cs2-i-3",
    gameSlug: "cs2",
    category: "items",
    seller: {
      nickname: "CaseOpener",
      avatarColor: "bg-rose-500/20 text-rose-400",
      rating: 4.5,
      online: false,
    },
    description: "Набор из 50 кейсов Revolution, передача подарком",
    price: 12500,
  },
  {
    id: "cs2-a-1",
    gameSlug: "cs2",
    category: "accounts",
    seller: {
      nickname: "PrimeSeller",
      avatarColor: "bg-emerald-500/20 text-emerald-400",
      rating: 4.6,
      online: true,
    },
    description: "Аккаунт Prime, 1200 часов, медали, полный доступ",
    price: 3200,
  },
  {
    id: "cs2-b-1",
    gameSlug: "cs2",
    category: "boost",
    seller: {
      nickname: "FaceitBooster",
      avatarColor: "bg-cyan-500/20 text-cyan-400",
      rating: 4.9,
      online: true,
    },
    description: "Буст Faceit до 2000 ELO, играю на вашем аккаунте",
    price: 15000,
  },
  {
    id: "cs2-b-2",
    gameSlug: "cs2",
    category: "boost",
    seller: {
      nickname: "PremierPro",
      avatarColor: "bg-indigo-500/20 text-indigo-400",
      rating: 4.4,
      online: false,
    },
    description: "Premier: поднятие до 15000 рейтинга за 2 недели",
    price: 8500,
  },

  // Dota 2
  {
    id: "dota-c-1",
    gameSlug: "dota-2",
    category: "currency",
    seller: {
      nickname: "MMShop",
      avatarColor: "bg-red-500/20 text-red-400",
      rating: 4.8,
      online: true,
    },
    description: "5000 Dota Plus shards, моментальная передача",
    price: 890,
  },
  {
    id: "dota-i-1",
    gameSlug: "dota-2",
    category: "items",
    seller: {
      nickname: "ArcanaTrader",
      avatarColor: "bg-purple-500/20 text-purple-400",
      rating: 5.0,
      online: true,
    },
    description: "Arcana Phantom Assassin — чистый трейд, без VAC",
    price: 4200,
  },
  {
    id: "dota-i-2",
    gameSlug: "dota-2",
    category: "items",
    seller: {
      nickname: "ImmortalKing",
      avatarColor: "bg-yellow-500/20 text-yellow-400",
      rating: 4.7,
      online: false,
    },
    description: "Immortal Axe для Axe + редкий эффект, gift-обмен",
    price: 1850,
  },
  {
    id: "dota-a-1",
    gameSlug: "dota-2",
    category: "accounts",
    seller: {
      nickname: "AncientFive",
      avatarColor: "bg-teal-500/20 text-teal-400",
      rating: 4.3,
      online: true,
    },
    description: "Аккаунт 8000 MMR, 15000 часов, все герои разблокированы",
    price: 45000,
  },
  {
    id: "dota-b-1",
    gameSlug: "dota-2",
    category: "boost",
    seller: {
      nickname: "RankUpGG",
      avatarColor: "bg-pink-500/20 text-pink-400",
      rating: 4.9,
      online: true,
    },
    description: "Буст с 3000 до 5000 MMR, solo queue, 95% winrate",
    price: 12000,
  },
  {
    id: "dota-b-2",
    gameSlug: "dota-2",
    category: "boost",
    seller: {
      nickname: "CoachPro",
      avatarColor: "bg-lime-500/20 text-lime-400",
      rating: 4.6,
      online: false,
    },
    description: "5 коуч-сессий по 2 часа, разбор реплеев и стратегий",
    price: 5500,
  },

  // Roblox
  {
    id: "roblox-c-1",
    gameSlug: "roblox",
    category: "currency",
    seller: {
      nickname: "RobuxFast",
      avatarColor: "bg-sky-500/20 text-sky-400",
      rating: 4.9,
      online: true,
    },
    description: "1000 робуксов чистыми, моментальная доставка через gift",
    price: 890,
  },
  {
    id: "roblox-c-2",
    gameSlug: "roblox",
    category: "currency",
    seller: {
      nickname: "RBX_Store",
      avatarColor: "bg-blue-500/20 text-blue-400",
      rating: 4.7,
      online: true,
    },
    description: "5000 Robux, без риска бана, проверенный метод",
    price: 4200,
  },
  {
    id: "roblox-c-3",
    gameSlug: "roblox",
    category: "currency",
    seller: {
      nickname: "CheapRobux",
      avatarColor: "bg-indigo-500/20 text-indigo-400",
      rating: 4.2,
      online: false,
    },
    description: "10000 Robux, доставка в течение 1 часа",
    price: 7900,
  },
  {
    id: "roblox-i-1",
    gameSlug: "roblox",
    category: "items",
    seller: {
      nickname: "LimitedTrader",
      avatarColor: "bg-fuchsia-500/20 text-fuchsia-400",
      rating: 4.8,
      online: true,
    },
    description: "Limited UGC Headless — редкий предмет, быстрый трейд",
    price: 15000,
  },
  {
    id: "roblox-a-1",
    gameSlug: "roblox",
    category: "accounts",
    seller: {
      nickname: "AccountHub",
      avatarColor: "bg-emerald-500/20 text-emerald-400",
      rating: 4.5,
      online: false,
    },
    description: "Аккаунт 2018 года, Premium, 50+ limited items",
    price: 25000,
  },
  {
    id: "roblox-b-1",
    gameSlug: "roblox",
    category: "boost",
    seller: {
      nickname: "BloxBoost",
      avatarColor: "bg-orange-500/20 text-orange-400",
      rating: 4.6,
      online: true,
    },
    description: "Прокачка аккаунта в Blox Fruits до Max Level",
    price: 3500,
  },

  // GTA V
  {
    id: "gta-c-1",
    gameSlug: "gta-v",
    category: "currency",
    seller: {
      nickname: "MoneyDrop",
      avatarColor: "bg-green-500/20 text-green-400",
      rating: 4.8,
      online: true,
    },
    description: "50 млн GTA$ на PC, безопасный метод, без бана",
    price: 1200,
  },
  {
    id: "gta-c-2",
    gameSlug: "gta-v",
    category: "currency",
    seller: {
      nickname: "CashKing",
      avatarColor: "bg-lime-500/20 text-lime-400",
      rating: 4.5,
      online: false,
    },
    description: "100 млн GTA$ на PS5, modded session, 24/7",
    price: 2100,
  },
  {
    id: "gta-i-1",
    gameSlug: "gta-v",
    category: "items",
    seller: {
      nickname: "ModGarage",
      avatarColor: "bg-zinc-500/20 text-zinc-300",
      rating: 4.7,
      online: true,
    },
    description: "Modded garage: 20 суперкаров + полный тюнинг",
    price: 4500,
  },
  {
    id: "gta-a-1",
    gameSlug: "gta-v",
    category: "accounts",
    seller: {
      nickname: "Level120",
      avatarColor: "bg-amber-500/20 text-amber-400",
      rating: 4.4,
      online: true,
    },
    description: "Аккаунт lvl 120, все бизнесы, бункер, яхта",
    price: 8900,
  },
  {
    id: "gta-b-1",
    gameSlug: "gta-v",
    category: "boost",
    seller: {
      nickname: "HeistPro",
      avatarColor: "bg-red-500/20 text-red-400",
      rating: 4.9,
      online: true,
    },
    description: "Прохождение Cayo Perico Heist x5, max payout",
    price: 2800,
  },
  {
    id: "gta-b-2",
    gameSlug: "gta-v",
    category: "boost",
    seller: {
      nickname: "RankGrinder",
      avatarColor: "bg-cyan-500/20 text-cyan-400",
      rating: 4.3,
      online: false,
    },
    description: "Прокачка ранга до 120, все unlocks открыты",
    price: 6500,
  },
];

export function getOffersByGameSlug(gameSlug: string): Offer[] {
  return mockOffers.filter((offer) => offer.gameSlug === gameSlug);
}

export function getOnlineSellersCount(offers: Offer[]): number {
  const onlineNicknames = new Set(
    offers.filter((o) => o.seller.online).map((o) => o.seller.nickname)
  );
  return onlineNicknames.size;
}

export type SortOption = "price-asc" | "price-desc" | "default";

export function filterOffers(
  offers: Offer[],
  {
    category,
    search,
    minPrice,
    maxPrice,
    sort,
  }: {
    category: OfferCategory;
    search: string;
    minPrice: string;
    maxPrice: string;
    sort: SortOption;
  }
): Offer[] {
  let result = offers.filter((offer) => offer.category === category);

  const query = search.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (offer) =>
        offer.description.toLowerCase().includes(query) ||
        offer.seller.nickname.toLowerCase().includes(query)
    );
  }

  const min = minPrice ? Number(minPrice) : null;
  const max = maxPrice ? Number(maxPrice) : null;

  if (min !== null && !Number.isNaN(min)) {
    result = result.filter((offer) => offer.price >= min);
  }
  if (max !== null && !Number.isNaN(max)) {
    result = result.filter((offer) => offer.price <= max);
  }

  if (sort === "price-asc") {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    result = [...result].sort((a, b) => b.price - a.price);
  }

  return result;
}
