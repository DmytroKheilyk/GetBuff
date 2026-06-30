import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type OpenChatButtonProps = {
  orderId: string;
};

export function OpenChatButton({ orderId }: OpenChatButtonProps) {
  return (
    <Button
      asChild
      size="sm"
      className="neon-glow-hover border border-green-500/40 bg-green-500/15 font-semibold text-green-400 transition-all duration-300 hover:bg-green-500/25 hover:text-green-300 hover:shadow-[0_0_18px_rgba(34,197,94,0.35)]"
    >
      <Link href={`/chats?order=${orderId}`}>
        <MessageCircle className="size-4" />
        Открыть чат
      </Link>
    </Button>
  );
}
