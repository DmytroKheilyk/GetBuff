import { getHomeCategoryBySlug } from "@/lib/home-catalog";
import { normalizeCategory } from "@/lib/types/offer";
import {
  resolveDeliveryLabel,
  type ProductOffer,
} from "@/lib/types/product-offer";

/** Меняем на false, когда подключаем реальную БД. */
export const USE_MOCK_DATA = true;

export type MockUserStatus = "online" | "offline";

export type MockReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type MockUser = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  status: MockUserStatus;
  reviews?: MockReview[];
};

export type MockProduct = {
  id: string;
  sellerId: string;
  title: string;
  gameSlug: string;
  gameName: string;
  category: string;
  price: number;
  description: string;
  instructions: string;
  instantDelivery: boolean;
  image: string | null;
};

export type PopularProductCardData = {
  id: string;
  title: string;
  gameLabel: string;
  categoryLabel: string;
  price: number;
  instantDelivery: boolean;
  imageSrc?: string;
  gameIconSrc: string;
  fallbackTileClass: string;
  gameAbbr: string;
};

export const mockUsers: MockUser[] = [
  {
    id: "user-pala4",
    name: "pala4.316@gmail.com",
    avatar: "bg-sky-500/20 text-sky-400",
    rating: 4.9,
    totalSales: 34,
    status: "online",
    reviews: [
      {
        id: "rev-pala4-1",
        author: "RobloxFan_07",
        rating: 5,
        text: "Робуксы пришли за 12 минут, всё честно через группу.",
        createdAt: "2026-03-18",
      },
      {
        id: "rev-pala4-2",
        author: "MaksimK",
        rating: 5,
        text: "Telegram Premium активировал без проблем, рекомендую.",
        createdAt: "2026-03-05",
      },
    ],
  },
  {
    id: "user-gamerpro",
    name: "GamerPro",
    avatar: "bg-violet-500/20 text-violet-400",
    rating: 4.7,
    totalSales: 12,
    status: "online",
    reviews: [
      {
        id: "rev-gamerpro-1",
        author: "CS2_Trader",
        rating: 5,
        text: "Скин передали быстро, трейд прошёл без задержек.",
        createdAt: "2026-02-28",
      },
    ],
  },
  {
    id: "user-topseller",
    name: "TopSeller99",
    avatar: "bg-emerald-500/20 text-emerald-400",
    rating: 5.0,
    totalSales: 21,
    status: "offline",
    reviews: [
      {
        id: "rev-top-1",
        author: "BrawlMaster",
        rating: 5,
        text: "Аккаунт Brawl Stars совпал с описанием, помогли с входом.",
        createdAt: "2026-03-12",
      },
      {
        id: "rev-top-2",
        author: "NitroUser",
        rating: 5,
        text: "Discord Nitro активировали за пару минут.",
        createdAt: "2026-02-20",
      },
    ],
  },
  {
    id: "user-steamking",
    name: "SteamKing",
    avatar: "bg-orange-500/20 text-orange-400",
    rating: 4.8,
    totalSales: 8,
    status: "online",
    reviews: [
      {
        id: "rev-steam-1",
        author: "KeyHunter",
        rating: 5,
        text: "Ключ Steam активировался с первого раза, спасибо!",
        createdAt: "2026-03-01",
      },
    ],
  },
  {
    id: "user-pixel",
    name: "PixelTrader",
    avatar: "bg-rose-500/20 text-rose-400",
    rating: 4.6,
    totalSales: 3,
    status: "offline",
    reviews: [
      {
        id: "rev-pixel-1",
        author: "FortniteKid",
        rating: 4,
        text: "V-Bucks пришли, но пришлось подождать около часа.",
        createdAt: "2026-03-15",
      },
    ],
  },
  {
    id: "user-fresh",
    name: "NewSeller_RU",
    avatar: "bg-cyan-500/20 text-cyan-400",
    rating: 4.5,
    totalSales: 0,
    status: "online",
    reviews: [],
  },
];

