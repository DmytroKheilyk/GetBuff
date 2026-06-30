"use client";

import { MyOffersList } from "@/components/profile/my-offers-list";
import { MyPurchasesList } from "@/components/profile/my-purchases-list";
import { MySalesList } from "@/components/profile/my-sales-list";
import { ProfileSecuritySettings } from "@/components/profile/profile-security-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProfileOffer } from "@/lib/queries/profile-offers";
import type { Order } from "@/lib/types/order";
import type { OrderReviewSummary } from "@/lib/types/review";
import { cn } from "@/lib/utils";

type ProfileDashboardProps = {
  offers: ProfileOffer[];
  purchases: Order[];
  purchaseReviews: OrderReviewSummary[];
  sales: Order[];
};

function TabCountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "ml-1.5 inline-flex size-5 items-center justify-center rounded-full",
        "bg-neutral-200 text-[10px] font-semibold text-neutral-600",
        "dark:bg-primary/15 dark:text-primary"
      )}
    >
      {count}
    </span>
  );
}

export function ProfileDashboard({
  offers,
  purchases,
  purchaseReviews,
  sales,
}: ProfileDashboardProps) {
  return (
    <Tabs defaultValue="listings" className="gap-6">
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-0 border-b border-neutral-200 bg-transparent p-0 dark:border-neutral-800"
      >
        <TabsTrigger
          value="listings"
          className="rounded-none px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground data-active:text-neutral-900 dark:data-active:text-white"
        >
          Мои лоты
          <TabCountBadge count={offers.length} />
        </TabsTrigger>
        <TabsTrigger
          value="purchases"
          className="rounded-none px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground data-active:text-neutral-900 dark:data-active:text-white"
        >
          Мои покупки
          <TabCountBadge count={purchases.length} />
        </TabsTrigger>
        <TabsTrigger
          value="sales"
          className="rounded-none px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground data-active:text-neutral-900 dark:data-active:text-white"
        >
          Мои продажи
          <TabCountBadge count={sales.length} />
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="rounded-none px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground data-active:text-neutral-900 dark:data-active:text-white"
        >
          Настройки и безопасность
        </TabsTrigger>
      </TabsList>

      <TabsContent value="listings" className="animate-in fade-in duration-300">
        <MyOffersList initialOffers={offers} />
      </TabsContent>
      <TabsContent value="purchases" className="animate-in fade-in duration-300">
        <MyPurchasesList
          orders={purchases}
          initialReviews={purchaseReviews}
        />
      </TabsContent>
      <TabsContent value="sales" className="animate-in fade-in duration-300">
        <MySalesList initialOrders={sales} />
      </TabsContent>
      <TabsContent value="settings" className="animate-in fade-in duration-300">
        <ProfileSecuritySettings />
      </TabsContent>
    </Tabs>
  );
}
