import { redirect } from "next/navigation";

import { ChatsPageContent } from "@/components/chat/chats-page-content";
import { SiteHeader } from "@/components/layout/site-header";
import {
  fetchOrderMessages,
  fetchUserChatThreads,
} from "@/lib/queries/chat";
import { createClient } from "@/lib/supabase";
import type { ChatMessage } from "@/lib/types/message";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Мои сообщения — GetBuff.store",
  description: "Чаты с покупателями и продавцами на GetBuff.store",
};

type ChatsPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function ChatsPage({ searchParams }: ChatsPageProps) {
  const { order: initialOrderId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
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
        threads={threads}
        initialMessagesByOrder={initialMessagesByOrder}
        initialOrderId={validInitialOrderId}
      />
    </div>
  );
}
