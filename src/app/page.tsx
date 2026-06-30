import { Suspense } from "react";

import { HomePageContent } from "@/components/home/home-page-content";
import { HomePageSkeleton } from "@/components/home/home-page-skeleton";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { mockProducts, USE_MOCK_DATA } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const initialSearch = q?.trim() ?? "";
  const products = USE_MOCK_DATA ? mockProducts : [];

  return (
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-[#181a21] dark:text-white">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <Suspense fallback={<HomePageSkeleton />}>
            <HomePageContent
              initialSearch={initialSearch}
              products={products}
            />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
