# GetBuff.store — правила разработки

## О проекте

**GetBuff.store** — P2P-маркетплейс виртуальных товаров для геймеров.

## Стек и соглашения

### TypeScript

- Пишем код **строго на TypeScript** (`.ts`, `.tsx`).
- JavaScript-файлы (`.js`, `.jsx`) не используем.

### Next.js (App Router)

- Маршруты и страницы — в `src/app/`.
- По умолчанию используем **Server Components**.
- Мутации данных (создание, обновление, удаление) — через **Server Actions** с директивой `"use server"`.
- Клиентские компоненты (`"use client"`) — только когда нужны хуки, браузерные API или интерактивность.

### UI — shadcn/ui

- Базовые UI-компоненты берём из **shadcn/ui** (`@/components/ui/*`).
- Стилизация — через **Tailwind CSS** и **CSS-переменные** темы (Zinc, dark mode).
- Кастомные блоки выносим в `src/components/`.

### Импорты

- Используем алиас `@/*` (например, `@/components/ui/button`, `@/lib/utils`).

### Структура

```
src/
  app/           — страницы и layout
  components/    — переиспользуемые компоненты
    ui/          — shadcn/ui
    layout/      — шапка, футер
    home/        — блоки главной и т.д.
  lib/           — утилиты, мок-данные, server actions
```
