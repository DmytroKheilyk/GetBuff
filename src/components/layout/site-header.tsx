import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 sm:gap-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          <span className="text-foreground">Get</span>
          <span className="text-emerald-400">Buff</span>
        </Link>

        <div className="relative mx-auto hidden max-w-md flex-1 md:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск игр..."
            className="border-border/60 bg-muted/40 pl-9 focus-visible:ring-emerald-500/30"
          />
        </div>

        <Button
          variant="outline"
          className="ml-auto border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
        >
          Войти
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск игр..."
            className="border-border/60 bg-muted/40 pl-9 focus-visible:ring-emerald-500/30"
          />
        </div>
      </div>
    </header>
  );
}
