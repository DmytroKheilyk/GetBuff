import { Badge } from "@/components/ui/badge";
import { ProductBreadcrumbs } from "@/components/products/product-breadcrumbs";
import { ProductDetailsTabs } from "@/components/products/product-details-tabs";
import {
  ProductPurchaseBar,
  ProductPurchaseCard,
} from "@/components/products/product-purchase-card";
import { ProductSellerCard } from "@/components/products/product-seller-card";
import { getCategoryDisplayLabel } from "@/lib/types/offer";
import type { ProductOffer } from "@/lib/types/product-offer";

type ProductPageViewProps = {
  offer: ProductOffer;
  existingOrderId: string | null;
};

export function ProductPageView({
  offer,
  existingOrderId,
}: ProductPageViewProps) {
  const categoryLabel = getCategoryDisplayLabel(offer.categoryRaw);

  return (
    <>
      <div className="container mx-auto px-4 py-6 pb-28 lg:pb-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <ProductBreadcrumbs
              gameTitle={offer.gameTitle}
              gameSlug={offer.gameSlug}
              categoryLabel={categoryLabel}
            />

            <div className="space-y-4">
              <h1 className="text-2xl font-extrabold leading-tight text-[#e8eaef] sm:text-3xl">
                {offer.description}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-lg border-border bg-[#1c1e27] px-3 py-1 text-xs font-semibold text-[#e8eaef]"
                >
                  {offer.gameTitle}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-lg border-border bg-[#1c1e27] px-3 py-1 text-xs font-semibold text-[#e8eaef]"
                >
                  {categoryLabel}
                </Badge>
                <Badge className="rounded-lg border-0 bg-[#22c55e]/15 px-3 py-1 text-xs font-semibold text-[#22c55e] hover:bg-[#22c55e]/15">
                  {offer.deliveryLabel}
                </Badge>
              </div>
            </div>

            <ProductSellerCard offer={offer} />
            <ProductDetailsTabs offer={offer} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <ProductPurchaseCard
                offer={offer}
                existingOrderId={existingOrderId}
              />
            </div>
          </aside>
        </div>
      </div>

      <div className="lg:hidden">
        <ProductPurchaseBar
          offer={offer}
          existingOrderId={existingOrderId}
        />
      </div>
    </>
  );
}
