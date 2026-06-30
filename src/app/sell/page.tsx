import type { Metadata } from "next";

import { CreateOfferGate } from "@/components/offers/create-offer-gate";
import { SellOfferForm } from "@/components/sell/sell-offer-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fetchGames } from "@/lib/games";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Выставить товар — GetBuff.store",
  description: "Создайте новый лот и начните продавать на GetBuff.store",
};

export default async function SellPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const games = await fetchGames();

  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground dark:bg-[#0e1015]">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,140,255,0.08),transparent_55%)]" />
        <div className="relative">
          {user ? <SellOfferForm games={games} /> : <CreateOfferGate />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
