"use client";

import Link from "next/link";

import { resolveSocialHref, type SocialLinks } from "@/lib/profile-storage";
import { cn } from "@/lib/utils";

type ProfileSocialLinksProps = {
  socials: SocialLinks;
  className?: string;
};

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

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.58 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.43A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"
      />
    </svg>
  );
}

const SOCIAL_CONFIG = [
  {
    key: "telegram" as const,
    label: "Telegram",
    Icon: TelegramIcon,
    className: "bg-[#229ED9]/15 text-[#229ED9] hover:bg-[#229ED9]/25",
  },
  {
    key: "discord" as const,
    label: "Discord",
    Icon: DiscordIcon,
    className: "bg-[#5865F2]/15 text-[#5865F2] hover:bg-[#5865F2]/25",
  },
  {
    key: "vk" as const,
    label: "VK",
    Icon: VkIcon,
    className: "bg-[#0077FF]/15 text-[#0077FF] hover:bg-[#0077FF]/25",
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    Icon: YouTubeIcon,
    className: "bg-[#FF0000]/15 text-[#FF0000] hover:bg-[#FF0000]/25",
  },
];

export function ProfileSocialLinks({ socials, className }: ProfileSocialLinksProps) {
  const activeLinks = SOCIAL_CONFIG.flatMap(({ key, label, Icon, className: itemClassName }) => {
    const href = resolveSocialHref(key, socials[key]);
    if (!href) return [];

    return [{ key, label, href, Icon, itemClassName }];
  });

  if (activeLinks.length === 0) return null;

  return (
    <div className={cn("mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start", className)}>
      {activeLinks.map(({ key, label, href, Icon, itemClassName }) => (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-xl transition-colors",
            itemClassName
          )}
        >
          <Icon className="size-5" />
        </Link>
      ))}
    </div>
  );
}

export function SocialLinkInput({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  iconClassName?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon
          className={cn(
            "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
            iconClassName
          )}
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-xl border border-input bg-white pl-10 pr-3 text-sm",
            "text-neutral-900 placeholder:text-neutral-400 outline-none",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
            "dark:bg-[#14161d] dark:text-neutral-100 dark:placeholder:text-neutral-500"
          )}
        />
      </div>
    </div>
  );
}
