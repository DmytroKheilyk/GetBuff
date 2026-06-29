import type { Metadata } from "next";

import { CreateOfferForm } from "@/components/offers/create-offer-form";
import { CreateOfferGate } from "@/components/offers/create-offer-gate";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fetchGames } from "@/lib/games";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Создать лот — GetBuff.store",
  description: "Добавьте новый товар в каталог GetBuff.store",
};

export default async function CreateOfferPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const games = await fetchGames();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.1),transparent_55%)]" />
        <div className="relative">
          {user ? (
            <CreateOfferForm games={games} />
          ) : (
            <CreateOfferGate />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
