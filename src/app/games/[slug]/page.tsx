import { notFound } from "next/navigation";

import { GameCatalog } from "@/components/games/game-catalog";
import { GameHero } from "@/components/games/game-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getGameBySlug, popularGames } from "@/lib/mock-games";
import {
  getOffersByGameSlug,
  getOnlineSellersCount,
} from "@/lib/mock-offers";

type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return popularGames.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return { title: "Игра не найдена — GetBuff.store" };
  }

  return {
    title: `${game.name} — каталог лотов | GetBuff.store`,
    description: `Покупайте и продавайте предметы, валюту и услуги для ${game.name} на GetBuff.store`,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const offers = getOffersByGameSlug(slug);
  const onlineSellers = getOnlineSellersCount(offers);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <GameHero
        game={game}
        onlineSellers={onlineSellers}
        totalProducts={offers.length}
      />
      <main className="container mx-auto flex-1 px-4 py-8">
        <GameCatalog offers={offers} />
      </main>
      <SiteFooter />
    </div>
  );
}
