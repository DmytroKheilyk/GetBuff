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
  /** Сырое значение category из БД */
  categoryRaw: string;
  /** Нормализованный ключ для фильтров (null если не распознан) */
  categoryKey: OfferCategory | null;
  seller: Seller;
  description: string;
  price: number;
};

export type DbOfferRow = {
  id: string;
  game_id: string;
  seller_name: string;
  seller_avatar: string | null;
  seller_rating: number;
  is_online: boolean;
  description: string;
  price: number;
  category: string;
  created_at: string;
};

export type SortOption = "price-asc" | "price-desc" | "default";

const CATEGORY_ALIASES: Record<string, OfferCategory> = {
  currency: "currency",
  валюта: "currency",
  accounts: "accounts",
  аккаунты: "accounts",
  аккаунт: "accounts",
  items: "items",
  предметы: "items",
  предмет: "items",
  boost: "boost",
  буст: "boost",
  услуги: "boost",
  "буст / услуги": "boost",
  "буст/услуги": "boost",
};

export function normalizeCategory(raw: string): OfferCategory | null {
  const key = raw.trim().toLowerCase();
  return CATEGORY_ALIASES[key] ?? null;
}

export function matchesCategory(
  rawCategory: string,
  filter: OfferCategory
): boolean {
  const normalized = normalizeCategory(rawCategory);
  if (normalized === filter) return true;
  return rawCategory.trim().toLowerCase() === filter;
}

export function getCategoryDisplayLabel(raw: string): string {
  const normalized = normalizeCategory(raw);
  if (normalized) {
    return (
      OFFER_CATEGORIES.find((c) => c.id === normalized)?.label ?? raw
    );
  }
  return raw;
}

const AVATAR_COLORS = [
  "bg-orange-500/20 text-orange-400",
  "bg-sky-500/20 text-sky-400",
  "bg-violet-500/20 text-violet-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-rose-500/20 text-rose-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-amber-500/20 text-amber-400",
  "bg-fuchsia-500/20 text-fuchsia-400",
];

function resolveAvatarColor(nickname: string, stored: string | null): string {
  if (stored) return stored;
  const index =
    nickname.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[index]!;
}

export function mapDbOffer(row: DbOfferRow, gameSlug: string): Offer {
  return {
    id: row.id,
    gameSlug,
    categoryRaw: row.category,
    categoryKey: normalizeCategory(row.category),
    seller: {
      nickname: row.seller_name,
      avatarColor: resolveAvatarColor(row.seller_name, row.seller_avatar),
      rating: Number(row.seller_rating),
      online: row.is_online,
    },
    description: row.description,
    price: Number(row.price),
  };
}

export function getOnlineSellersCount(offers: Offer[]): number {
  const onlineNicknames = new Set(
    offers.filter((o) => o.seller.online).map((o) => o.seller.nickname)
  );
  return onlineNicknames.size;
}

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
  let result = offers.filter((offer) =>
    matchesCategory(offer.categoryRaw, category)
  );

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
