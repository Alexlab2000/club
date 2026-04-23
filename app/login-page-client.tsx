"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type TurnstileRenderOptions = {
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  sitekey: string;
  theme?: "auto" | "dark" | "light";
};

declare global {
  interface Window {
    turnstile?: {
      remove: (widgetId: string) => void;
      render: (
        container: HTMLElement | string,
        options: TurnstileRenderOptions
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export default function LoginPageClient() {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "login">("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  function resetTurnstile(nextError = "") {
    setTurnstileToken("");
    setTurnstileError(nextError);

    if (turnstileWidgetIdRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  }

  useEffect(() => {
    if (mode !== "login") {
      setTurnstileToken("");
      setTurnstileError("");

      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }

      return;
    }

    if (!TURNSTILE_SITE_KEY) {
      setTurnstileError("Капча временно недоступна. Проверьте настройки Turnstile.");
      return;
    }

    if (
      !turnstileReady ||
      !turnstileContainerRef.current ||
      turnstileWidgetIdRef.current ||
      !window.turnstile
    ) {
      return;
    }

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "dark",
      callback: (token: string) => {
        setTurnstileToken(token);
        setTurnstileError("");
      },
      "expired-callback": () => {
        resetTurnstile("Подтвердите, что вы не робот, ещё раз.");
      },
      "error-callback": () => {
        resetTurnstile("Не удалось загрузить проверку. Обновите страницу и попробуйте снова.");
      },
    });
  }, [mode, turnstileReady]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!TURNSTILE_SITE_KEY) {
      setError("Turnstile не настроен. Добавьте ключи в переменные окружения.");
      return;
    }

    if (!turnstileToken) {
      setError("Подтвердите, что вы не робот.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Неверный email или пароль");
        resetTurnstile();
        setLoading(false);
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("Не удалось выполнить вход. Попробуйте снова.");
      resetTurnstile();
      setLoading(false);
    }
  }

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      )}

      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5"
            style={{
              background: "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, #c9a84c 0px, transparent 1px, transparent 80px),
                repeating-linear-gradient(90deg, #c9a84c 0px, transparent 1px, transparent 80px)`,
            }}
          />
        </div>

        <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6">
          <div className="mb-12 flex animate-fade-in flex-col items-center">
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border"
              style={{ borderColor: "rgba(201,168,76,0.4)" }}
            >
              <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="alphaStroke" x1="24" y1="6" x2="24" y2="42">
                    <stop offset="0" stopColor="#f6e2a6" />
                    <stop offset="0.55" stopColor="#d7b25a" />
                    <stop offset="1" stopColor="#86d6ff" />
                  </linearGradient>
                  <filter id="alphaGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g filter="url(#alphaGlow)" stroke="url(#alphaStroke)" strokeLinecap="round">
                  <circle cx="24" cy="10.5" r="6.5" strokeWidth="2.2" />
                  <path d="M24 16L12 38" strokeWidth="2.4" />
                  <path d="M24 16L36 38" strokeWidth="2.4" />
                  <path d="M16 38H8" strokeWidth="2.4" />
                  <path d="M40 38H32" strokeWidth="2.4" />
                  <path d="M24 16C22 24 20 31 14.5 38" strokeWidth="1.4" opacity="0.9" />
                  <path d="M24 16C26 24 28 31 33.5 38" strokeWidth="1.4" opacity="0.9" />
                </g>
                <circle cx="24" cy="16" r="1.8" fill="#fff3c4" opacity="0.95" />
              </svg>
            </div>
            <h1
              className="text-center font-heading text-5xl font-light tracking-widest text-ivory"
              style={{ letterSpacing: "0.3em" }}
            >
              КЛУБ
            </h1>
            <div className="divider-gold mt-4 w-32" />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ghost">
              Закрытое сообщество
            </p>
          </div>

          {mode === "idle" && (
            <div
              className="w-full animate-slide-up flex-col gap-3"
              style={{ animationDelay: "0.2s", opacity: 0, display: "flex" }}
            >
              <button
                onClick={() => setMode("login")}
                className="w-full border border-gold-dark py-4 font-body text-sm uppercase tracking-[0.15em] text-gold transition-all duration-300 hover:bg-gold hover:text-obsidian"
              >
                Войти
              </button>
              <button
                onClick={() => router.push("/register")}
                className="w-full border py-4 font-body text-sm uppercase tracking-[0.15em] text-ghost transition-all duration-300 hover:border-gold-dark hover:text-ivory"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                Регистрация
              </button>
            </div>
          )}

          {mode === "login" && (
            <form
              onSubmit={handleLogin}
              className="w-full animate-slide-up flex-col gap-4"
              style={{ animationDelay: "0s", opacity: 0, display: "flex" }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode("idle");
                  setError("");
                }}
                className="mb-2 self-start text-xs uppercase tracking-widest text-ghost transition-colors hover:text-ivory"
              >
                ← Назад
              </button>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase tracking-widest text-ghost">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="border border-ash bg-charcoal px-4 py-3 font-body text-sm text-ivory outline-none transition-colors focus:border-gold-dark"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase tracking-widest text-ghost">
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="border border-ash bg-charcoal px-4 py-3 font-body text-sm text-ivory outline-none transition-colors focus:border-gold-dark"
                />
              </div>

              <div className="rounded-[20px] border border-ash bg-charcoal/60 px-4 py-4">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ghost">
                  Проверка входа
                </p>
                <div ref={turnstileContainerRef} />
                {turnstileError && (
                  <p className="mt-3 font-mono text-xs tracking-wide text-crimson">
                    {turnstileError}
                  </p>
                )}
              </div>

              {error && (
                <p className="font-mono text-xs tracking-wide text-crimson">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !turnstileToken || !TURNSTILE_SITE_KEY}
                className="mt-2 w-full bg-gold py-4 font-body text-sm uppercase tracking-[0.15em] text-obsidian transition-all duration-300 hover:bg-gold-light disabled:opacity-50"
              >
                {loading ? "Проверка..." : "Войти"}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
