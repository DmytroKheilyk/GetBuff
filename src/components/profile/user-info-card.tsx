import type { User } from "@supabase/supabase-js";
import { Calendar, Mail } from "lucide-react";

import { formatUserRegisteredAt, getUserInitial } from "@/lib/user";
import { cn } from "@/lib/utils";

type UserInfoCardProps = {
  user: User;
};

export function UserInfoCard({ user }: UserInfoCardProps) {
  const registeredAt = formatUserRegisteredAt(user);

  return (
    <section className="glass-panel rounded-2xl p-6 sm:p-8">
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-green-400">
        ◆ Профиль
      </p>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div
          className={cn(
            "flex size-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-black",
            "border border-green-500/30 bg-green-500/10 text-green-400",
            "shadow-[0_0_24px_rgba(34,197,94,0.2)]"
          )}
        >
          {getUserInitial(user)}
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h1 className="text-xl font-black text-white sm:text-2xl">
            Личный кабинет
          </h1>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm sm:justify-start">
              <Mail className="size-4 shrink-0 text-green-500/70" />
              <span className="truncate text-zinc-300">{user.email}</span>
            </div>

            {registeredAt && (
              <div className="flex items-center justify-center gap-2 text-sm sm:justify-start">
                <Calendar className="size-4 shrink-0 text-green-500/70" />
                <span className="text-zinc-500">
                  Регистрация:{" "}
                  <span className="text-zinc-400">{registeredAt}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
