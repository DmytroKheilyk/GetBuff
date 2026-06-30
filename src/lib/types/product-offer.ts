import type { Offer } from "@/lib/types/offer";
import { getCategoryDisplayLabel } from "@/lib/types/offer";

export type ProductOffer = Offer & {
  gameTitle: string;
  createdAt: string;
  completedDealsCount: number;
  deliveryLabel: string;
  /** Полное описание для вкладки (если description — заголовок лота) */
  detailsDescription?: string;
  /** Кастомная инструкция «Как получить» */
  instructionsText?: string;
};

export function formatDealsCount(count: number): string {
  const formatted = count.toLocaleString("ru-RU");
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return `${formatted} сделок`;
  if (mod10 === 1) return `${formatted} сделка`;
  if (mod10 >= 2 && mod10 <= 4) return `${formatted} сделки`;
  return `${formatted} сделок`;
}

export function resolveDeliveryLabel(description: string, categoryRaw: string): string {
  const text = `${description} ${categoryRaw}`.toLowerCase();
  if (text.includes("момент") || text.includes("instant")) return "Моментально";
  if (text.includes("24") || text.includes("сут")) return "До 24 часов";
  return "Быстро";
}

export function buildHowToReceiveContent(offer: ProductOffer): string {
  const category = getCategoryDisplayLabel(offer.categoryRaw).toLowerCase();

  if (category.includes("валют")) {
    return [
      "1. Укажите игровой никнейм или логин в поле при покупке.",
      "2. Оплатите заказ — средства замораживаются на GetBuff до получения товара.",
      "3. Продавец свяжется с вами в чате и передаст валюту удобным способом.",
      "4. Проверьте поступление в игре и подтвердите выполнение заказа.",
    ].join("\n");
  }

  if (category.includes("аккаунт")) {
    return [
      "1. После оплаты откройте чат с продавцом.",
      "2. Получите данные аккаунта в защищённом формате.",
      "3. Смените пароль и привязки сразу после входа.",
      "4. Подтвердите получение, когда всё работает.",
    ].join("\n");
  }

  return [
    "1. Оформите покупку и дождитесь сообщения продавца в чате.",
    "2. Следуйте инструкциям продавца в переписке.",
    "3. Проверьте товар и подтвердите выполнение заказа на GetBuff.",
  ].join("\n");
}

export function formatProductDescription(description: string): string[] {
  return description
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
