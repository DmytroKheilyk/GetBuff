import { notifyWalletChanged } from "@/lib/types/wallet";

const MOCK_WALLET_PREFIX = "getbuff_mock_wallet";

export function getMockWalletStorageKey(userEmail: string): string {
  return `${MOCK_WALLET_PREFIX}_${userEmail}`;
}

export function getMockWalletBalance(userEmail: string): number | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(getMockWalletStorageKey(userEmail));
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function setMockWalletBalance(userEmail: string, balance: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getMockWalletStorageKey(userEmail), String(balance));
  notifyWalletChanged();
}
