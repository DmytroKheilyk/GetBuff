"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const fieldClassName =
  "border-zinc-800/80 bg-black/40 focus-visible:border-green-500/40 focus-visible:ring-green-500/20";

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(true);
  const [marketingAccepted, setMarketingAccepted] = useState(false);

  const passwordsMatch =
    registerPassword.length > 0 &&
    registerPassword === registerPasswordConfirm;

  const canRegister =
    legalAccepted &&
    registerEmail.length > 0 &&
    registerPassword.length >= 6 &&
    passwordsMatch;

  function resetFeedback() {
    setError(null);
    setMessage(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetFeedback();
    }
    onOpenChange(nextOpen);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    handleOpenChange(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    resetFeedback();

    if (!legalAccepted) return;
    if (registerPassword !== registerPasswordConfirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: {
          marketing_accept: marketingAccepted,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage(
      "Регистрация успешна! Проверьте почту для подтверждения аккаунта."
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-panel border-zinc-800/80 bg-zinc-950/95 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight text-white">
            <span className="text-white">GET</span>
            <span className="text-neon-gradient">BUFF</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Войдите или создайте аккаунт для сделок на маркетплейсе
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as "login" | "register");
            resetFeedback();
          }}
          className="gap-4"
        >
          <TabsList className="grid w-full grid-cols-2 border border-zinc-800/80 bg-black/40 p-1">
            <TabsTrigger
              value="login"
              className="font-semibold data-active:bg-green-500/15 data-active:text-green-400"
            >
              Вход
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="font-semibold data-active:bg-green-500/15 data-active:text-green-400"
            >
              Регистрация
            </TabsTrigger>
          </TabsList>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
              {message}
            </p>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-zinc-400">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={fieldClassName}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-zinc-400">
                  Пароль
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={fieldClassName}
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="neon-glow-hover w-full border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
              >
                {loading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-zinc-400">
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className={fieldClassName}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-zinc-400">
                  Пароль
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className={fieldClassName}
                  placeholder="Минимум 6 символов"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="register-password-confirm"
                  className="text-zinc-400"
                >
                  Повторите пароль
                </Label>
                <Input
                  id="register-password-confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={registerPasswordConfirm}
                  onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                  className={cn(
                    fieldClassName,
                    registerPasswordConfirm &&
                      !passwordsMatch &&
                      "border-red-500/50 focus-visible:ring-red-500/20"
                  )}
                  placeholder="••••••••"
                />
                {registerPasswordConfirm && !passwordsMatch && (
                  <p className="text-xs text-red-400">Пароли не совпадают</p>
                )}
              </div>

              <div className="space-y-3 rounded-lg border border-zinc-800/80 bg-black/30 p-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="legal-accept"
                    checked={legalAccepted}
                    onCheckedChange={(checked) =>
                      setLegalAccepted(checked === true)
                    }
                    className="mt-0.5 border-green-500/40 data-checked:border-green-500 data-checked:bg-green-500 data-checked:text-black"
                  />
                  <label
                    htmlFor="legal-accept"
                    className="cursor-pointer text-xs leading-relaxed text-zinc-400"
                  >
                    Я согласен на обработку персональных данных, принимаю
                    условия{" "}
                    <Link
                      href="/offer"
                      className="text-green-400 underline underline-offset-2 hover:text-green-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      публичной оферты
                    </Link>{" "}
                    и{" "}
                    <Link
                      href="/privacy"
                      className="text-green-400 underline underline-offset-2 hover:text-green-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      политики конфиденциальности
                    </Link>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="marketing-accept"
                    checked={marketingAccepted}
                    onCheckedChange={(checked) =>
                      setMarketingAccepted(checked === true)
                    }
                    className="mt-0.5 border-zinc-700 data-checked:border-green-500 data-checked:bg-green-500 data-checked:text-black"
                  />
                  <label
                    htmlFor="marketing-accept"
                    className="cursor-pointer text-xs leading-relaxed text-zinc-500"
                  >
                    Я согласен получать рекламные рассылки и спецпредложения
                    на почту
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !canRegister}
                className="neon-glow-hover w-full border border-green-500/30 bg-green-500 font-bold text-black hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)] disabled:opacity-40"
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
