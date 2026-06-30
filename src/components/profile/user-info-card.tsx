"use client";

import type { User } from "@supabase/supabase-js";
import { Calendar, Camera, Loader2, Mail, Pencil, Wallet, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  ProfileSocialLinks,
  SocialLinkInput,
} from "@/components/profile/profile-social-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/user-context";
import { topUpWallet } from "@/lib/actions/wallet";
import type { SavedProfile } from "@/lib/profile-storage";
import { formatWalletBalance, notifyWalletChanged } from "@/lib/types/wallet";
import { formatUserRegisteredAt, getUserInitial } from "@/lib/user";
import { cn } from "@/lib/utils";

type UserInfoCardProps = {
  user: User;
  balance: number;
};

const fieldClassName = cn(
  "text-neutral-900 placeholder:text-neutral-400",
  "dark:bg-[#14161d] dark:text-neutral-100 dark:placeholder:text-neutral-500"
);

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.78 15.28 9.5 19.5c.38 0 .55-.16.76-.36l1.82-1.74 3.78 2.77c.69.38 1.18.18 1.36-.64l2.48-11.64h.01c.22-1.02-.37-1.42-1.03-1.17L3.6 10.28c-.99.39-.97.94-.17 1.19l4.58 1.43 10.64-6.71c.5-.32.96-.14.58.18"
      />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.93 5.5A16.2 16.2 0 0 0 14.9 4c-.2.36-.43.85-.59 1.23a14.9 14.9 0 0 0-4.62 0C9.53 4.85 9.3 4.36 9.1 4a16.3 16.3 0 0 0-4.03 1.5C2.46 9.36 1.74 13.05 2.08 16.67a16.4 16.4 0 0 0 4.98 2.52c.4-.55.76-1.13 1.07-1.74-.59-.22-1.15-.49-1.68-.81.14-.1.28-.21.41-.32 3.22 1.5 6.71 1.5 9.9 0 .14.11.27.22.41.32-.53.32-1.09.59-1.68.81.31.61.67 1.19 1.07 1.74a16.4 16.4 0 0 0 5-2.52c.43-4.2-.72-7.78-3.01-11.17ZM8.68 14.1c-.95 0-1.73-.87-1.73-1.94 0-1.07.76-1.94 1.73-1.94s1.74.87 1.74 1.94c0 1.07-.77 1.94-1.74 1.94Zm6.64 0c-.95 0-1.73-.87-1.73-1.94 0-1.07.77-1.94 1.73-1.94s1.74.87 1.74 1.94c0 1.07-.77 1.94-1.74 1.94Z"
      />
    </svg>
  );
}

function VkIcon({ className }: { className?: string }) {
  return (
    <span className={cn("text-[11px] font-black leading-none", className)}>VK</span>
  );
}

function ProfileAvatar({
  user,
  avatarBase64,
  isEditing,
  onAvatarChange,
}: {
  user: User;
  avatarBase64: string | null;
  isEditing: boolean;
  onAvatarChange: (dataUrl: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onAvatarChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  const avatarContent = avatarBase64 ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarBase64}
      alt="Аватар профиля"
      className="size-full rounded-full object-cover"
    />
  ) : (
    <span className="text-xl font-bold sm:text-2xl">{getUserInitial(user)}</span>
  );

  if (!isEditing) {
    return (
      <div
        className={cn(
          "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full sm:size-20",
          avatarBase64
            ? "border-2 border-primary/20"
            : "bg-[#4f8cff]/15 text-[#2563eb] dark:bg-primary/20 dark:text-primary"
        )}
      >
        {avatarContent}
      </div>
    );
  }

  return (
    <div className="relative size-16 shrink-0 sm:size-20">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "group/avatar relative flex size-full items-center justify-center overflow-hidden rounded-full",
          avatarBase64
            ? "border-2 border-primary/30"
            : "bg-[#4f8cff]/15 text-[#2563eb] dark:bg-primary/20 dark:text-primary"
        )}
        aria-label="Загрузить аватар"
      >
        {avatarContent}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full",
            "bg-black/45 opacity-0 transition-opacity group-hover/avatar:opacity-100"
          )}
        >
          <Camera className="size-6 text-white" />
        </span>
      </button>
    </div>
  );
}

