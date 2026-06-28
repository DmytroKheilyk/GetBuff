import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-background/80">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} GetBuff.store — P2P-маркетплейс игровых
          ценностей
        </p>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/offer"
            className="text-muted-foreground transition-colors hover:text-emerald-400"
          >
            Оферта
          </Link>
          <Link
            href="/privacy"
            className="text-muted-foreground transition-colors hover:text-emerald-400"
          >
            Политика конфиденциальности
          </Link>
        </nav>
      </div>
    </footer>
  );
}
