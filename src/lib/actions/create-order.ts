"use server";

import { revalidatePath } from "next/cache";

import { getOrCreateWallet } from "@/lib/queries/wallet";
import { createClient } from "@/lib/supabase";
import { getSellerName, getWalletUserEmail } from "@/lib/user";

export type CreateOrderResult = {
  success?: boolean;
  error?: string;
  chargedAmount?: number;
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
  const buyerEmail = getWalletUserEmail(user);

  if (!buyerEmail) {
    console.error("[wallet:createOrder] user.email is missing", { userId: user.id });
    return { error: "Email пользователя не найден" };
  }

  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id, price, seller_name, games(slug)")
    .eq("id", offerId)
    .maybeSingle();

  if (offerError || !offer) {
    return { error: "Лот не найден" };
  }

  if (offer.seller_name === buyerName) {
    return { error: "Нельзя купить собственный лот" };
  }

  const price = Number(offer.price);

  const buyerWallet = await getOrCreateWallet(supabase, buyerEmail);

  if (!buyerWallet) {
    return { error: "Не удалось проверить баланс" };
  }

  if (buyerWallet.balance < price) {
    return {
      error: "Недостаточно средств на балансе! Пополните счет.",
    };
  }

  const { error: paymentError } = await supabase.rpc("process_order_payment", {
    p_buyer_name: buyerEmail,
    p_seller_name: offer.seller_name,
    p_amount: price,
  });

  if (paymentError) {
    if (paymentError.message.includes("insufficient_funds")) {
      return {
        error: "Недостаточно средств на балансе! Пополните счет.",
      };
    }
    return { error: paymentError.message };
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

  return { success: true, chargedAmount: price };
}

function extractGameSlug(games: unknown): string | null {
  if (!games) return null;
  if (Array.isArray(games)) {
    return (games[0] as { slug?: string } | undefined)?.slug ?? null;
  }
  return (games as { slug?: string }).slug ?? null;
}
