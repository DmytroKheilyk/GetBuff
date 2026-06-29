import type { Metadata } from "next";

import { MyOffersList } from "@/components/profile/my-offers-list";
import { ProfileGate } from "@/components/profile/profile-gate";
import { UserInfoCard } from "@/components/profile/user-info-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fetchProfileOffers } from "@/lib/queries/profile-offers";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Личный кабинет — GetBuff.store",
  description: "Управляйте своими лотами на GetBuff.store",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const offers = user ? await fetchProfileOffers(user) : [];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.1),transparent_55%)]" />

        {user ? (
          <div className="container relative mx-auto space-y-6 px-4 py-10 sm:space-y-8 sm:py-14">
            <UserInfoCard user={user} />
            <MyOffersList initialOffers={offers} />
          </div>
        ) : (
          <ProfileGate />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
