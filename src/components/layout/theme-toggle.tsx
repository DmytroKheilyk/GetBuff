"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="hidden items-center gap-2 rounded-full bg-muted/50 p-1 px-2 sm:flex"
        aria-hidden="true"
      >
        <div className="size-4 shrink-0 rounded-full bg-neutral-200 opacity-50 dark:bg-neutral-700" />
        <div className="h-[18.4px] w-8 shrink-0 rounded-full bg-neutral-200 opacity-50 dark:bg-neutral-800" />
        <div className="size-4 shrink-0 rounded-full bg-neutral-200 opacity-50 dark:bg-neutral-700" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  function handleToggle(checked: boolean) {
    setTheme(checked ? "dark" : "light");
  }

  return (
    <div className="hidden items-center gap-2 rounded-full bg-muted/50 p-1 px-2 sm:flex">
      <Sun
        className={cn(
          "size-4",
          isDark ? "text-muted-foreground" : "text-primary"
        )}
      />
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        aria-label={
          isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"
        }
        className="data-[state=checked]:bg-primary"
      />
      <Moon
        className={cn(
          "size-4",
          isDark ? "text-primary" : "text-muted-foreground"
        )}
      />
    </div>
  );
}
