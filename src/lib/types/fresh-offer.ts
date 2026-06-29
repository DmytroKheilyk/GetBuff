export type FreshOffer = {
  id: string;
  description: string;
  price: number;
  sellerName: string;
  reviewAverage: number | null;
  reviewCount: number;
  gameTitle: string;
  gameSlug: string;
  gameImageUrl: string | null;
  createdAt: string;
};
