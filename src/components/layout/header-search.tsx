"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type HeaderSearchProps = {
  className?: string;
};

export function HeaderSearch({ className }: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-xl flex-1", className)}
    >
      <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#6b7289]" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск игр, ключей и услуг..."
        className={cn(
          "h-11 w-full rounded-2xl border border-[#2a2d38] bg-[#23262f] pl-11 pr-4",
          "text-sm text-[#e8eaef] placeholder:text-[#6b7289]",
          "transition-all duration-200 outline-none",
          "hover:border-[#353945] hover:bg-[#282b36]",
          "focus:border-[#4f8cff]/50 focus:bg-[#282b36] focus:ring-2 focus:ring-[#4f8cff]/15"
        )}
        aria-label="Поиск игр, ключей и услуг"
      />
    </form>
  );
}
