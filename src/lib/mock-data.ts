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
  description: string;
  createdAt: string;
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
    description:
      "Продаю валюту и аккаунты более 3-х лет. Быстрый ответ, честные сделки!",
    createdAt: "май 2023",
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
    description:
      "Специализируюсь на CS2, Fortnite и мобильных играх. Всегда на связи в чате.",
    createdAt: "январь 2024",
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
    description:
      "Топовый продавец GetBuff: аккаунты, подписки и внутриигровая валюта с гарантией.",
    createdAt: "август 2022",
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
    description:
      "Ключи Steam, пополнение кошелька и игровые аккаунты. Работаю только через GetBuff.",
    createdAt: "март 2024",
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
    description:
      "Продаю V-Bucks, скины и игровую валюту. Отвечаю в течение нескольких часов.",
    createdAt: "ноябрь 2025",
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
    description:
      "Новый продавец на площадке. Стараюсь быстро отвечать и честно описывать каждый лот.",
    createdAt: "май 2025",
    reviews: [],
  },
];

type MockProductSeed = {
  suffix: string;
  title: string;
  category: string;
  price: number;
  description: string;
  instructions: string;
  instantDelivery: boolean;
  image?: string | null;
};

type MockGameCatalog = {
  gameSlug: string;
  gameName: string;
  products: MockProductSeed[];
};

