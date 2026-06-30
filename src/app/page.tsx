import { Suspense } from "react";

import { HomePageContent } from "@/components/home/home-page-content";
import { HomePageSkeleton } from "@/components/home/home-page-skeleton";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fetchGames } from "@/lib/games";

export const dynamic = "force-dynamic";

async function HomeData({ initialSearch }: { initialSearch: string }) {
  const games = await fetchGames();

  return <HomePageContent games={games} initialSearch={initialSearch} />;
}

type HomePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const initialSearch = q?.trim() ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <Suspense fallback={<HomePageSkeleton />}>
            <HomeData initialSearch={initialSearch} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
