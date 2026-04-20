"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const [mode, setMode] = useState<"idle" | "login">("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Неверный email или пароль");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian">
      <div className="absolute inset-0 pointer-events-none">
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
        <div className="mb-12 flex flex-col items-center animate-fade-in">
          <div
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(201,168,76,0.4)" }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M18 3L33 30H3L18 3Z"
                stroke="#c9a84c"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="18" cy="20" r="4" fill="#c9a84c" opacity="0.6" />
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
                className="bg-charcoal border border-ash px-4 py-3 font-body text-sm text-ivory outline-none transition-colors focus:border-gold-dark"
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
                className="bg-charcoal border border-ash px-4 py-3 font-body text-sm text-ivory outline-none transition-colors focus:border-gold-dark"
              />
            </div>

            {error && (
              <p className="font-mono text-xs tracking-wide text-crimson">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-gold py-4 font-body text-sm uppercase tracking-[0.15em] text-obsidian transition-all duration-300 hover:bg-gold-light disabled:opacity-50"
            >
              {loading ? "Проверка..." : "Войти"}
            </button>
          </form>
        )}

        <p className="absolute bottom-8 font-mono text-xs tracking-widest text-ash">
          MCMXCIX
        </p>
      </div>
    </main>
  );
}
