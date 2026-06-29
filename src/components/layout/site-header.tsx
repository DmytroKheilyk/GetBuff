import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { HeaderAuth } from "@/components/layout/header-auth";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center gap-3 px-4 sm:gap-6">
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-90"
          aria-label="GetBuff — на главную"
        >
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/10 hover:text-green-300"
          >
            Главная
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
