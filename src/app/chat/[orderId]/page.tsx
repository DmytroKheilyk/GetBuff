import { redirect } from "next/navigation";

import { OrderChatRoom } from "@/components/chat/order-chat-room";
import { SiteHeader } from "@/components/layout/site-header";
import {
  fetchChatContext,
  fetchOrderMessages,
} from "@/lib/queries/chat";
import { createClient } from "@/lib/supabase";

type ChatPageProps = {
  params: Promise<{ orderId: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ChatPageProps) {
  const { orderId } = await params;
  return {
    title: `Чат заказа — GetBuff.store`,
    description: `Чат по заказу ${orderId}`,
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { orderId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const context = await fetchChatContext(orderId, user);

  if (!context) {
    redirect("/");
  }

  const messages = await fetchOrderMessages(orderId);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <OrderChatRoom context={context} initialMessages={messages} />
    </div>
  );
}