export function UserInfoCard({ user, balance: initialBalance }: UserInfoCardProps) {
  const { profile, saveProfile } = useUser();
  const [balance, setBalance] = useState(initialBalance);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftProfile, setDraftProfile] = useState<SavedProfile | null>(null);

  const registeredAt = formatUserRegisteredAt(user);
  const savedProfile = profile
    ? {
        nickname: profile.nickname,
        bio: profile.bio,
        avatarBase64: profile.avatarBase64,
        socials: profile.socials,
      }
    : null;

  useEffect(() => {
    if (savedProfile && !isEditing) {
      setDraftProfile(savedProfile);
    }
  }, [savedProfile, isEditing]);

  async function handleTopUp() {
    setTopUpLoading(true);
    const result = await topUpWallet();
    setTopUpLoading(false);

    if (result.balance !== undefined) {
      setBalance(result.balance);
      notifyWalletChanged();
    }
  }

  function startEditing() {
    if (!savedProfile) return;
    setDraftProfile(savedProfile);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (savedProfile) {
      setDraftProfile(savedProfile);
    }
    setIsEditing(false);
  }

  function saveCurrentProfile() {
    if (!draftProfile || !savedProfile) return;

    const nextProfile: SavedProfile = {
      nickname: draftProfile.nickname.trim() || savedProfile.nickname,
      bio: draftProfile.bio.trim(),
      avatarBase64: draftProfile.avatarBase64,
      socials: {
        telegram: draftProfile.socials.telegram.trim(),
        discord: draftProfile.socials.discord.trim(),
        vk: draftProfile.socials.vk.trim(),
        youtube: draftProfile.socials.youtube.trim(),
      },
    };

    saveProfile(nextProfile);
    setDraftProfile(nextProfile);
    setIsEditing(false);
  }

  if (!savedProfile || !draftProfile) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#1c1e27] sm:p-8">
        <div className="h-28 animate-pulse rounded-xl bg-muted/50" />
      </section>
    );
  }

  const displayProfile = isEditing ? draftProfile : savedProfile;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#1c1e27] sm:p-8">
      <div className="mb-5 flex items-center justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={cancelEditing}
              className="rounded-xl border-neutral-200 dark:border-neutral-700"
            >
              Отмена
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={saveCurrentProfile}
              className="rounded-xl"
            >
              Сохранить
            </Button>
          </>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={startEditing}
            className="rounded-xl border-neutral-200 dark:border-neutral-700"
          >
            <Pencil className="size-4" />
            Редактировать профиль
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-5 sm:flex-row sm:items-start">
          <ProfileAvatar
            user={user}
            avatarBase64={displayProfile.avatarBase64}
            isEditing={isEditing}
            onAvatarChange={(dataUrl) =>
              setDraftProfile((prev) =>
                prev ? { ...prev, avatarBase64: dataUrl } : prev
              )
            }
          />

          <div className="min-w-0 flex-1 text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="profile-nickname"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Никнейм
                  </label>
                  <Input
                    id="profile-nickname"
                    value={draftProfile.nickname}
                    onChange={(event) =>
                      setDraftProfile((prev) =>
                        prev ? { ...prev, nickname: event.target.value } : prev
                      )
                    }
                    placeholder="Ваш никнейм"
                    className={cn("h-10 rounded-xl", fieldClassName)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-bio"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    О себе
                  </label>
                  <Textarea
                    id="profile-bio"
                    value={draftProfile.bio}
                    onChange={(event) =>
                      setDraftProfile((prev) =>
                        prev ? { ...prev, bio: event.target.value } : prev
                      )
                    }
                    placeholder="Расскажите о себе (описание профиля)..."
                    rows={4}
                    className={cn("min-h-24 rounded-xl", fieldClassName)}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SocialLinkInput
                    icon={TelegramIcon}
                    label="Telegram"
                    value={draftProfile.socials.telegram}
                    onChange={(value) =>
                      setDraftProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              socials: { ...prev.socials, telegram: value },
                            }
                          : prev
                      )
                    }
                    placeholder="@username или t.me/..."
                    iconClassName="text-[#229ED9]"
                  />
                  <SocialLinkInput
                    icon={DiscordIcon}
                    label="Discord"
                    value={draftProfile.socials.discord}
                    onChange={(value) =>
                      setDraftProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              socials: { ...prev.socials, discord: value },
                            }
                          : prev
                      )
                    }
                    placeholder="username или discord.gg/..."
                    iconClassName="text-[#5865F2]"
                  />
                  <SocialLinkInput
                    icon={VkIcon}
                    label="VK"
                    value={draftProfile.socials.vk}
                    onChange={(value) =>
                      setDraftProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              socials: { ...prev.socials, vk: value },
                            }
                          : prev
                      )
                    }
                    placeholder="vk.com/username"
                    iconClassName="text-[#0077FF]"
                  />
                  <SocialLinkInput
                    icon={Youtube}
                    label="YouTube"
                    value={draftProfile.socials.youtube}
                    onChange={(value) =>
                      setDraftProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              socials: { ...prev.socials, youtube: value },
                            }
                          : prev
                      )
                    }
                    placeholder="@channel или youtube.com/..."
                    iconClassName="text-[#FF0000]"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                  {savedProfile.nickname}
                </h1>

                {savedProfile.bio ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {savedProfile.bio}
                  </p>
                ) : null}

                <ProfileSocialLinks socials={savedProfile.socials} />
              </>
            )}

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm sm:justify-start">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-muted-foreground">{user.email}</span>
              </div>

              {registeredAt && (
                <div className="flex items-center justify-center gap-2 text-sm sm:justify-start">
                  <Calendar className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Регистрация: {registeredAt}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-[#14161d] sm:min-w-[220px] sm:items-end">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Wallet className="size-4" />
            Баланс кошелька
          </div>
          <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatWalletBalance(balance)}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={topUpLoading}
            onClick={handleTopUp}
            className="rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {topUpLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Пополнить"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
