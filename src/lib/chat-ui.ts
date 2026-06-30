const GAME_POSTER_BY_SLUG: Record<string, string> = {
  cs2: "/home/showcase/cs2.jpg",
  "dota-2": "/home/showcase/dota2.jpg",
  roblox: "/home/showcase/roblox.jpg",
  "gta-v": "/home/categories/gtavi.png",
};

export function getGamePosterSrc(slug: string): string | null {
  if (!slug) return null;
  return GAME_POSTER_BY_SLUG[slug] ?? null;
}

export function formatChatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Вчера";
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function truncatePreview(text: string, max = 48): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trim()}…`;
}
