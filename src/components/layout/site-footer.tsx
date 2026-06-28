import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <BrandLogo className="text-base" />
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} P2P-маркетплейс игровых ценностей
          </p>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/offer"
            className="text-zinc-500 transition-all duration-300 hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
          >
            Оферта
          </Link>
          <Link
            href="/privacy"
            className="text-zinc-500 transition-all duration-300 hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
          >
            Политика конфиденциальности
          </Link>
        </nav>
      </div>
    </footer>
  );
}
