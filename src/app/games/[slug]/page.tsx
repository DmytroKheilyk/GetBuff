import { notFound } from "next/navigation";

import { GameCatalogPage } from "@/components/games/game-catalog-page";
import { GamePageBreadcrumbs } from "@/components/games/game-page-breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCatalogGameTitle } from "@/lib/game-slug";
import { resolveGameForCatalog, fetchAllGamePageSlugs } from "@/lib/queries/game-page";
import { fetchOffersByGameId } from "@/lib/queries/offers";

type GamePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ seller?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await fetchAllGamePageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await resolveGameForCatalog(slug);

  if (!game) {
    return { title: "Каталог не найден — GetBuff.store" };
  }

  return {
    title: `${game.title} — каталог лотов | GetBuff.store`,
    description: `Покупайте и продавайте товары для ${game.title} на GetBuff.store`,
  };
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const { slug } = await params;
  const { seller } = await searchParams;
  const game = await resolveGameForCatalog(slug);

  if (!game) {
    notFound();
  }

  const offers = game.id
    ? await fetchOffersByGameId(game.id, game.slug)
    : [];

  const gameTitle = getCatalogGameTitle(slug);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0e1015]">
      <SiteHeader />
      <main className="container mx-auto flex-1 px-4 py-8">
        <GamePageBreadcrumbs gameTitle={gameTitle} />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            {gameTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {offers.length > 0
              ? `${offers.length.toLocaleString("ru-RU")} активных объявлений`
              : "Каталог готов — добавьте первый лот"}
          </p>
        </div>

        <GameCatalogPage
          gameTitle={gameTitle}
          gameSlug={slug}
          offers={offers}
          initialSeller={seller ?? ""}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
