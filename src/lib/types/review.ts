export type Review = {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export type OrderReviewSummary = {
  orderId: string;
  rating: number;
};

export type SellerRatingStats = {
  sellerName: string;
  average: number;
  count: number;
};

export type DbReviewRow = {
  id: string;
  order_id: string;
  buyer_name: string;
  seller_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export function mapDbReview(row: DbReviewRow): Review {
  return {
    id: row.id,
    orderId: row.order_id,
    buyerName: row.buyer_name,
    sellerName: row.seller_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export function formatReviewCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return `${count} отзывов`;
  if (mod10 === 1) return `${count} отзыв`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} отзыва`;
  return `${count} отзывов`;
}
