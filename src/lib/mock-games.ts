export type Game = {
  id: string;
  name: string;
  slug: string;
  listingsCount: number;
  gradientFrom: string;
  gradientTo: string;
};

export const popularGames: Game[] = [
  {
    id: "cs2",
    name: "Counter-Strike 2",
    slug: "cs2",
    listingsCount: 1240,
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-900",
  },
  {
    id: "dota-2",
    name: "Dota 2",
    slug: "dota-2",
    listingsCount: 890,
    gradientFrom: "from-red-600",
    gradientTo: "to-rose-950",
  },
  {
    id: "roblox",
    name: "Roblox",
    slug: "roblox",
    listingsCount: 2100,
    gradientFrom: "from-sky-500",
    gradientTo: "to-blue-950",
  },
  {
    id: "gta-v",
    name: "GTA V",
    slug: "gta-v",
    listingsCount: 560,
    gradientFrom: "from-emerald-600",
    gradientTo: "to-green-950",
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return popularGames.find((game) => game.slug === slug);
}