export const mockProducts: MockProduct[] = [
  {
    id: "prod-roblox-1000",
    sellerId: "user-pala4",
    title: "⭐ 1000 РОБУКСОВ МОМЕНТАЛЬНО ЧЕРЕЗ ГРУППУ ⭐",
    gameSlug: "roblox",
    gameName: "Roblox",
    category: "Валюта",
    price: 850,
    description:
      "Продажа 1000 Robux через официальный метод Game Pass / Group Payout.\n\n• Выдача в течение 5–15 минут после оплаты\n• Работаем только через безопасную сделку GetBuff\n• Поддержка в чате до полного зачисления\n• Без банов и серых схем — только проверенный метод",
    instructions:
      "1. Укажите ник Roblox в чате после оплаты.\n2. Примите запрос в друзья от продавца.\n3. Дождитесь начисления Robux через группу.\n4. Подтвердите получение в личном кабинете GetBuff.",
    instantDelivery: true,
    image: "/home/showcase/roblox.jpg",
  },
  {
    id: "prod-roblox-500",
    sellerId: "user-gamerpro",
    title: "500 Робуксов | Быстрый трансфер",
    gameSlug: "roblox",
    gameName: "Roblox",
    category: "Валюта",
    price: 450,
    description:
      "500 Robux через безопасный трансфер Game Pass.\n\n• Среднее время выдачи — 20–40 минут\n• Подходит для любых аккаунтов без ограничений\n• Сопровождение сделки в чате GetBuff\n• Честная цена для небольшого пополнения",
    instructions:
      "1. Отправьте ник Roblox в чате заказа.\n2. Примите запрос в друзья.\n3. Купите Game Pass по инструкции продавца.\n4. Дождитесь начисления и подтвердите заказ.",
    instantDelivery: false,
    image: null,
  },
  {
    id: "prod-bs-18k",
    sellerId: "user-topseller",
    title: "Аккаунт 18.000 кубков | 45 бойцов + Лео",
    gameSlug: "brawl-stars",
    gameName: "Brawl Stars",
    category: "Аккаунты",
    price: 3200,
    description:
      "Аккаунт Brawl Stars с 18 000+ кубков и 45 бойцами, включая Леон.\n\n• Supercell ID с возможностью смены почты\n• Активный Brawl Pass на текущий сезон\n• Чистая история без банов\n• Помощь с первым входом в чате",
    instructions:
      "1. После оплаты получите данные Supercell ID.\n2. Смените пароль и привяжите свою почту.\n3. Проверьте состав бойцов в игре.\n4. Подтвердите получение на GetBuff.",
    instantDelivery: false,
    image: null,
  },
  {
    id: "prod-steam-random-key",
    sellerId: "user-steamking",
    title: "Ключ случайной игры Steam [Premium]",
    gameSlug: "steam",
    gameName: "Steam",
    category: "Ключи",
    price: 199,
    description:
      "Случайный Premium-ключ для Steam с игрой от 500 ₽.\n\n• Только лицензионные ключи\n• Регион: RU/CIS (уточняется в чате)\n• Моментальная выдача текстом после оплаты\n• Гарантия активации или возврат через GetBuff",
    instructions:
      "1. Оплатите заказ и дождитесь ключа в чате.\n2. Откройте Steam → «Активировать продукт».\n3. Введите полученный ключ.\n4. Подтвердите успешную активацию.",
    instantDelivery: true,
    image: null,
  },
  {
    id: "prod-steam-wallet",
    sellerId: "user-steamking",
    title: "Пополнение Steam 500 ₽ | Автовыдача на аккаунт",
    gameSlug: "steam",
    gameName: "Steam",
    category: "Валюта",
    price: 520,
    description:
      "Моментальное пополнение баланса Steam Wallet на 500 ₽.\n\n• Подходит для RU/CIS аккаунтов\n• Комиссия Steam уже учтена в цене лота\n• Выдача по логину или email аккаунта\n• Работаем без выходных",
    instructions:
      "1. Напишите логин Steam (не ник!) в чате заказа.\n2. Дождитесь подтверждения от продавца.\n3. Проверьте поступление средств в кошельке Steam.\n4. Подтвердите выполнение заказа на GetBuff.",
    instantDelivery: true,
    image: null,
  },
  {
    id: "prod-tg-3m",
    sellerId: "user-pala4",
    title: "Telegram Premium на 3 месяца (Гифт/Ссылка)",
    gameSlug: "telegram",
    gameName: "Telegram Premium",
    category: "Подписки",
    price: 990,
    description:
      "Telegram Premium на 3 месяца через официальный gift.\n\n• Активация за 2–5 минут после оплаты\n• Подходит для любого региона\n• Без сторонних ботов\n• Гарантия активации или возврат через GetBuff",
    instructions:
      "1. Отправьте @username Telegram в чате заказа.\n2. Получите gift-ссылку от продавца.\n3. Активируйте Premium в приложении.\n4. Подтвердите выполнение заказа.",
    instantDelivery: true,
    image: null,
  },
  {
    id: "prod-cs2-slippers",
    sellerId: "user-gamerpro",
    title: "AK-47 | Сланцы (После полевых испытаний)",
    gameSlug: "cs2",
    gameName: "CS2",
    category: "Скины",
    price: 1850,
    description:
      "Скин AK-47 | Slippers (Field-Tested) для CS2.\n\n• Передача через Steam Trade Offer\n• Float и скриншот перед обменом\n• Только для аккаунтов с Steam Guard\n• Сопровождение сделки в чате GetBuff",
    instructions:
      "1. Укажите Trade URL в чате после оплаты.\n2. Примите обмен от продавца в Steam.\n3. Проверьте скин в инвентаре.\n4. Подтвердите получение на GetBuff.",
    instantDelivery: false,
    image: "/home/showcase/cs2.jpg",
  },
  {
    id: "prod-discord-nitro-full",
    sellerId: "user-topseller",
    title: "Discord Nitro Full 1 месяц (С гарантией)",
    gameSlug: "discord-nitro",
    gameName: "Discord Nitro",
    category: "Подписки",
    price: 549,
    description:
      "Discord Nitro Full на 1 месяц с гарантией активации.\n\n• Полный Nitro с бустами сервера\n• Gift-ссылка или прямая активация\n• Выдача в течение 5 минут\n• Помощь с активацией в чате",
    instructions:
      "1. Отправьте Discord username в чате.\n2. Получите gift-ссылку от продавца.\n3. Активируйте Nitro в настройках Discord.\n4. Подтвердите получение подписки.",
    instantDelivery: true,
    image: null,
  },
  {
    id: "prod-fortnite-vbucks",
    sellerId: "user-pixel",
    title: "1000 V-Bucks (Донат по тегу)",
    gameSlug: "fortnite",
    gameName: "Fortnite",
    category: "Валюта",
    price: 690,
    description:
      "1000 V-Bucks для Fortnite через донат по игровому тегу.\n\n• Подходит для Epic Games аккаунтов\n• Среднее время выдачи — до 1 часа\n• Безопасная сделка через GetBuff\n• Поддержка в чате до зачисления",
    instructions:
      "1. Укажите Epic Games никнейм в чате.\n2. Дождитесь подтверждения от продавца.\n3. Проверьте V-Bucks в магазине Fortnite.\n4. Подтвердите выполнение заказа.",
    instantDelivery: false,
    image: null,
  },
  {
    id: "prod-gmod-key",
    sellerId: "user-steamking",
    title: "Garry's Mod Лицензионный ключ (Регион СНГ)",
    gameSlug: "garrys-mod",
    gameName: "Garry's Mod",
    category: "Ключи",
    price: 349,
    description:
      "Лицензионный ключ Garry's Mod для Steam (регион СНГ).\n\n• Моментальная выдача после оплаты\n• Активация только в Steam\n• Поддержка при проблемах с регионом\n• Официальный ключ, не серый маркет",
    instructions:
      "1. Оплатите заказ и получите ключ в чате.\n2. Откройте Steam → «Активировать продукт».\n3. Введите ключ и дождитесь добавления в библиотеку.\n4. Подтвердите активацию на GetBuff.",
    instantDelivery: true,
    image: null,
  },
  {
    id: "prod-mlbb-diamonds",
    sellerId: "user-fresh",
    title: "250 Алмазов | Моментально по ID",
    gameSlug: "mobile-legends",
    gameName: "Mobile Legends",
    category: "Валюта",
    price: 399,
    description:
      "250 алмазов Mobile Legends: Bang Bang по игровому ID.\n\n• Моментальное пополнение после проверки ID\n• Любой сервер\n• Безопасная сделка через GetBuff\n• Первый лот нового продавца — аккуратная выдача",
    instructions:
      "1. Отправьте User ID и Zone ID в чате заказа.\n2. Дождитесь скриншота пополнения.\n3. Проверьте алмазы в игре.\n4. Подтвердите выполнение заказа.",
    instantDelivery: true,
    image: null,
  },
  {
    id: "prod-tg-premium-1y",
    sellerId: "user-topseller",
    title: "Telegram Premium на 1 год | Gift-ссылка",
    gameSlug: "telegram",
    gameName: "Telegram Premium",
    category: "Подписки",
    price: 2890,
    description:
      "Telegram Premium на 12 месяцев через официальный gift.\n\n• Активация за 2–5 минут\n• Подходит для любого региона\n• Гарантия активации или возврат\n• Поддержка в чате до успешной активации",
    instructions:
      "1. Отправьте @username Telegram в чате заказа.\n2. Получите gift-ссылку от продавца.\n3. Активируйте Premium в приложении.\n4. Подтвердите выполнение заказа.",
    instantDelivery: true,
    image: null,
  },
];

