"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase";
import type { OfferCategory } from "@/lib/types/offer";
import { getSellerName } from "@/lib/user";

const VALID_CATEGORIES: OfferCategory[] = [
  "currency",
  "accounts",
  "items",
  "boost",
];

export type CreateOfferState = {
  error?: string;
};

export async function createOffer(
  _prevState: CreateOfferState,
  formData: FormData
): Promise<CreateOfferState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const gameId = formData.get("game_id")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const priceRaw = formData.get("price")?.toString().trim();

  if (!gameId || !category || !description || !priceRaw) {
    return { error: "Заполните все обязательные поля" };
  }

  if (!VALID_CATEGORIES.includes(category as OfferCategory)) {
    return { error: "Некорректная категория" };
  }

  const price = Number(priceRaw);
  if (Number.isNaN(price) || price <= 0) {
    return { error: "Укажите корректную цену" };
  }

  if (description.length < 10) {
    return { error: "Описание должно содержать минимум 10 символов" };
  }

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("slug")
    .eq("id", gameId)
    .maybeSingle();

  if (gameError || !game) {
    return { error: "Игра не найдена" };
  }

  const sellerName = getSellerName(user);

  const { error: insertError } = await supabase.from("offers").insert({
    game_id: gameId,
    seller_name: sellerName,
    description,
    price,
    category,
    is_online: true,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/games/${game.slug}`);
  revalidatePath("/");
  redirect(`/games/${game.slug}`);
}
