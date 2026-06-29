import Link from "next/link";
import { Search } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { HeaderAuth } from "@/components/layout/header-auth";
import { Input } from "@/components/ui/input";

const inputClassName =
  "border-zinc-800/80 bg-black/40 pl-9 focus-visible:border-green-500/40 focus-visible:ring-green-500/20";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 sm:gap-6">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
          <BrandLogo />
        </Link>

        <div className="relative mx-auto hidden max-w-md flex-1 md:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-green-500/50" />
          <Input
            type="search"
            placeholder="Поиск игр..."
            className={inputClassName}
          />
        </div>

        <HeaderAuth />
      </div>

      <div className="container mx-auto px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-green-500/50" />
          <Input
            type="search"
            placeholder="Поиск игр..."
            className={inputClassName}
          />
        </div>
      </div>
    </header>
  );
}