export function getMockUserById(id: string): MockUser | undefined {
  return mockUsers.find((user) => user.id === id);
}

export function getMockProductById(id: string): MockProduct | undefined {
  return mockProducts.find((product) => product.id === id);
}

export function filterMockProducts(
  items: MockProduct[],
  query: string
): MockProduct[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(normalized) ||
      item.gameName.toLowerCase().includes(normalized) ||
      item.category.toLowerCase().includes(normalized)
  );
}

export function toPopularProductCard(
  product: MockProduct
): PopularProductCardData {
  const category = getHomeCategoryBySlug(product.gameSlug);

  return {
    id: product.id,
    title: product.title,
    gameLabel: product.gameName,
    categoryLabel: product.category,
    price: product.price,
    instantDelivery: product.instantDelivery,
    imageSrc: product.image ?? undefined,
    gameIconSrc: category?.imageSrc ?? "",
    fallbackTileClass:
      category?.fallbackTileClass ??
      "bg-linear-to-br from-neutral-300 to-neutral-400 dark:from-[#2a2d38] dark:to-[#14161d]",
    gameAbbr: category?.abbr ?? product.gameName.slice(0, 2).toUpperCase(),
  };
}

export function mockProductToProductOffer(
  product: MockProduct
): ProductOffer | null {
  const seller = getMockUserById(product.sellerId);
  if (!seller) return null;

  return {
    id: product.id,
    gameSlug: product.gameSlug,
    categoryRaw: product.category,
    categoryKey: normalizeCategory(product.category),
    description: product.title,
    detailsDescription: product.description,
    instructionsText: product.instructions,
    price: product.price,
    gameTitle: product.gameName,
    createdAt: new Date().toISOString(),
    completedDealsCount: seller.totalSales,
    deliveryLabel: product.instantDelivery
      ? "Моментально"
      : resolveDeliveryLabel(product.description, product.category),
    seller: {
      nickname: seller.name,
      avatarColor: seller.avatar,
      rating: seller.rating,
      reviewAverage: seller.totalSales > 0 ? seller.rating : null,
      reviewCount: seller.reviews?.length ?? 0,
      online: seller.status === "online",
    },
  };
}

export function resolveMockProductOffer(id: string): ProductOffer | null {
  if (!USE_MOCK_DATA) return null;
  const product = getMockProductById(id);
  if (!product) return null;
  return mockProductToProductOffer(product);
}
