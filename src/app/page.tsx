import { PopularGamesGrid } from "@/components/home/popular-games-grid";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.08),transparent_50%)]" />
        <div className="container relative mx-auto px-4 py-10 sm:py-16">
          <section className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-emerald-400">
              GetBuff.store
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Маркетплейс{" "}
              <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                игровых ценностей
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              P2P-площадка для безопасной покупки и продажи скинов, предметов
              и внутриигровой валюты. Сделки напрямую между игроками — быстро и
              выгодно.
            </p>
          </section>
          <PopularGamesGrid />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
