export type Game = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  platform: string | null;
  listingsCount: number;
  gradientFrom: string;
  gradientTo: string;
};

export type DbGameRow = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  platform: string | null;
  offers?: { count: number }[];
};

const GRADIENT_BY_SLUG: Record<string, { from: string; to: string }> = {
  cs2: { from: "from-orange-600", to: "to-amber-900" },
  "dota-2": { from: "from-red-600", to: "to-rose-950" },
  roblox: { from: "from-sky-500", to: "to-blue-950" },
  "gta-v": { from: "from-emerald-600", to: "to-green-950" },
};

const DEFAULT_GRADIENT = {
  from: "from-zinc-700",
  to: "to-zinc-950",
};

export function getGameGradients(slug: string): {
  gradientFrom: string;
  gradientTo: string;
} {
  const gradient = GRADIENT_BY_SLUG[slug] ?? DEFAULT_GRADIENT;
  return { gradientFrom: gradient.from, gradientTo: gradient.to };
}

export function mapDbGame(row: DbGameRow): Game {
  const listingsCount = row.offers?.[0]?.count ?? 0;
  const { gradientFrom, gradientTo } = getGameGradients(row.slug);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    imageUrl: row.image_url,
    platform: row.platform,
    listingsCount,
    gradientFrom,
    gradientTo,
  };
}
