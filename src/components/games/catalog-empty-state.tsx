import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type CatalogEmptyStateProps = {
  variant: "game" | "category";
  gameTitle?: string;
};

export function CatalogEmptyState({
  variant,
  gameTitle,
}: CatalogEmptyStateProps) {
  if (variant === "game") {
    return (
      <div className="glass-panel rounded-2xl px-6 py-16 text-center">
        <p className="text-xl font-black text-white">
          Лотов пока нет
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
          {gameTitle
            ? `Станьте первым продавцом ${gameTitle}! Выставьте товар — он сразу появится в этом каталоге.`
            : "Станьте первым продавцом этой игры! Выставьте товар — он сразу появится в каталоге."}
        </p>
        <Button
          asChild
          className="neon-glow-hover mt-8 border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
        >
          <Link href="/offers/create">
            <Plus className="size-4" />
            Выставить первый товар
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl px-6 py-14 text-center">
      <p className="text-lg font-bold text-white">
        В этой категории лотов нет
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Попробуйте другую категорию или выставьте свой лот
      </p>
      <Button
        asChild
        variant="outline"
        className="neon-glow-hover mt-6 border-green-500/30 text-green-400 hover:bg-green-500/10"
      >
        <Link href="/offers/create">
          <Plus className="size-4" />
          Создать лот
        </Link>
      </Button>
    </div>
  );
}
