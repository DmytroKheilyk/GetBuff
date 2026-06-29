"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase";
import { getSellerName } from "@/lib/user";

export type CreateReviewResult = {
  success?: boolean;
  error?: string;
  rating?: number;
};

export async function createReview(
  orderId: string,
  rating: number,
  comment: string
): Promise<CreateReviewResult> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Выберите оценку от 1 до 5 звёзд" };
  }

  const trimmedComment = comment.trim();
  if (!trimmedComment) {
    return { error: "Напишите комментарий к отзыву" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const buyerName = getSellerName(user);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      buyer_name,
      offers ( seller_name, games ( slug ) )
    `
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return { error: "Заказ не найден" };
  }

  if (order.buyer_name !== buyerName) {
    return { error: "Оставить отзыв может только покупатель" };
  }

  if (order.status !== "completed") {
    return { error: "Отзыв можно оставить только после выполнения заказа" };
  }

  const offer = resolveOffer(order.offers);
  if (!offer) {
    return { error: "Не удалось определить продавца" };
  }

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existing) {
    return { error: "Отзыв по этому заказу уже оставлен" };
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    order_id: orderId,
    buyer_name: buyerName,
    seller_name: offer.seller_name,
    rating,
    comment: trimmedComment,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  const gameSlug = resolveGameSlug(offer.games);
  if (gameSlug) {
    revalidatePath(`/games/${gameSlug}`);
  }
  revalidatePath("/profile");

  return { success: true, rating };
}

function resolveOffer(
  offers: unknown
): { seller_name: string; games: unknown } | null {
  if (!offers) return null;
  if (Array.isArray(offers)) return offers[0] ?? null;
  return offers as { seller_name: string; games: unknown };
}

function resolveGameSlug(games: unknown): string | null {
  if (!games) return null;
  if (Array.isArray(games)) {
    return (games[0] as { slug?: string } | undefined)?.slug ?? null;
  }
  return (games as { slug?: string }).slug ?? null;
}
