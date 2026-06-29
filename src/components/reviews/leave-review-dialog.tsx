"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { StarRatingPicker } from "@/components/reviews/star-rating-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/lib/actions/create-review";
import type { Order } from "@/lib/types/order";

type LeaveReviewDialogProps = {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: (orderId: string, rating: number) => void;
};

const fieldClassName =
  "border-zinc-800/80 bg-black/40 focus-visible:border-green-500/40 focus-visible:ring-green-500/20";

export function LeaveReviewDialog({
  order,
  open,
  onOpenChange,
  onSubmitted,
}: LeaveReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setRating(0);
    setComment("");
    setError(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!order || rating === 0) {
      setError("Выберите оценку от 1 до 5 звёзд");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await createReview(order.id, rating, comment);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSubmitted(order.id, result.rating ?? rating);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-panel border border-green-500/20 bg-zinc-950/95 shadow-[0_0_40px_rgba(34,197,94,0.12)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
            <Sparkles className="size-5 text-green-400" />
            Оставить отзыв
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            {order
              ? `Оцените сделку с ${order.sellerName}`
              : "Поделитесь впечатлением о покупке"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label className="text-zinc-400">Ваша оценка</Label>
            <StarRatingPicker
              value={rating}
              onChange={setRating}
              disabled={loading}
            />
            {rating > 0 && (
              <p className="animate-in fade-in text-xs text-amber-400/80">
                {rating === 5
                  ? "Отлично!"
                  : rating >= 4
                    ? "Хорошо"
                    : rating >= 3
                      ? "Нормально"
                      : rating >= 2
                        ? "Так себе"
                        : "Плохо"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-comment" className="text-zinc-400">
              Комментарий
            </Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите, как прошла сделка..."
              rows={4}
              disabled={loading}
              className={fieldClassName}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || rating === 0 || !comment.trim()}
            className="neon-glow-hover w-full border border-green-500/30 bg-green-500 font-bold text-black transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)] disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Отправка...
              </>
            ) : (
              "Отправить отзыв"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
