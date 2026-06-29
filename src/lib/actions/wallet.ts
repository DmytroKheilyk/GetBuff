"use server";

import { revalidatePath } from "next/cache";

import { getOrCreateWallet } from "@/lib/queries/wallet";
import { createClient } from "@/lib/supabase";
import {
  logWalletSupabaseError,
  WALLET_TOP_UP_AMOUNT,
} from "@/lib/types/wallet";
import { getWalletUserEmail } from "@/lib/user";

export type WalletActionResult = {
  success?: boolean;
  error?: string;
  balance?: number;
};

export async function fetchWalletBalance(): Promise<WalletActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const userEmail = getWalletUserEmail(user);
  if (!userEmail) {
    console.error("[wallet:fetchWalletBalance] user.email is missing", { userId: user.id });
    return { error: "Email пользователя не найден" };
  }

  const wallet = await getOrCreateWallet(supabase, userEmail);

  if (!wallet) {
    return { error: "Не удалось загрузить кошелёк" };
  }

  return { success: true, balance: wallet.balance };
}

export async function topUpWallet(): Promise<WalletActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const userEmail = getWalletUserEmail(user);
  if (!userEmail) {
    console.error("[wallet:topUpWallet] user.email is missing", { userId: user.id });
    return { error: "Email пользователя не найден" };
  }

  const wallet = await getOrCreateWallet(supabase, userEmail);

  if (!wallet) {
    return { error: "Не удалось загрузить кошелёк" };
  }

  const newBalance = wallet.balance + WALLET_TOP_UP_AMOUNT;

  const { error: updateError } = await supabase
    .from("wallets")
    .update({ balance: newBalance })
    .eq("user_email", userEmail);

  if (updateError) {
    logWalletSupabaseError("topUpWallet:update", updateError);
    return { error: updateError.message };
  }

  revalidatePath("/profile");

  return { success: true, balance: newBalance };
}
