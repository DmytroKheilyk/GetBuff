"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase";
import { getSellerName } from "@/lib/user";

export type ManageOfferResult = {
  success?: boolean;
  error?: string;
};

function extractGameSlug(games: unknown): string | null {
  if (!games) return null;
  if (Array.isArray(games)) {
    const first = games[0] as { slug?: string } | undefined;
    return first?.slug ?? null;
  }
  return (games as { slug?: string }).slug ?? null;
}

async function assertOwnOffer(
  offerId: string
): Promise<
  | { error: string }
  | { supabase: Awaited<ReturnType<typeof createClient>>; sellerName: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const sellerName = getSellerName(user);

  const { data: offer, error } = await supabase
    .from("offers")
    .select("id, seller_name")
    .eq("id", offerId)
    .maybeSingle();

  if (error || !offer) {
    return { error: "Лот не найден" };
  }

  if (offer.seller_name !== sellerName) {
    return { error: "Нет доступа к этому лоту" };
  }

  return { supabase, sellerName };
}

export async function deleteOffer(offerId: string): Promise<ManageOfferResult> {
  const ctx = await assertOwnOffer(offerId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase, sellerName } = ctx;

  const { data: offer } = await supabase
    .from("offers")
    .select("games(slug)")
    .eq("id", offerId)
    .single();

  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", offerId)
    .eq("seller_name", sellerName);

  if (error) {
    return { error: error.message };
  }

  const gameSlug = extractGameSlug(offer?.games);
  if (gameSlug) {
    revalidatePath(`/games/${gameSlug}`);
  }
  revalidatePath("/profile");

  return { success: true };
}

export async function updateOfferPrice(
  offerId: string,
  newPrice: number
): Promise<ManageOfferResult> {
  if (Number.isNaN(newPrice) || newPrice <= 0) {
    return { error: "Укажите корректную цену" };
  }

  const ctx = await assertOwnOffer(offerId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase, sellerName } = ctx;

  const { data: offer } = await supabase
    .from("offers")
    .select("games(slug)")
    .eq("id", offerId)
    .single();

  const { error } = await supabase
    .from("offers")
    .update({ price: newPrice })
    .eq("id", offerId)
    .eq("seller_name", sellerName);

  if (error) {
    return { error: error.message };
  }

  const gameSlug = extractGameSlug(offer?.games);
  if (gameSlug) {
    revalidatePath(`/games/${gameSlug}`);
  }
  revalidatePath("/profile");

  return { success: true };
}
