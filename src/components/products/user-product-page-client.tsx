"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { ProductPageView } from "@/components/products/product-page-view";
import { mockProductToProductOffer } from "@/lib/mock-data";
import {
  getUserMockProductById,
  isUserMockProductId,
} from "@/lib/mock-offers-storage";
import type { ProductOffer } from "@/lib/types/product-offer";

type UserProductPageClientProps = {
  productId: string;
};

export function UserProductPageClient({
  productId,
}: UserProductPageClientProps) {
  const [offer, setOffer] = useState<ProductOffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserMockProductId(productId)) {
      setLoading(false);
      return;
    }

    const product = getUserMockProductById(productId);
    setOffer(product ? mockProductToProductOffer(product) : null);
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">Товар не найден</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Лот мог быть удалён или ещё не синхронизирован с этим устройством.
        </p>
      </div>
    );
  }

  return <ProductPageView offer={offer} existingOrderId={null} />;
}
