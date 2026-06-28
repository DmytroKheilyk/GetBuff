import { PopularGamesGrid } from "@/components/home/popular-games-grid";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_55%)]" />
        <div className="pointer-events-none absolute top-1/4 -left-32 size-64 rounded-full bg-green-500/5 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-32 size-64 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="container relative mx-auto px-4 py-10 sm:py-16">
          <section className="mb-14 max-w-3xl">
            <p className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
              P2P · Без посредников · Мгновенно
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              <span className="text-white">МАРКЕТПЛЕЙС </span>
              <span className="text-neon-gradient">ИГРОВЫХ</span>
              <br />
              <span className="text-neon-gradient drop-shadow-[0_0_30px_rgba(34,197,94,0.25)]">
                ЦЕННОСТЕЙ
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Покупай и продавай скины, валюту и аккаунты напрямую. GetBuff —
              премиальный хаб для геймеров, которые знают цену своему луту.
            </p>
          </section>
          <PopularGamesGrid />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
