import { redirect } from "next/navigation";

import { MockChatsPageClient } from "@/app/chats/mock-chats-page-client";
import { ChatsPageContent } from "@/components/chat/chats-page-content";
import { SiteHeader } from "@/components/layout/site-header";
import { MOCK_CHAT_BUYER_NAME, USE_MOCK_DATA } from "@/lib/mock-data";
import {
  fetchOrderMessages,
  fetchUserChatThreads,
} from "@/lib/queries/chat";
import { createClient } from "@/lib/supabase";
import { getSellerName } from "@/lib/user";
import type { ChatMessage } from "@/lib/types/message";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Мои сообщения — GetBuff.store",
  description: "Чаты с покупателями и продавцами на GetBuff.store",
};

type ChatsPageProps = {
  searchParams: Promise<{ order?: string; product?: string }>;
};

export default async function ChatsPage({ searchParams }: ChatsPageProps) {
  const { order: initialOrderId, product: initialProductId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  if (USE_MOCK_DATA) {
    const currentUserName = user.email ?? MOCK_CHAT_BUYER_NAME;

    return (
      <div className="flex min-h-screen flex-col bg-white text-foreground dark:bg-[#0e1015]">
        <SiteHeader />
        <MockChatsPageClient
          currentUserName={currentUserName}
          initialOrderId={initialOrderId ?? null}
          initialProductId={initialProductId ?? null}
        />
      </div>
    );
  }

  const threads = await fetchUserChatThreads(user);
  const validInitialOrderId =
    initialOrderId &&
    threads.some((thread) => thread.orderId === initialOrderId)
      ? initialOrderId
      : null;

  const initialMessagesByOrder: Record<string, ChatMessage[]> = {};
  const preloadOrderIds = [
    ...(validInitialOrderId ? [validInitialOrderId] : []),
    ...threads
      .slice(0, 4)
      .map((thread) => thread.orderId)
      .filter((orderId) => orderId !== validInitialOrderId),
  ].slice(0, 5);

  await Promise.all(
    preloadOrderIds.map(async (orderId) => {
      initialMessagesByOrder[orderId] = await fetchOrderMessages(orderId);
    })
  );

  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground dark:bg-[#0e1015]">
      <SiteHeader />
      <ChatsPageContent
        currentUserName={getSellerName(user)}
        threads={threads}
        initialMessagesByOrder={initialMessagesByOrder}
        initialOrderId={validInitialOrderId}
      />
    </div>
  );
}