const MOCK_GAME_CATALOG: MockGameCatalog[] = [
  {
    gameSlug: "roblox",
    gameName: "Roblox",
    products: [
      {
        suffix: "1",
        title: "⭐ 1000 РОБУКСОВ МОМЕНТАЛЬНО ЧЕРЕЗ ГРУППУ ⭐",
        category: "Валюта",
        price: 850,
        description:
          "1000 Robux через Game Pass / Group Payout.\n\n• Выдача 5–15 минут\n• Безопасная сделка GetBuff\n• Поддержка до полного зачисления",
        instructions:
          "1. Укажите ник Roblox в чате.\n2. Примите запрос в друзья.\n3. Дождитесь Robux через группу.\n4. Подтвердите заказ.",
        instantDelivery: true,
        image: "/home/showcase/roblox.jpg",
      },
      {
        suffix: "2",
        title: "500 Робуксов | Быстрый трансфер",
        category: "Валюта",
        price: 450,
        description:
          "500 Robux через Game Pass.\n\n• Выдача 20–40 минут\n• Любые аккаунты\n• Сопровождение в чате",
        instructions:
          "1. Отправьте ник в чате.\n2. Примите запрос в друзья.\n3. Купите Game Pass по инструкции.\n4. Подтвердите получение.",
        instantDelivery: false,
      },
      {
        suffix: "3",
        title: "2000 Robux | Mega Pack + бонус",
        category: "Валюта",
        price: 1590,
        description:
          "Крупный пакет 2000 Robux с бонусом за первую покупку.\n\n• Приоритетная выдача\n• Проверенный метод группы\n• Идеально для доната в играх",
        instructions:
          "1. Напишите ник Roblox.\n2. Следуйте инструкции продавца в чате.\n3. Проверьте баланс Robux.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Аккаунт Roblox | Premium + Rare Items",
        category: "Аккаунты",
        price: 2400,
        description:
          "Аккаунт с Roblox Premium, редкими предметами и чистой историей.\n\n• Полная смена почты\n• Без банов\n• Список редкостей в чате",
        instructions:
          "1. Получите данные входа после оплаты.\n2. Смените пароль и почту.\n3. Проверьте инвентарь.\n4. Подтвердите получение.",
        instantDelivery: false,
      },
      {
        suffix: "5",
        title: "Разработка Game Pass под вашу игру",
        category: "Услуги",
        price: 1200,
        description:
          "Создание и настройка Game Pass для вашей Roblox-игры.\n\n• Консультация по монетизации\n• Настройка цен и описания\n• Помощь с публикацией",
        instructions:
          "1. Опишите игру и цели в чате.\n2. Согласуйте ТЗ с продавцом.\n3. Получите готовый Game Pass.\n4. Подтвердите выполнение.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "brawl-stars",
    gameName: "Brawl Stars",
    products: [
      {
        suffix: "1",
        title: "Аккаунт 18.000 кубков | 45 бойцов + Лео",
        category: "Аккаунты",
        price: 3200,
        description:
          "Аккаунт с 18 000+ кубков, 45 бойцами и Леоном.\n\n• Supercell ID\n• Brawl Pass активен\n• Помощь с входом",
        instructions:
          "1. Получите Supercell ID.\n2. Смените пароль и почту.\n3. Проверьте состав.\n4. Подтвердите заказ.",
        instantDelivery: false,
      },
      {
        suffix: "2",
        title: "170 Гемов | Моментально по Supercell ID",
        category: "Валюта",
        price: 890,
        description:
          "170 гемов Brawl Stars на ваш аккаунт.\n\n• Быстрая выдача\n• Любой регион\n• Скриншот пополнения",
        instructions:
          "1. Отправьте email Supercell ID.\n2. Дождитесь пополнения.\n3. Проверьте гемы в игре.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "3",
        title: "Brawl Pass Plus | Текущий сезон",
        category: "Подписки",
        price: 649,
        description:
          "Brawl Pass Plus на текущий сезон.\n\n• Активация на ваш аккаунт\n• Выдача в течение 15 минут\n• Гарантия активации",
        instructions:
          "1. Укажите Supercell ID.\n2. Дождитесь активации Pass.\n3. Проверьте в игре.\n4. Подтвердите получение.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Прокачка до 25.000 кубков | Безопасно",
        category: "Услуги",
        price: 4500,
        description:
          "Буст кубков до 25 000 на вашем аккаунте.\n\n• Игра с профи\n• Без читов и банов\n• Отчёт по каждой сессии",
        instructions:
          "1. Передайте доступ по договорённости в чате.\n2. Следите за прогрессом.\n3. Проверьте итоговые кубки.\n4. Подтвердите выполнение.",
        instantDelivery: false,
      },
      {
        suffix: "5",
        title: "Аккаунт | 52 бойца + все гаджеты",
        category: "Аккаунты",
        price: 7800,
        description:
          "Топовый аккаунт: 52 бойца, гаджеты и star powers.\n\n• 22 000+ кубков\n• Чистая история\n• Полная перепривязка",
        instructions:
          "1. Получите данные Supercell ID.\n2. Смените привязки.\n3. Проверьте коллекцию.\n4. Подтвердите заказ.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "steam",
    gameName: "Steam",
    products: [
      {
        suffix: "1",
        title: "Пополнение Steam 500 ₽ | Автовыдача",
        category: "Валюта",
        price: 520,
        description:
          "Пополнение Steam Wallet 500 ₽ для RU/CIS.\n\n• Моментальная выдача\n• По логину или email\n• Комиссия учтена",
        instructions:
          "1. Укажите логин Steam в чате.\n2. Дождитесь пополнения.\n3. Проверьте кошелёк.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "2",
        title: "Ключ случайной игры Steam [Premium]",
        category: "Ключи",
        price: 199,
        description:
          "Случайная игра Steam стоимостью от 500 ₽.\n\n• Лицензионный ключ\n• RU/CIS регион\n• Моментальная выдача",
        instructions:
          "1. Получите ключ в чате.\n2. Активируйте в Steam.\n3. Проверьте библиотеку.\n4. Подтвердите активацию.",
        instantDelivery: true,
      },
      {
        suffix: "3",
        title: "Пополнение Steam 1000 ₽ | Без комиссии",
        category: "Валюта",
        price: 1020,
        description:
          "Пополнение баланса Steam на 1000 ₽.\n\n• Быстрая выдача\n• Поддержка RU/CIS\n• Работаем ежедневно",
        instructions:
          "1. Напишите логин Steam.\n2. Дождитесь зачисления.\n3. Проверьте баланс.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Ключ CS2 Prime Status Upgrade",
        category: "Ключи",
        price: 1290,
        description:
          "Prime Status для Counter-Strike 2.\n\n• Официальная активация\n• Подходит для новых аккаунтов\n• Gift или ключ",
        instructions:
          "1. Укажите ссылку профиля Steam.\n2. Получите gift или ключ.\n3. Активируйте Prime.\n4. Подтвердите получение.",
        instantDelivery: true,
      },
      {
        suffix: "5",
        title: "Подарок игры другу | Любой title до 1500 ₽",
        category: "Услуги",
        price: 1490,
        description:
          "Покупка и отправка игры в подарок на Steam.\n\n• Выбор из каталога до 1500 ₽\n• Отправка на ваш аккаунт или друга\n• Официальный gift",
        instructions:
          "1. Укажите игру и Steam профиль.\n2. Дождитесь отправки gift.\n3. Примите подарок в Steam.\n4. Подтвердите заказ.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "telegram",
    gameName: "Telegram Premium",
    products: [
      {
        suffix: "1",
        title: "Telegram Premium на 3 месяца (Гифт/Ссылка)",
        category: "Подписки",
        price: 990,
        description:
          "Premium на 3 месяца через официальный gift.\n\n• Активация 2–5 минут\n• Любой регион\n• Гарантия или возврат",
        instructions:
          "1. Отправьте @username.\n2. Получите gift-ссылку.\n3. Активируйте Premium.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "2",
        title: "Telegram Premium на 1 год | Gift-ссылка",
        category: "Подписки",
        price: 2890,
        description:
          "Premium на 12 месяцев.\n\n• Официальный gift\n• Быстрая активация\n• Поддержка в чате",
        instructions:
          "1. Укажите @username Telegram.\n2. Активируйте gift.\n3. Проверьте статус Premium.\n4. Подтвердите получение.",
        instantDelivery: true,
      },
      {
        suffix: "3",
        title: "Telegram Stars 1000 шт. | Моментально",
        category: "Валюта",
        price: 1490,
        description:
          "1000 Telegram Stars на ваш аккаунт.\n\n• Для донатов и покупок в ботах\n• Быстрая выдача\n• Официальный метод",
        instructions:
          "1. Отправьте @username.\n2. Дождитесь начисления Stars.\n3. Проверьте баланс.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Premium + Stars Bundle | Выгодный пакет",
        category: "Подписки",
        price: 3290,
        description:
          "Premium на 6 месяцев + 500 Stars.\n\n• Комбо-пакет со скидкой\n• Gift-активация\n• Идеально для каналов",
        instructions:
          "1. Укажите @username.\n2. Получите оба продукта.\n3. Проверьте Premium и Stars.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "5",
        title: "Настройка Premium-канала | Оформление + буст",
        category: "Услуги",
        price: 2500,
        description:
          "Оформление Telegram-канала под Premium.\n\n• Обложка, описание, закреп\n• Рекомендации по монетизации\n• Консультация 1 час",
        instructions:
          "1. Опишите канал и цели.\n2. Согласуйте макет.\n3. Получите готовое оформление.\n4. Подтвердите выполнение.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "cs2",
    gameName: "CS2",
    products: [
      {
        suffix: "1",
        title: "AK-47 | Сланцы (После полевых испытаний)",
        category: "Скины",
        price: 1850,
        description:
          "AK-47 | Slippers (FT) через Steam Trade.\n\n• Float и скриншот\n• Steam Guard обязателен\n• Сопровождение сделки",
        instructions:
          "1. Укажите Trade URL.\n2. Примите обмен.\n3. Проверьте инвентарь.\n4. Подтвердите получение.",
        instantDelivery: false,
        image: "/home/showcase/cs2.jpg",
      },
      {
        suffix: "2",
        title: "M9 Bayonet | Автотроника (После полевых)",
        category: "Скины",
        price: 14200,
        description:
          "M9 Bayonet | Autotronic (Field-Tested).\n\n• Проверенный float\n• Безопасный trade\n• Скриншоты перед обменом",
        instructions:
          "1. Отправьте Trade URL.\n2. Проверьте предложение обмена.\n3. Примите трейд.\n4. Подтвердите заказ.",
        instantDelivery: false,
        image: "/home/showcase/cs2.jpg",
      },
      {
        suffix: "3",
        title: "Буст звания до Глобала / Напарники",
        category: "Услуги",
        price: 8900,
        description:
          "Прокачка звания до Global Elite в Premier / MM.\n\n• Игра на вашем аккаунте\n• Без читов\n• Ежедневные отчёты",
        instructions:
          "1. Обсудите текущий ранг в чате.\n2. Передайте доступ по договорённости.\n3. Следите за прогрессом.\n4. Подтвердите результат.",
        instantDelivery: false,
      },
      {
        suffix: "4",
        title: "AWP | Asiimov (Поле-испытаний) | TOP Float",
        category: "Скины",
        price: 6200,
        description:
          "AWP | Asiimov (FT) с хорошим float.\n\n• Проверка через CSFloat\n• Trade через Steam\n• Быстрая передача",
        instructions:
          "1. Trade URL в чате.\n2. Примите обмен.\n3. Проверьте скин.\n4. Подтвердите заказ.",
        instantDelivery: false,
        image: "/home/showcase/cs2.jpg",
      },
      {
        suffix: "5",
        title: "Prime + 10 Premier Wins | Стартовый пакет",
        category: "Услуги",
        price: 3200,
        description:
          "Prime Status + 10 побед в Premier на вашем аккаунте.\n\n• Для новых аккаунтов\n• Безопасный буст\n• Готов к ranked",
        instructions:
          "1. Укажите данные аккаунта в чате.\n2. Дождитесь выполнения.\n3. Проверьте Prime и wins.\n4. Подтвердите заказ.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "fortnite",
    gameName: "Fortnite",
    products: [
      {
        suffix: "1",
        title: "1000 V-Bucks (Донат по тегу)",
        category: "Валюта",
        price: 690,
        description:
          "1000 V-Bucks через Epic Games tag.\n\n• Выдача до 1 часа\n• PC / Xbox / PS\n• Поддержка в чате",
        instructions:
          "1. Укажите Epic никнейм.\n2. Дождитесь доната.\n3. Проверьте баланс V-Bucks.\n4. Подтвердите заказ.",
        instantDelivery: false,
      },
      {
        suffix: "2",
        title: "2800 V-Bucks | Моментальный подарок",
        category: "Валюта",
        price: 1890,
        description:
          "2800 V-Bucks gift через Epic.\n\n• Быстрая выдача\n• Официальный метод\n• Для любых платформ",
        instructions:
          "1. Отправьте Epic username.\n2. Примите gift.\n3. Проверьте V-Bucks.\n4. Подтвердите получение.",
        instantDelivery: true,
      },
      {
        suffix: "3",
        title: "Battle Pass | Текущий сезон + 25 уровней",
        category: "Подписки",
        price: 1290,
        description:
          "Battle Pass текущего сезона с бустом уровней.\n\n• Активация на аккаунт\n• +25 уровней включено\n• Безопасная выдача",
        instructions:
          "1. Укажите Epic Games login.\n2. Дождитесь активации.\n3. Проверьте Pass в игре.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Аккаунт | 150+ скинов + Renegade Raider",
        category: "Аккаунты",
        price: 12500,
        description:
          "Редкий аккаунт Fortnite с OG-скинами.\n\n• Полная смена почты\n• Список скинов в чате\n• Без банов",
        instructions:
          "1. Получите данные Epic.\n2. Смените пароль.\n3. Проверьте locker.\n4. Подтвердите получение.",
        instantDelivery: false,
      },
      {
        suffix: "5",
        title: "Прокачка уровня Battle Pass | +50 lvl",
        category: "Услуги",
        price: 2400,
        description:
          "+50 уровней Battle Pass на вашем аккаунте.\n\n• Ручной фарм\n• Без читов\n• Срок 3–5 дней",
        instructions:
          "1. Обсудите текущий уровень.\n2. Передайте доступ.\n3. Следите за прогрессом.\n4. Подтвердите выполнение.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "garrys-mod",
    gameName: "Garry's Mod",
    products: [
      {
        suffix: "1",
        title: "Garry's Mod Лицензионный ключ (Регион СНГ)",
        category: "Ключи",
        price: 349,
        description:
          "Ключ GMod для Steam (СНГ).\n\n• Моментальная выдача\n• Официальная лицензия\n• Поддержка активации",
        instructions:
          "1. Получите ключ в чате.\n2. Активируйте в Steam.\n3. Проверьте библиотеку.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "2",
        title: "DarkRP Starter Pack | Деньги + VIP на сервере",
        category: "Услуги",
        price: 590,
        description:
          "Стартовый пакет DarkRP на популярном сервере.\n\n• Игровая валюта + VIP\n• Активация по Steam ID\n• Выдача 10–30 минут",
        instructions:
          "1. Укажите Steam ID и сервер.\n2. Дождитесь выдачи.\n3. Проверьте в игре.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "3",
        title: "Wiremod + Advanced Duplicator 2 | Обучение",
        category: "Услуги",
        price: 890,
        description:
          "Часовой урок по Wiremod и AD2.\n\n• Discord / голос\n• Практика на вашем сервере\n• Запись созвона",
        instructions:
          "1. Согласуйте время в чате.\n2. Подключитесь к созвону.\n3. Пройдите обучение.\n4. Подтвердите выполнение.",
        instantDelivery: false,
      },
      {
        suffix: "4",
        title: "Sandbox VIP | 30 дней на сервере",
        category: "Подписки",
        price: 450,
        description:
          "VIP-статус Sandbox на 30 дней.\n\n• Приоритет входа\n• Эксклюзивные модели\n• Активация по Steam ID",
        instructions:
          "1. Отправьте Steam ID.\n2. Дождитесь активации VIP.\n3. Проверьте на сервере.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "5",
        title: "Пакет аддонов | 50 Workshop items",
        category: "Ключи",
        price: 250,
        description:
          "Подборка из 50 популярных Workshop-аддонов.\n\n• Список + ссылки\n• Для серверов и одиночной игры\n• PDF-гайд по установке",
        instructions:
          "1. Получите список в чате.\n2. Установите аддоны.\n3. Проверьте работоспособность.\n4. Подтвердите получение.",
        instantDelivery: true,
      },
    ],
  },
  {
    gameSlug: "mobile-legends",
    gameName: "Mobile Legends",
    products: [
      {
        suffix: "1",
        title: "250 Алмазов | Моментально по ID",
        category: "Валюта",
        price: 399,
        description:
          "250 алмазов MLBB по User ID.\n\n• Моментальная выдача\n• Любой сервер\n• Скриншот пополнения",
        instructions:
          "1. User ID + Zone ID в чате.\n2. Дождитесь пополнения.\n3. Проверьте алмазы.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "2",
        title: "500 Алмазов | Быстрое пополнение",
        category: "Валюта",
        price: 749,
        description:
          "500 алмазов Mobile Legends.\n\n• Выдача 5–15 минут\n• Официальный reseller-метод\n• Поддержка в чате",
        instructions:
          "1. Отправьте ID и Zone ID.\n2. Дождитесь скриншота.\n3. Проверьте баланс.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "3",
        title: "Starlight Membership | Текущий месяц",
        category: "Подписки",
        price: 599,
        description:
          "Starlight Membership на текущий месяц.\n\n• Активация по ID\n• Эксклюзивный скин месяца\n• Быстрая выдача",
        instructions:
          "1. Укажите User ID.\n2. Дождитесь активации.\n3. Проверьте Starlight.\n4. Подтвердите получение.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Аккаунт Mythic Glory | 120+ скинов",
        category: "Аккаунты",
        price: 6500,
        description:
          "Аккаунт MLBB ранг Mythic Glory.\n\n• 120+ скинов\n• Moonton привязка\n• Помощь со сменой данных",
        instructions:
          "1. Получите данные Moonton.\n2. Смените пароль.\n3. Проверьте ранг и скины.\n4. Подтвердите заказ.",
        instantDelivery: false,
      },
      {
        suffix: "5",
        title: "Буст до Mythic | С Legend",
        category: "Услуги",
        price: 3800,
        description:
          "Буст ранга до Mythic с Legend.\n\n• Игра duo или pilot\n• Без токсичности\n• Отчёты после каждой игры",
        instructions:
          "1. Укажите текущий ранг.\n2. Согласуйте формат буста.\n3. Следите за прогрессом.\n4. Подтвердите результат.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "genshin",
    gameName: "Genshin Impact",
    products: [
      {
        suffix: "1",
        title: "Примогемы Луна | По ID (Fast)",
        category: "Валюта",
        price: 549,
        description:
          "Blessing of the Welkin Moon на 30 дней.\n\n• Активация по UID\n• Быстрая выдача\n• Любой сервер",
        instructions:
          "1. UID + сервер в чате.\n2. Дождитесь активации.\n3. Проверьте в игре.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "2",
        title: "Аккаунт с Ху Тао + Хома | С полной перепривязкой",
        category: "Аккаунты",
        price: 9800,
        description:
          "AR 55+ аккаунт с Hu Tao и Staff of Homa.\n\n• Полная смена почты\n• 5★ персонажи и оружие\n• Европа / Asia / America",
        instructions:
          "1. Получите данные аккаунта.\n2. Смените пароль и почту.\n3. Проверьте состав.\n4. Подтвердите получение.",
        instantDelivery: false,
      },
      {
        suffix: "3",
        title: "6480 Genesis Crystals + бонус",
        category: "Валюта",
        price: 5990,
        description:
          "6480 кристаллов через uid-заказ.\n\n• Бонус x2 для новых uid\n• 10–30 минут\n• Скриншот пополнения",
        instructions:
          "1. UID + сервер.\n2. Дождитесь пополнения.\n3. Проверьте кристаллы.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Battle Pass Genshin | Текущая версия",
        category: "Подписки",
        price: 890,
        description:
          "Gnostic Hymn текущей версии.\n\n• Активация по UID\n• Моментальная выдача\n• Все награды BP",
        instructions:
          "1. Отправьте UID.\n2. Дождитесь активации BP.\n3. Проверьте в игре.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "5",
        title: "Фарм артефактов | 20 Legendary runs",
        category: "Услуги",
        price: 2100,
        description:
          "20 прогонов доменов на вашем аккаунте.\n\n• Выбор сета\n• Resin используется эффективно\n• Отчёт с дропом",
        instructions:
          "1. Укажите UID и нужный сет.\n2. Передайте доступ.\n3. Получите отчёт.\n4. Подтвердите выполнение.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "valorant",
    gameName: "Valorant",
    products: [
      {
        suffix: "1",
        title: "1000 VP | Моментальное пополнение Турции",
        category: "Валюта",
        price: 790,
        description:
          "1000 Valorant Points (TR region gift).\n\n• Моментальная выдача\n• Официальный метод\n• Подходит для TR аккаунтов",
        instructions:
          "1. Укажите Riot ID.\n2. Получите gift-код.\n3. Активируйте VP.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "2",
        title: "Нож Керамбит | Prime",
        category: "Скины",
        price: 8900,
        description:
          "Kerambit | Prime на ваш аккаунт через gift.\n\n• Проверенный аккаунт-источник\n• Безопасная передача\n• Скриншоты",
        instructions:
          "1. Riot ID в чате.\n2. Дождитесь gift.\n3. Проверьте коллекцию.\n4. Подтвердите получение.",
        instantDelivery: false,
      },
      {
        suffix: "3",
        title: "5350 VP | Большой пакет",
        category: "Валюта",
        price: 4290,
        description:
          "5350 VP для Valorant.\n\n• Выгодный пакет\n• Быстрая выдача\n• Поддержка RU/TR регионов",
        instructions:
          "1. Отправьте Riot ID.\n2. Дождитесь пополнения.\n3. Проверьте VP.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Battle Pass | Act + 20 уровней",
        category: "Подписки",
        price: 1190,
        description:
          "Premium Battle Pass текущего акта.\n\n• +20 уровней включено\n• Активация на аккаунт\n• Быстрая выдача",
        instructions:
          "1. Riot ID в чате.\n2. Дождитесь активации.\n3. Проверьте Pass.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "5",
        title: "Буст до Immortal | Duo с про",
        category: "Услуги",
        price: 7500,
        description:
          "Duo-буст до Immortal.\n\n• Игра с высоким MMR\n• Без читов\n• Конфиденциальность",
        instructions:
          "1. Укажите текущий ранг.\n2. Согласуйте расписание.\n3. Следите за прогрессом.\n4. Подтвердите результат.",
        instantDelivery: false,
      },
    ],
  },
  {
    gameSlug: "pubg-mobile",
    gameName: "PUBG Mobile",
    products: [
      {
        suffix: "1",
        title: "660 UC | Покупка через Razer Gold (5 мин)",
        category: "Валюта",
        price: 590,
        description:
          "660 UC через Razer Gold.\n\n• Выдача ~5 минут\n• Player ID пополнение\n• Официальный reseller",
        instructions:
          "1. Player ID в чате.\n2. Дождитесь пополнения.\n3. Проверьте UC.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "2",
        title: "1800 UC | Быстрый донат",
        category: "Валюта",
        price: 1490,
        description:
          "1800 Unknown Cash на аккаунт.\n\n• 10–20 минут\n• Любой регион\n• Скриншот зачисления",
        instructions:
          "1. Отправьте Player ID.\n2. Дождитесь UC.\n3. Проверьте баланс.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "3",
        title: "Royal Pass | Текущий сезон Premium",
        category: "Подписки",
        price: 990,
        description:
          "Royal Pass Premium текущего сезона.\n\n• Активация по Player ID\n• Все награды сезона\n• Быстрая выдача",
        instructions:
          "1. Player ID в чате.\n2. Дождитесь активации RP.\n3. Проверьте в игре.\n4. Подтвердите заказ.",
        instantDelivery: true,
      },
      {
        suffix: "4",
        title: "Аккаунт | Glacier M4 + 80 скинов",
        category: "Аккаунты",
        price: 11200,
        description:
          "Аккаунт с Glacier M416 и 80+ скинами.\n\n• Привязка Twitter/Facebook смена\n• Ace Dominator+\n• Без банов",
        instructions:
          "1. Получите данные аккаунта.\n2. Смените привязки.\n3. Проверьте инвентарь.\n4. Подтвердите получение.",
        instantDelivery: false,
      },
      {
        suffix: "5",
        title: "Буст до Conqueror | Squad",
        category: "Услуги",
        price: 6800,
        description:
          "Буст до Conqueror в squad режиме.\n\n• Игра с профи\n• Безопасный метод\n• Ежедневные отчёты",
        instructions:
          "1. Укажите текущий tier.\n2. Согласуйте формат.\n3. Следите за прогрессом.\n4. Подтвердите результат.",
        instantDelivery: false,
      },
    ],
  },
];

function buildMockProducts(): MockProduct[] {
  const sellerIds = mockUsers.map((user) => user.id);
  const products: MockProduct[] = [];
  let sellerIndex = 0;

  for (const group of MOCK_GAME_CATALOG) {
    for (const seed of group.products) {
      products.push({
        id: `prod-${group.gameSlug}-${seed.suffix}`,
        sellerId: sellerIds[sellerIndex % sellerIds.length]!,
        title: seed.title,
        gameSlug: group.gameSlug,
        gameName: group.gameName,
        category: seed.category,
        price: seed.price,
        description: seed.description,
        instructions: seed.instructions,
        instantDelivery: seed.instantDelivery,
        image: seed.image ?? null,
      });
      sellerIndex += 1;
    }
  }

  return products;
}

export const mockProducts: MockProduct[] = buildMockProducts();

export function getMockUserById(id: string): MockUser | undefined {
  return mockUsers.find((user) => user.id === id);
}

export function getMockProductById(id: string): MockProduct | undefined {
  return mockProducts.find((product) => product.id === id);
}

export function getMockProductsByGameSlug(gameSlug: string): MockProduct[] {
  return mockProducts.filter((product) => product.gameSlug === gameSlug);
}

export function getMockProductsBySellerId(sellerId: string): MockProduct[] {
  return mockProducts.filter((product) => product.sellerId === sellerId);
}

export function getMockOffersByGameSlug(gameSlug: string): ProductOffer[] {
  return getMockProductsByGameSlug(gameSlug)
    .map((product) => mockProductToProductOffer(product))
    .filter((offer): offer is ProductOffer => offer !== null);
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
      id: seller.id,
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

/** Текущий mock-покупатель для чатов (dima). */
export const MOCK_CHAT_BUYER_NAME = "dima.kheilyk@gmail.com";

export type MockChatMessageType = "text" | "system";

export type MockChatMessage = {
  id: string;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  type?: MockChatMessageType;
  image?: string;
};

/** Алиас сообщения в mock-чатах. */
export type Message = MockChatMessage;

export type MockChat = {
  id: string;
  productId: string;
  buyerName: string;
  sellerName: string;
  sellerId: string;
  isArchived: boolean;
  /** Полностью скрыть чат (например, удалённый товар без архивации). */
  isHidden: boolean;
  fallbackProductTitle?: string;
  createdAt: string;
  messages: MockChatMessage[];
};

/** Алиас для mock-чатов в UI и аналитике. */
export type Chat = MockChat;

export function countUnreadMockChatMessages(currentUserName: string): number {
  return mockChats.reduce((total, chat) => {
    if (chat.isHidden) return total;

    return (
      total +
      chat.messages.filter(
        (message) =>
          message.type !== "system" &&
          !message.isRead &&
          message.senderName !== currentUserName
      ).length
    );
  }, 0);
}

export const mockChats: MockChat[] = [
  {
    id: "chat-roblox-1",
    productId: "prod-roblox-1",
    buyerName: MOCK_CHAT_BUYER_NAME,
    sellerName: "pala4.316@gmail.com",
    sellerId: "user-pala4",
    isArchived: false,
    isHidden: false,
    createdAt: "2026-03-20T10:00:00.000Z",
    messages: [
      {
        id: "msg-roblox-1",
        senderName: MOCK_CHAT_BUYER_NAME,
        content: "Здравствуйте! Готов купить 1000 Robux через группу.",
        createdAt: "2026-03-20T10:05:00.000Z",
        isRead: true,
        type: "text",
      },
      {
        id: "sys-roblox-1",
        senderName: "GetBuff",
        content:
          "🛒 Покупатель оплатил заказ. 850 ₽ заморожены на балансе GetBuff. Продавец, передайте товар.",
        createdAt: "2026-03-20T10:06:00.000Z",
        isRead: true,
        type: "system",
      },
      {
        id: "msg-roblox-2",
        senderName: "pala4.316@gmail.com",
        content: "Привет! Отправьте ник Roblox — выдам в течение 15 минут.",
        createdAt: "2026-03-20T10:07:00.000Z",
        isRead: false,
        type: "text",
      },
      {
        id: "msg-roblox-3",
        senderName: "pala4.316@gmail.com",
        content: "Если есть Game Pass — напишите, так быстрее.",
        createdAt: "2026-03-20T10:08:00.000Z",
        isRead: true,
        type: "text",
      },
      {
        id: "msg-roblox-4",
        senderName: "pala4.316@gmail.com",
        content: "Вот скрин выдачи в Roblox:",
        createdAt: "2026-03-20T10:09:30.000Z",
        isRead: true,
        type: "text",
        image:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500",
      },
    ],
  },
  {
    id: "chat-cs2-1",
    productId: "prod-cs2-1",
    buyerName: MOCK_CHAT_BUYER_NAME,
    sellerName: "GamerPro",
    sellerId: "user-gamerpro",
    isArchived: false,
    isHidden: false,
    createdAt: "2026-03-18T14:00:00.000Z",
    messages: [
      {
        id: "msg-cs2-1",
        senderName: MOCK_CHAT_BUYER_NAME,
        content: "Скин ещё в наличии? Готов обменять через трейд.",
        createdAt: "2026-03-18T14:10:00.000Z",
        isRead: true,
        type: "text",
      },
      {
        id: "sys-cs2-1",
        senderName: "GetBuff",
        content:
          "🛒 Покупатель оплатил заказ. 1 850 ₽ заморожены на балансе GetBuff. Продавец, передайте товар.",
        createdAt: "2026-03-18T14:12:00.000Z",
        isRead: true,
        type: "system",
      },
      {
        id: "msg-cs2-2",
        senderName: "GamerPro",
        content: "Да, в наличии. Скин на hold 7 дней — это норм?",
        createdAt: "2026-03-18T14:15:00.000Z",
        isRead: true,
        type: "text",
      },
      {
        id: "msg-cs2-3",
        senderName: MOCK_CHAT_BUYER_NAME,
        content: "Да, подходит. Жду ссылку на трейд.",
        createdAt: "2026-03-18T14:20:00.000Z",
        isRead: true,
        type: "text",
      },
      {
        id: "sys-cs2-2",
        senderName: "GetBuff",
        content:
          "✅ Сделка успешно завершена. Средства зачислены на ваш баланс.",
        createdAt: "2026-03-18T14:25:00.000Z",
        isRead: true,
        type: "system",
      },
    ],
  },
  {
    id: "chat-steam-1",
    productId: "prod-steam-1",
    buyerName: MOCK_CHAT_BUYER_NAME,
    sellerName: "SteamKing",
    sellerId: "user-steamking",
    isArchived: false,
    isHidden: false,
    createdAt: "2026-03-22T09:00:00.000Z",
    messages: [
      {
        id: "msg-steam-1",
        senderName: "SteamKing",
        content: "Ключ Steam готов. Активируется только в RU регионе.",
        createdAt: "2026-03-22T09:12:00.000Z",
        isRead: false,
        type: "text",
      },
      {
        id: "msg-steam-2",
        senderName: "SteamKing",
        content:
          "Слушай, перейди в тг t.me/super_seller, там быстрее отвечу и скину скриншоты",
        createdAt: "2026-03-22T09:14:00.000Z",
        isRead: true,
        type: "text",
      },
    ],
  },
  {
    id: "chat-archived-1",
    productId: "prod-deleted-demo",
    buyerName: MOCK_CHAT_BUYER_NAME,
    sellerName: "TopSeller99",
    sellerId: "user-topseller",
    isArchived: true,
    isHidden: false,
    fallbackProductTitle: "Discord Nitro 1 месяц",
    createdAt: "2026-02-10T12:00:00.000Z",
    messages: [
      {
        id: "msg-archived-1",
        senderName: "TopSeller99",
        content: "Товар снят с продажи. Спасибо за покупку!",
        createdAt: "2026-02-12T16:00:00.000Z",
        isRead: true,
      },
    ],
  },
  {
    id: "chat-hidden-1",
    productId: "prod-removed-hidden",
    buyerName: MOCK_CHAT_BUYER_NAME,
    sellerName: "PixelTrader",
    sellerId: "user-pixel",
    isArchived: true,
    isHidden: true,
    fallbackProductTitle: "Удалённый лот",
    createdAt: "2026-01-05T08:00:00.000Z",
    messages: [],
  },
];
