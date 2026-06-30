import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <BrandLogo className="text-base" />
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            © {new Date().getFullYear()} P2P-маркетплейс игровых ценностей
          </p>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/offer"
            className="text-gray-500 transition-all duration-300 hover:text-green-500 dark:hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
          >
            Оферта
          </Link>
          <Link
            href="/privacy"
            className="text-gray-500 transition-all duration-300 hover:text-green-500 dark:hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
          >
            Политика конфиденциальности
          </Link>
        </nav>
      </div>
    </footer>
  );
}
