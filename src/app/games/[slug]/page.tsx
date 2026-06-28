import { notFound } from "next/navigation";

import { GameCatalog } from "@/components/games/game-catalog";
import { GameHero } from "@/components/games/game-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fetchGameBySlug, fetchGameSlugs } from "@/lib/games";
import { fetchOffersByGameId } from "@/lib/queries/offers";
import { getOnlineSellersCount } from "@/lib/offers";

type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await fetchGameSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await fetchGameBySlug(slug);

  if (!game) {
    return { title: "Игра не найдена — GetBuff.store" };
  }

  return {
    title: `${game.title} — каталог лотов | GetBuff.store`,
    description: `Покупайте и продавайте предметы, валюту и услуги для ${game.title} на GetBuff.store`,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await fetchGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const offers = await fetchOffersByGameId(game.id, game.slug);
  const onlineSellers = getOnlineSellersCount(offers);

  return (
    <div className="flex min-h-screen flex-col bg-black">
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
