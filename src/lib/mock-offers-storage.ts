import {
  getMockUserById,
  mockProductToProductOffer,
  type MockProduct,
} from "@/lib/mock-data";
import { getCatalogGameTitle } from "@/lib/game-slug";
import type { ProductOffer } from "@/lib/types/product-offer";

export const USER_OFFERS_STORAGE_KEY = "getbuff_user_offers";

const CATEGORY_DB_TO_LABEL: Record<string, string> = {
  accounts: "Аккаунты",
  currency: "Валюта",
  keys: "Ключи и коды",
  items: "Скины и предметы",
  boost: "Услуги и буст",
  subscriptions: "Подписки",
};

export function loadUserMockProducts(): MockProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(USER_OFFERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MockProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserMockProducts(products: MockProduct[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_OFFERS_STORAGE_KEY, JSON.stringify(products));
}

export function appendUserMockProduct(product: MockProduct): void {
  const products = loadUserMockProducts();
  saveUserMockProducts([product, ...products.filter((item) => item.id !== product.id)]);
}

export function getUserMockProductById(id: string): MockProduct | undefined {
  return loadUserMockProducts().find((product) => product.id === id);
}

export function getUserMockOffersByGameSlug(gameSlug: string): ProductOffer[] {
  return loadUserMockProducts()
    .filter((product) => product.gameSlug === gameSlug)
    .map((product) => mockProductToProductOffer(product))
    .filter((offer): offer is ProductOffer => offer !== null);
}

export function createUserMockProduct(params: {
  gameSlug: string;
  sellerId: string;
  title: string;
  description: string;
  categoryDb: string;
  price: number;
  instantDelivery: boolean;
}): MockProduct {
  const seller = getMockUserById(params.sellerId);

  return {
    id: `prod-user-${Date.now()}`,
    sellerId: params.sellerId,
    title: params.title,
    gameSlug: params.gameSlug,
    gameName: getCatalogGameTitle(params.gameSlug),
    category: CATEGORY_DB_TO_LABEL[params.categoryDb] ?? params.categoryDb,
    price: params.price,
    description: params.description,
    instructions:
      "1. Оплатите заказ на GetBuff.\n2. Свяжитесь с продавцом в чате.\n3. Получите товар.\n4. Подтвердите сделку.",
    instantDelivery: params.instantDelivery,
    image: null,
  };
}

export function isUserMockProductId(id: string): boolean {
  return id.startsWith("prod-user-");
}
