import type { User } from "@supabase/supabase-js";

export function getSellerName(user: User): string {
  return user.email ?? user.id;
}

export function getUserInitial(user: User): string {
  const email = user.email ?? "";
  return email.charAt(0).toUpperCase() || "?";
}

export function formatUserRegisteredAt(user: User): string | null {
  if (!user.created_at) return null;
  return new Date(user.created_at).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
