import type { SupabaseClient } from "@supabase/supabase-js";

import {
  logWalletSupabaseError,
  mapDbWallet,
  type DbWalletRow,
  type Wallet,
} from "@/lib/types/wallet";

export async function getOrCreateWallet(
  supabase: SupabaseClient,
  userEmail: string
): Promise<Wallet | null> {
  const { data: existing, error: selectError } = await supabase
    .from("wallets")
    .select("user_email, balance")
    .eq("user_email", userEmail)
    .maybeSingle();

  if (selectError) {
    logWalletSupabaseError("getOrCreateWallet:select", selectError);
    return null;
  }

  if (existing) {
    return mapDbWallet(existing as DbWalletRow);
  }

  const { data: created, error: insertError } = await supabase
    .from("wallets")
    .insert({ user_email: userEmail })
    .select("user_email, balance")
    .maybeSingle();

  if (insertError) {
    logWalletSupabaseError("getOrCreateWallet:insert", insertError);

    const { data: retry, error: retryError } = await supabase
      .from("wallets")
      .select("user_email, balance")
      .eq("user_email", userEmail)
      .maybeSingle();

    if (retryError) {
      logWalletSupabaseError("getOrCreateWallet:insert-retry-select", retryError);
      return null;
    }

    if (retry) {
      return mapDbWallet(retry as DbWalletRow);
    }

    return null;
  }

  if (created) {
    return mapDbWallet(created as DbWalletRow);
  }

  const { data: fallback, error: fallbackError } = await supabase
    .from("wallets")
    .select("user_email, balance")
    .eq("user_email", userEmail)
    .maybeSingle();

  if (fallbackError) {
    logWalletSupabaseError("getOrCreateWallet:fallback-select", fallbackError);
    return null;
  }

  if (fallback) {
    return mapDbWallet(fallback as DbWalletRow);
  }

  console.error("[wallet:getOrCreateWallet] insert succeeded but wallet not found", {
    userEmail,
  });
  return null;
}
