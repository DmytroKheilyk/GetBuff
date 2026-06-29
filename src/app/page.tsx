import { Suspense } from "react";

import { HomePageContent } from "@/components/home/home-page-content";
import { HomePageSkeleton } from "@/components/home/home-page-skeleton";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fetchGames } from "@/lib/games";
import { fetchLatestOffers } from "@/lib/queries/fresh-offers";

export const dynamic = "force-dynamic";

async function HomeData() {
  const [games, freshOffers] = await Promise.all([
    fetchGames(),
    fetchLatestOffers(8),
  ]);

  return <HomePageContent games={games} freshOffers={freshOffers} />;
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_55%)]" />
        <div className="pointer-events-none absolute top-1/4 -left-32 size-64 rounded-full bg-green-500/5 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-32 size-64 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="container relative mx-auto px-4 py-10 sm:py-16">
          <Suspense fallback={<HomePageSkeleton />}>
            <HomeData />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
