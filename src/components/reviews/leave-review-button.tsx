import { MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

type LeaveReviewButtonProps = {
  onClick: () => void;
};

export function LeaveReviewButton({ onClick }: LeaveReviewButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      onClick={onClick}
      className="neon-glow-hover border border-green-500/40 bg-green-500/15 font-semibold text-green-400 transition-all duration-300 hover:bg-green-500/25 hover:text-green-300 hover:shadow-[0_0_18px_rgba(34,197,94,0.35)]"
    >
      <MessageSquarePlus className="size-4" />
      Оставить отзыв
    </Button>
  );
}
