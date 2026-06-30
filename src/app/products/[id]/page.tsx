import { notFound } from "next/navigation";

import { ProductPageView } from "@/components/products/product-page-view";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  fetchProductOfferById,
  fetchUserOrderIdForOffer,
} from "@/lib/queries/product-offer";
import { createClient } from "@/lib/supabase";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const offer = await fetchProductOfferById(id);

  if (!offer) {
    return { title: "Товар не найден — GetBuff.store" };
  }

  return {
    title: `${offer.description} — GetBuff.store`,
    description: `Купить ${offer.description} для ${offer.gameTitle} на GetBuff.store`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const offer = await fetchProductOfferById(id);

  if (!offer) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const existingOrderId = user
    ? await fetchUserOrderIdForOffer(user, offer.id)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <ProductPageView offer={offer} existingOrderId={existingOrderId} />
      </main>
      <SiteFooter />
    </div>
  );
}
