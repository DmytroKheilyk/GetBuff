"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;

  function handleToggle(checked: boolean) {
    setTheme(checked ? "dark" : "light");
  }

  return (
    <div className="hidden items-center gap-2 rounded-full bg-muted/50 p-1 px-2 sm:flex">
      <Sun
        className={cn(
          "size-4 transition-colors",
          isDark ? "text-muted-foreground" : "text-primary"
        )}
      />
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        disabled={!mounted}
        aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
        className="data-[state=checked]:bg-primary"
      />
      <Moon
        className={cn(
          "size-4 transition-colors",
          isDark ? "text-primary" : "text-muted-foreground"
        )}
      />
    </div>
  );
}
