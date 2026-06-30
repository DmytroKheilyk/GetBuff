import type { User } from "@supabase/supabase-js";

export const PROFILE_CHANGED_EVENT = "getbuff:profile-changed";

export type SocialLinks = {
  telegram: string;
  discord: string;
  vk: string;
  youtube: string;
};

export type SavedProfile = {
  nickname: string;
  bio: string;
  avatarBase64: string | null;
  socials: SocialLinks;
};

export type UserProfile = SavedProfile & {
  email: string;
};

const EMPTY_SOCIALS: SocialLinks = {
  telegram: "",
  discord: "",
  vk: "",
  youtube: "",
};

function getProfileStorageKey(userId: string) {
  return `getbuff-profile-${userId}`;
}

export function getDefaultNickname(user: User): string {
  const fromMeta =
    user.user_metadata?.nickname ?? user.user_metadata?.full_name;

  if (typeof fromMeta === "string" && fromMeta.trim()) {
    return fromMeta.trim();
  }

  const email = user.email ?? "";
  const localPart = email.split("@")[0]?.trim();
  return localPart || "Пользователь";
}

export function createDefaultProfile(user: User): SavedProfile {
  return {
    nickname: getDefaultNickname(user),
    bio: "",
    avatarBase64: null,
    socials: { ...EMPTY_SOCIALS },
  };
}

function normalizeSocials(value: Partial<SocialLinks> | undefined): SocialLinks {
  return {
    telegram: typeof value?.telegram === "string" ? value.telegram : "",
    discord: typeof value?.discord === "string" ? value.discord : "",
    vk: typeof value?.vk === "string" ? value.vk : "",
    youtube: typeof value?.youtube === "string" ? value.youtube : "",
  };
}

export function loadSavedProfile(userId: string): SavedProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(getProfileStorageKey(userId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SavedProfile>;
    if (typeof parsed.nickname !== "string") return null;

    return {
      nickname: parsed.nickname,
      bio: typeof parsed.bio === "string" ? parsed.bio : "",
      avatarBase64:
        typeof parsed.avatarBase64 === "string" ? parsed.avatarBase64 : null,
      socials: normalizeSocials(parsed.socials),
    };
  } catch {
    return null;
  }
}

export function persistSavedProfile(userId: string, profile: SavedProfile) {
  localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(profile));
}

export function notifyProfileChanged() {
  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT));
}

export function buildUserProfile(user: User, profile: SavedProfile): UserProfile {
  return {
    ...profile,
    email: user.email ?? "",
  };
}

export function resolveSocialHref(
  network: keyof SocialLinks,
  value: string
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const handle = trimmed.replace(/^@/, "");

  switch (network) {
    case "telegram":
      return `https://t.me/${handle}`;
    case "discord":
      return trimmed.includes("discord.")
        ? `https://${handle}`
        : `https://discord.gg/${handle}`;
    case "vk":
      return trimmed.includes("vk.com")
        ? `https://${handle}`
        : `https://vk.com/${handle}`;
    case "youtube":
      return trimmed.includes("youtube.com") || trimmed.includes("youtu.be")
        ? `https://${handle}`
        : `https://youtube.com/@${handle}`;
    default:
      return trimmed;
  }
}
