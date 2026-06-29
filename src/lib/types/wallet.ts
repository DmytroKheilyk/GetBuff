export type Wallet = {
  userEmail: string;
  balance: number;
};

export type DbWalletRow = {
  user_email: string;
  balance: number;
};

export function mapDbWallet(row: DbWalletRow): Wallet {
  return {
    userEmail: row.user_email,
    balance: Number(row.balance),
  };
}

export function formatWalletBalance(balance: number): string {
  return `${balance.toLocaleString("ru-RU")} ₽`;
}

export const WALLET_TOP_UP_AMOUNT = 1000;

export const WALLET_CHANGED_EVENT = "getbuff:wallet-changed";

export function notifyWalletChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(WALLET_CHANGED_EVENT));
  }
}

export function logWalletSupabaseError(
  context: string,
  error: { message?: string; code?: string; details?: string; hint?: string } | null
): void {
  console.error(`[wallet:${context}]`, {
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
  });
}
