"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase";
import { getSellerName } from "@/lib/user";

const VALID_CATEGORIES = [
  "currency",
  "accounts",
  "items",
  "boost",
  "keys",
  "subscriptions",
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
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const instantDelivery = formData.get("instant_delivery") === "true";
  const priceRaw = formData.get("price")?.toString().trim();

  if (!gameId || !category || !priceRaw) {
    return { error: "Заполните все обязательные поля" };
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return { error: "Некорректная категория" };
  }

  let fullDescription = "";

  if (title) {
    fullDescription = title;
    if (instantDelivery && !title.toLowerCase().includes("момент")) {
      fullDescription += " | Моментальная доставка";
    }
    if (description) {
      fullDescription += `\n\n${description}`;
    }
  } else if (description) {
    fullDescription = description;
    if (instantDelivery && !fullDescription.toLowerCase().includes("момент")) {
      fullDescription += " | Моментальная доставка";
    }
  } else {
    return { error: "Заполните название или описание лота" };
  }

  if (fullDescription.length < 10) {
    return { error: "Описание должно содержать минимум 10 символов" };
  }

  const price = Number(priceRaw);
  if (Number.isNaN(price) || price <= 0) {
    return { error: "Укажите корректную цену" };
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

  const { data: inserted, error: insertError } = await supabase
    .from("offers")
    .insert({
      game_id: gameId,
      seller_name: sellerName,
      description: fullDescription,
      price,
      category,
      is_online: true,
    })
    .select("id")
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/games/${game.slug}`);
  revalidatePath("/");
  revalidatePath("/profile");

  const redirectTarget = formData.get("redirect_to")?.toString();
  if (redirectTarget === "product" && inserted?.id) {
    revalidatePath(`/products/${inserted.id}`);
    redirect(`/products/${inserted.id}`);
  }

  redirect(`/games/${game.slug}`);
}
