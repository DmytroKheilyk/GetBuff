"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/user-context";
import { cn } from "@/lib/utils";

type SecurityAction = "email" | "password" | null;

const fieldClassName = cn(
  "h-10 rounded-xl text-neutral-900 placeholder:text-neutral-400",
  "dark:bg-[#14161d] dark:text-neutral-100 dark:placeholder:text-neutral-500"
);

function SuccessToast({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 right-6 z-[100] max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl",
        "animate-in fade-in slide-in-from-bottom-4 bg-emerald-600"
      )}
    >
      {message}
    </div>
  );
}

export function ProfileSecuritySettings() {
  const { profile } = useUser();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<SecurityAction>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const currentEmail = profile?.email ?? "ваш email";

  useEffect(() => {
    if (!toastVisible) return;

    const timer = window.setTimeout(() => setToastVisible(false), 3200);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  function openVerification(action: SecurityAction) {
    setPendingAction(action);
    setVerificationCode("");
    setDialogOpen(true);
  }

  function handleRequestEmailChange() {
    if (!newEmail.trim()) return;
    openVerification("email");
  }

  function handleRequestPasswordChange() {
    if (!newPassword.trim() || newPassword !== confirmPassword) return;
    openVerification("password");
  }

  function handleConfirmCode() {
    const code = verificationCode.trim();
    if (!/^\d{6}$/.test(code)) return;

    setDialogOpen(false);
    setVerificationCode("");
    setPendingAction(null);

    if (pendingAction === "email") {
      setNewEmail("");
    }

    if (pendingAction === "password") {
      setNewPassword("");
      setConfirmPassword("");
    }

    setToastVisible(true);
  }

  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#1c1e27]">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Изменить Email
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Текущий адрес: {currentEmail}
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="new-email" className="text-xs text-muted-foreground">
                Новый email
              </Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="new.email@example.com"
                className={cn("mt-1.5", fieldClassName)}
              />
            </div>
            <Button
              type="button"
              onClick={handleRequestEmailChange}
              disabled={!newEmail.trim()}
              className="rounded-xl"
            >
              Изменить
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#1c1e27]">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Изменить пароль
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Используйте надёжный пароль длиной не менее 8 символов.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="new-password" className="text-xs text-muted-foreground">
                Новый пароль
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="••••••••"
                className={cn("mt-1.5", fieldClassName)}
              />
            </div>
            <div>
              <Label
                htmlFor="confirm-password"
                className="text-xs text-muted-foreground"
              >
                Подтвердите пароль
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                className={cn("mt-1.5", fieldClassName)}
              />
            </div>
            {confirmPassword.length > 0 && !passwordsMatch ? (
              <p className="text-xs text-destructive">Пароли не совпадают</p>
            ) : null}
            <Button
              type="button"
              onClick={handleRequestPasswordChange}
              disabled={!passwordsMatch}
              className="rounded-xl"
            >
              Изменить
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#1c1e27]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Двухфакторная аутентификация (2FA)
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Дополнительная защита входа в аккаунт
              </p>
            </div>
            <Switch disabled checked={false} aria-label="2FA скоро" />
          </div>
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-muted-foreground dark:border-neutral-800 dark:bg-[#14161d]">
            Скоро: защита аккаунта через Google Authenticator
          </div>
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#1c1e27] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-white">
              Подтверждение изменений
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Для подтверждения изменений мы отправили 6-значный код на вашу
              текущую почту{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                {currentEmail}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="verification-code" className="text-xs text-muted-foreground">
              Код подтверждения
            </Label>
            <Input
              id="verification-code"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(event) =>
                setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              className={cn("h-11 text-center text-lg tracking-[0.35em]", fieldClassName)}
            />
          </div>

          <DialogFooter className="border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-[#14161d]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl"
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={handleConfirmCode}
              disabled={verificationCode.trim().length !== 6}
              className="rounded-xl"
            >
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SuccessToast message="Данные успешно изменены!" visible={toastVisible} />
    </>
  );
}
