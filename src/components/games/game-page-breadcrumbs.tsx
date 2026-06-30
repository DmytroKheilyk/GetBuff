import Link from "next/link";
import { ChevronRight } from "lucide-react";

type GamePageBreadcrumbsProps = {
  gameTitle: string;
};

export function GamePageBreadcrumbs({ gameTitle }: GamePageBreadcrumbsProps) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm"
    >
      <Link href="/" className="transition-colors hover:text-[#e8eaef]">
        Главная
      </Link>
      <ChevronRight className="size-3.5 opacity-50" />
      <span className="text-muted-foreground">Каталог</span>
      <ChevronRight className="size-3.5 opacity-50" />
      <span className="font-medium text-[#e8eaef]">{gameTitle}</span>
    </nav>
  );
}
