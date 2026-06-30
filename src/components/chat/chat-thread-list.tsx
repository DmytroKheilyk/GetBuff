"use client";

import { Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  formatChatTime,
  getInitial,
  truncatePreview,
} from "@/lib/chat-ui";
import type { ChatThread } from "@/lib/types/chat";
import { cn } from "@/lib/utils";

type ChatThreadListProps = {
  threads: ChatThread[];
  filteredThreads: ChatThread[];
  selectedOrderId: string | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelect: (orderId: string) => void;
};

export function ChatThreadList({
  threads,
  filteredThreads,
  selectedOrderId,
  searchQuery,
  onSearchChange,
  onSelect,
}: ChatThreadListProps) {
  return (
    <div className="flex h-full flex-col bg-[#12131a]">
      <div className="border-b border-border px-4 py-4">
        <h1 className="text-lg font-bold text-[#e8eaef]">Мои сообщения</h1>
        <div className="relative mt-3">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по чатам..."
            className="h-10 rounded-xl border-border bg-[#1c1e27] pl-10 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {threads.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-semibold text-[#e8eaef]">
              Пока нет диалогов
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Чаты появятся после оформления заказа
            </p>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">Ничего не найдено</p>
          </div>
        ) : (
          <ul className="py-2">
            {filteredThreads.map((thread) => {
              const isActive = thread.orderId === selectedOrderId;

              return (
                <li key={thread.orderId}>
                  <button
                    type="button"
                    onClick={() => onSelect(thread.orderId)}
                    className={cn(
                      "relative flex w-full gap-3 px-4 py-3 text-left transition-colors",
                      "hover:bg-[#1c1e27]/80",
                      isActive && "bg-[#1c1e27]"
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#4f8cff]" />
                    )}

                    <Avatar className="size-11 shrink-0 border border-border">
                      <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">
                        {getInitial(thread.counterpartName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#e8eaef]">
                            {thread.counterpartName}
                          </p>
                          {thread.isOnline && (
                            <Badge className="mt-1 border-0 bg-[#22c55e]/15 px-1.5 py-0 text-[10px] font-semibold text-[#22c55e] hover:bg-[#22c55e]/15">
                              В сети
                            </Badge>
                          )}
                        </div>
                        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                          {formatChatTime(thread.lastMessageAt)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {truncatePreview(thread.lastMessagePreview)}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
