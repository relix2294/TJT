"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/lib/i18n";

type AdminLoginFormProps = {
  lang: Locale;
};

const COPY = {
  en: {
    title: "Admin access",
    subtitle: "Enter the dashboard password to continue.",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
    error: "Invalid password. Try again.",
  },
  ru: {
    title: "Доступ администратора",
    subtitle: "Введите пароль для входа в панель аналитики.",
    password: "Пароль",
    submit: "Войти",
    submitting: "Вход…",
    error: "Неверный пароль. Попробуйте снова.",
  },
} as const;

export function AdminLoginForm({ lang }: AdminLoginFormProps) {
  const router = useRouter();
  const t = COPY[lang];
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError(t.error);
        return;
      }

      router.push(`/${lang}/admin/dashboard`);
      router.refresh();
    } catch {
      setError(t.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm font-medium text-muted-foreground">
          {t.password}
        </label>
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={pending}
          aria-invalid={error ? true : undefined}
          className="h-11 rounded-xl border-border/70 bg-background/60 px-3 text-base focus-visible:ring-primary/40"
        />
        {error ? (
          <p className="text-sm text-loss" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={pending || !password.trim()}
        className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <LockKeyhole className="size-4 opacity-80" data-icon="inline-start" />
        {pending ? t.submitting : t.submit}
      </Button>
    </form>
  );
}
