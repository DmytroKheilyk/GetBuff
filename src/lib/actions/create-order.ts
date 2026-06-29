"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase";
import { getSellerName } from "@/lib/user";

export type CreateOrderResult = {
  success?: boolean;
  error?: string;
};

export async function createOrder(offerId: string): Promise<CreateOrderResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const buyerName = getSellerName(user);

  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id, seller_name, games(slug)")
    .eq("id", offerId)
    .maybeSingle();

  if (offerError || !offer) {
    return { error: "Лот не найден" };
  }

  if (offer.seller_name === buyerName) {
    return { error: "Нельзя купить собственный лот" };
  }

  const { error: insertError } = await supabase.from("orders").insert({
    offer_id: offerId,
    buyer_name: buyerName,
    status: "pending",
  });

  if (insertError) {
    return { error: insertError.message };
  }

  const gameSlug = extractGameSlug(offer.games);
  if (gameSlug) {
    revalidatePath(`/games/${gameSlug}`);
  }
  revalidatePath("/profile");

  return { success: true };
}

function extractGameSlug(games: unknown): string | null {
  if (!games) return null;
  if (Array.isArray(games)) {
    return (games[0] as { slug?: string } | undefined)?.slug ?? null;
  }
  return (games as { slug?: string }).slug ?? null;
}
