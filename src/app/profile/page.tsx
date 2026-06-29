import type { Metadata } from "next";

import { ProfileDashboard } from "@/components/profile/profile-dashboard";
import { ProfileGate } from "@/components/profile/profile-gate";
import { UserInfoCard } from "@/components/profile/user-info-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fetchMyPurchases, fetchMySales } from "@/lib/queries/orders";
import { fetchProfileOffers } from "@/lib/queries/profile-offers";
import { fetchReviewsForOrders } from "@/lib/queries/reviews";
import { getOrCreateWallet } from "@/lib/queries/wallet";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Личный кабинет — GetBuff.store",
  description: "Управляйте лотами, покупками и продажами на GetBuff.store",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let offers: Awaited<ReturnType<typeof fetchProfileOffers>> = [];
  let purchases: Awaited<ReturnType<typeof fetchMyPurchases>> = [];
  let sales: Awaited<ReturnType<typeof fetchMySales>> = [];
  let purchaseReviews: Awaited<ReturnType<typeof fetchReviewsForOrders>> = [];
  let walletBalance = 0;

  if (user) {
    [offers, purchases, sales] = await Promise.all([
      fetchProfileOffers(user),
      fetchMyPurchases(user),
      fetchMySales(user),
    ]);
    purchaseReviews = await fetchReviewsForOrders(
      purchases.map((order) => order.id)
    );

    if (user.email) {
      const wallet = await getOrCreateWallet(supabase, user.email);
      walletBalance = wallet?.balance ?? 0;
    } else {
      console.error("[wallet:profile] user.email is missing", { userId: user.id });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.1),transparent_55%)]" />

        {user ? (
          <div className="container relative mx-auto space-y-6 px-4 py-10 sm:space-y-8 sm:py-14">
            <UserInfoCard user={user} balance={walletBalance} />
            <ProfileDashboard
              offers={offers}
              purchases={purchases}
              purchaseReviews={purchaseReviews}
              sales={sales}
            />
          </div>
        ) : (
          <ProfileGate />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
