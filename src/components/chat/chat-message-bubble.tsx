"use client";

import {
  CHAT_PHISHING_WARNING_TEXT,
  containsSuspiciousExternalLink,
} from "@/lib/chat-link-safety";
import { formatMessageTime } from "@/lib/chat-ui";
import {
  isSystemChatMessage,
  type ChatMessage,
} from "@/lib/types/message";
import { cn } from "@/lib/utils";

type ChatMessageBubbleProps = {
  message: ChatMessage;
  isOwn: boolean;
};

function SystemMessageRow({ message }: { message: ChatMessage }) {
  return (
    <div className="my-4 flex w-full justify-center px-4">
      <div className="max-w-[80%] rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-center text-xs font-medium text-neutral-500 dark:border-neutral-800/60 dark:bg-[#1c1e27] dark:text-neutral-400">
        {message.content}
      </div>
    </div>
  );
}

function UserMessageRow({ message, isOwn }: ChatMessageBubbleProps) {
  const hasImage = Boolean(message.image);
  const hasText = message.content.trim().length > 0;
  const imageOnly = hasImage && !hasText;
  const hasSuspiciousLink = containsSuspiciousExternalLink(message.content);
  const time = formatMessageTime(message.createdAt);

  return (
    <div
      className={cn(
        "flex w-full",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative flex w-fit flex-col overflow-hidden rounded-2xl",
          hasImage
            ? "max-w-[320px] p-0 sm:max-w-[360px]"
            : "max-w-[85%] p-3 sm:max-w-[70%]",
          isOwn
            ? "bg-blue-600 text-white"
            : "bg-neutral-100 text-neutral-900 dark:bg-[#1c1e27] dark:text-neutral-100"
        )}
      >
        {hasImage && message.image && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.image}
              alt="Вложение в чате"
              className="block h-auto max-h-[240px] w-full object-cover"
            />
            {imageOnly && (
              <span className="absolute bottom-2 right-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
                {time}
              </span>
            )}
          </div>
        )}

        {hasText && (
          <div
            className={cn(
              hasImage ? "p-3 pt-2" : "",
              "text-sm leading-relaxed"
            )}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
            {hasSuspiciousLink && (
              <p
                className={cn(
                  "mt-2 rounded-md border p-2 text-[11px] font-medium leading-tight",
                  "border-amber-200 bg-amber-50 text-amber-700",
                  "dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400"
                )}
              >
                {CHAT_PHISHING_WARNING_TEXT}
              </p>
            )}
            <div className="mt-1 text-right text-[10px] opacity-50">{time}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatMessageBubble({ message, isOwn }: ChatMessageBubbleProps) {
  if (isSystemChatMessage(message)) {
    return <SystemMessageRow message={message} />;
  }

  return <UserMessageRow message={message} isOwn={isOwn} />;
}
