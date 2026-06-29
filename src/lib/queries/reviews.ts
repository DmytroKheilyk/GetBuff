import { createClient, createDataClient } from "@/lib/supabase";
import {
  mapDbReview,
  type DbReviewRow,
  type OrderReviewSummary,
  type SellerRatingStats,
} from "@/lib/types/review";

export async function fetchReviewsForOrders(
  orderIds: string[]
): Promise<OrderReviewSummary[]> {
  if (orderIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("order_id, rating")
    .in("order_id", orderIds);

  if (error) {
    console.error("[fetchReviewsForOrders]", error.message);
    return [];
  }

  return (data as { order_id: string; rating: number }[]).map((row) => ({
    orderId: row.order_id,
    rating: row.rating,
  }));
}

export async function fetchSellerRatingStats(
  sellerNames: string[]
): Promise<Map<string, SellerRatingStats>> {
  const uniqueNames = [...new Set(sellerNames.filter(Boolean))];
  const statsMap = new Map<string, SellerRatingStats>();

  if (uniqueNames.length === 0) return statsMap;

  const supabase = createDataClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("seller_name, rating")
    .in("seller_name", uniqueNames);

  if (error) {
    console.error("[fetchSellerRatingStats]", error.message);
    return statsMap;
  }

  const buckets = new Map<string, number[]>();

  for (const row of data as { seller_name: string; rating: number }[]) {
    const list = buckets.get(row.seller_name) ?? [];
    list.push(row.rating);
    buckets.set(row.seller_name, list);
  }

  for (const [sellerName, ratings] of buckets) {
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    statsMap.set(sellerName, {
      sellerName,
      average: sum / ratings.length,
      count: ratings.length,
    });
  }

  return statsMap;
}

export async function fetchReviewByOrderId(
  orderId: string
): Promise<OrderReviewSummary | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error || !data) return null;

  const review = mapDbReview(data as DbReviewRow);
  return { orderId: review.orderId, rating: review.rating };
}
