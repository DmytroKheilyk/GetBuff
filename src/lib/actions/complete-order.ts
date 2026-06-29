"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase";
import { getSellerName } from "@/lib/user";

export type CompleteOrderResult = {
  success?: boolean;
  error?: string;
};

export async function completeOrder(
  orderId: string
): Promise<CompleteOrderResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const sellerName = getSellerName(user);

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      offers!inner ( seller_name, games ( slug ) )
    `
    )
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    return { error: "Заказ не найден" };
  }

  const offer = resolveOffer(order.offers);
  if (!offer || offer.seller_name !== sellerName) {
    return { error: "Нет доступа к этому заказу" };
  }

  if (order.status === "completed") {
    return { error: "Заказ уже выполнен" };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "completed" })
    .eq("id", orderId);

  if (updateError) {
    return { error: updateError.message };
  }

  const gameSlug = resolveGameSlug(offer.games);
  if (gameSlug) {
    revalidatePath(`/games/${gameSlug}`);
  }
  revalidatePath("/profile");

  return { success: true };
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
