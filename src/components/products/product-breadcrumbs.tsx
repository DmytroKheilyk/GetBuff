import Link from "next/link";
import { ChevronRight } from "lucide-react";

type ProductBreadcrumbsProps = {
  gameTitle: string;
  gameSlug: string;
  categoryLabel: string;
};

export function ProductBreadcrumbs({
  gameTitle,
  gameSlug,
  categoryLabel,
}: ProductBreadcrumbsProps) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm"
    >
      <Link href="/" className="transition-colors hover:text-[#e8eaef]">
        Главная
      </Link>
      <ChevronRight className="size-3.5 shrink-0 opacity-50" />
      <Link
        href={`/games/${gameSlug}`}
        className="transition-colors hover:text-[#e8eaef]"
      >
        Каталог
      </Link>
      <ChevronRight className="size-3.5 shrink-0 opacity-50" />
      <Link
        href={`/games/${gameSlug}`}
        className="transition-colors hover:text-[#e8eaef]"
      >
        {gameTitle}
      </Link>
      <ChevronRight className="size-3.5 shrink-0 opacity-50" />
      <span className="font-medium text-[#e8eaef]">{categoryLabel}</span>
    </nav>
  );
}
