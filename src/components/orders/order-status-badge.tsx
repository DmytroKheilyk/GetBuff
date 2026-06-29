import { Badge } from "@/components/ui/badge";
import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/lib/types/order";
import { cn } from "@/lib/utils";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "font-semibold",
        status === "pending" &&
          "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10",
        status === "completed" &&
          "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/10",
        status === "cancelled" &&
          "border-zinc-600 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800/50"
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
