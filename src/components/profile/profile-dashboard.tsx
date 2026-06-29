"use client";

import { MyOffersList } from "@/components/profile/my-offers-list";
import { MyPurchasesList } from "@/components/profile/my-purchases-list";
import { MySalesList } from "@/components/profile/my-sales-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProfileOffer } from "@/lib/queries/profile-offers";
import type { Order } from "@/lib/types/order";

type ProfileDashboardProps = {
  offers: ProfileOffer[];
  purchases: Order[];
  sales: Order[];
};

export function ProfileDashboard({
  offers,
  purchases,
  sales,
}: ProfileDashboardProps) {
  return (
    <Tabs defaultValue="listings" className="gap-6">
      <TabsList className="glass-panel h-auto w-full flex-wrap justify-start gap-1 p-1">
        <TabsTrigger
          value="listings"
          className="font-semibold text-zinc-400 transition-all duration-300 data-active:border-green-500/30 data-active:bg-green-500/15 data-active:text-green-400 data-active:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
        >
          Мои лоты
          {offers.length > 0 && (
            <span className="ml-1.5 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] text-green-400">
              {offers.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="purchases"
          className="font-semibold text-zinc-400 transition-all duration-300 data-active:border-green-500/30 data-active:bg-green-500/15 data-active:text-green-400 data-active:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
        >
          Мои покупки
          {purchases.length > 0 && (
            <span className="ml-1.5 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] text-green-400">
              {purchases.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="sales"
          className="font-semibold text-zinc-400 transition-all duration-300 data-active:border-green-500/30 data-active:bg-green-500/15 data-active:text-green-400 data-active:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
        >
          Мои продажи
          {sales.length > 0 && (
            <span className="ml-1.5 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] text-green-400">
              {sales.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="listings" className="animate-in fade-in duration-300">
        <MyOffersList initialOffers={offers} />
      </TabsContent>
      <TabsContent value="purchases" className="animate-in fade-in duration-300">
        <MyPurchasesList orders={purchases} />
      </TabsContent>
      <TabsContent value="sales" className="animate-in fade-in duration-300">
        <MySalesList initialOrders={sales} />
      </TabsContent>
    </Tabs>
  );
}
