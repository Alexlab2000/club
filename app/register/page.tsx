/**
 * ФАЙЛ: app/register/page.tsx
 * НАЗНАЧЕНИЕ: Страница регистрации — квиз + создание аккаунта
 *
 * ЭТАПЫ (stage):
 *   loading  → загружаем вопрос из базы
 *   quiz     → пользователь отвечает на вопрос-пароль
 *   register → форма создания email + password
 *   verify   → "проверьте почту" после signUp
 *
 * ИСПРАВЛЕНИЕ:
 * sessionKey теперь хранится в sessionStorage браузера.
 * Раньше он генерировался заново при каждом рендере компонента,
 * из-за чего перезагрузка страницы сбрасывала счётчик попыток —
 * пользователь мог обходить лимит простым F5.
 *
 * sessionStorage живёт пока открыта вкладка браузера.
 * Закрыл вкладку — sessionKey удаляется — справедливо.
 */
"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ── Типы ─────────────────────────────────────────────────────
interface Question {
  id: string;
  question_text: string;
  order_priority: number;
}

// Stage — возможные состояния страницы регистрации
type Stage = "loading" | "quiz" | "register" | "verify";

// ── Ключ для sessionStorage ───────────────────────────────────
// Константа вынесена чтобы не опечататься при использовании в двух местах
const SESSION_STORAGE_KEY = "club_reg_session_key";

/**
 * Возвращает sessionKey — уникальный идентификатор этой попытки регистрации.
 * Если уже создан (хранится в sessionStorage) — возвращает существующий.
 * Если нет — генерирует новый и сохраняет.
 *
 * Вызывается только в браузере (typeof window !== "undefined"),
 * потому что sessionStorage недоступен на сервере.
 */
function getOrCreateSessionKey(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;

    // crypto.randomUUID() — надёжный генератор уникальных ID
    const newKey = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, newKey);
    return newKey;
  } catch {
    // Если sessionStorage недоступен (редкий случай) — возвращаем случайный ID
    return Math.random().toString(36).slice(2);
  }
}

// ── Главный компонент ─────────────────────────────────────────
export default function RegisterPage() {
  // ── Состояния квиза ─────────────────────────────────────
  const [stage, setStage] = useState<Stage>("loading");
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [shaking, setShaking] = useState(false); // анимация тряски при неверном ответе
  const [checking, setChecking] = useState(false);

  // ── Состояния формы регистрации ──────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [regError, setRegError] = useState("");
  const [registering, setRegistering] = useState(false);

  // ── Рефы ─────────────────────────────────────────────────
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /**
   * sessionKey — уникальный ключ этой сессии регистрации.
   * Хранится в sessionStorage, не сбрасывается при перезагрузке страницы.
   * Используется сервером для отслеживания попыток ответа.
   *
   * useRef хранит значение между рендерами без вызова перерисовки.
   * Инициализируем lazy (через функцию) — выполняется один раз.
   */
  const sessionKey = useRef<string>("");

  // Инициализируем sessionKey при монтировании компонента в браузере
  useEffect(() => {
    sessionKey.current = getOrCreateSessionKey();
  }, []);

  // ── Загрузка вопроса из базы ─────────────────────────────
  useEffect(() => {
    async function loadQuestion() {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("registration_questions")
        .select("id, question_text, order_priority");

      if (fetchError || !data || data.length === 0) {
        setError("Не удалось загрузить вопросы. Попробуй позже.");
        return;
      }

      // Выбираем случайный вопрос из списка
      const randomIndex = Math.floor(Math.random() * data.length);
      setQuestion(data[randomIndex]);
      setStage("quiz");
    }

    loadQuestion();
  }, []);

  // ── Фокус на поле ввода когда появляется квиз ───────────
  useEffect(() => {
    if (stage === "quiz" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [stage]);

  // ── Проверка ответа ──────────────────────────────────────
  /**
   * Отправляет ответ на сервер (POST /api/check-answer).
   * Сервер сравнивает с правильным ответом и считает попытки.
   */
  async function handleCheckAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || checking || blocked || !question) return;

    setChecking(true);
    setError("");

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          userAnswer: answer.trim(),
          sessionKey: sessionKey.current, // теперь стабильный между перезагрузками
        }),
      });

      const data = await res.json();

      // Лимит попыток исчерпан
      if (res.status === 429 || data.blocked) {
        setBlocked(true);
        setError("Слишком много неверных попыток. Попробуй завтра.");
        setChecking(false);
        return;
      }

      if (data.correct) {
        // Верный ответ — переходим к регистрации
        setAnswer("");
        setError("");
        setRemainingAttempts(3);
        setStage("register");
      } else {
        // Неверный ответ
        setRemainingAttempts(data.remainingAttempts ?? 0);

        if (data.remainingAttempts === 0) {
          setBlocked(true);
          setError("Лимит попыток исчерпан. Обратись к администратору.");
        } else {
          setError(`Неверно. Осталось попыток: ${data.remainingAttempts}`);
          // Анимация тряски поля ввода
          setShaking(true);
          setTimeout(() => setShaking(false), 400);
        }
      }
    } catch {
      setError("Ошибка соединения. Попробуй снова.");
    }

    setChecking(false);
  }

  // ── Регистрация аккаунта ─────────────────────────────────
  /**
   * Создаёт аккаунт через Supabase Auth.
   * После регистрации Supabase отправляет письмо с ссылкой подтверждения.
   * Ссылка ведёт на /auth/callback?next=/home → пользователь попадает на /home.
   */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");

    // Валидация на клиенте (дополнительная проверка перед запросом)
    if (password !== password2) {
      setRegError("Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      setRegError("Пароль должен быть не менее 8 символов");
      return;
    }

    setRegistering(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Куда вернётся пользователь после клика в письме.
        // /auth/callback обработает code и перенаправит на /home.
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/home`,
      },
    });

    if (signUpError) {
      setRegError(signUpError.message);
      setRegistering(false);
    } else {
      // Успех — удаляем sessionKey (он больше не нужен)
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // sessionStorage недоступен — не критично
      }
      setStage("verify");
    }
  }

  // ── Рендер ───────────────────────────────────────────────
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-obsidian overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #c9a84c, transparent)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 flex flex-col items-center">
          <button
            onClick={() => router.push("/")}
            className="self-start text-ghost text-xs tracking-widest uppercase hover:text-ivory transition-colors mb-8 flex items-center gap-2 font-mono"
          >
            ← Назад
          </button>
          <p className="font-mono text-xs text-ghost tracking-[0.3em] uppercase mb-3">
            Вступление в клуб
          </p>
          <div className="divider-gold w-24" />
        </div>

        {/* ── Экран загрузки ─────────────────────────── */}
        {stage === "loading" && (
          <div className="text-center">
            <p className="font-mono text-xs text-ghost tracking-widest animate-pulse">
              Загрузка...
            </p>
          </div>
        )}

        {/* ── Квиз: вопрос-пароль ────────────────────── */}
        {stage === "quiz" && question && (
          <div className="animate-slide-up">
            <div className="mb-3">
              <p className="font-mono text-xs text-ghost tracking-widest uppercase">
                Испытание
              </p>
            </div>

            <div className="mb-8 p-6 border border-ash bg-glass">
              <h2 className="font-heading text-2xl font-light text-ivory leading-relaxed">
                {question.question_text}
              </h2>
            </div>

            <form onSubmit={handleCheckAnswer} className="flex flex-col gap-4">
              <div className={shaking ? "animate-shake" : ""}>
                <input
                  ref={inputRef}
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={blocked}
                  placeholder="Введите ответ..."
                  className={`w-full bg-charcoal text-ivory font-body text-sm px-4 py-4 outline-none transition-colors ${
                    error
                      ? "border border-crimson"
                      : "border border-ash focus:border-gold-dark"
                  } ${blocked ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>

              {error && (
                <p className="font-mono text-xs text-crimson tracking-wide">
                  {error}
                </p>
              )}

              <p className="font-mono text-xs text-ghost tracking-wide">
                Осталось попыток: {remainingAttempts}
              </p>

              <button
                type="submit"
                disabled={checking || blocked || !answer.trim()}
                className="w-full py-4 border border-gold-dark text-gold font-body text-sm tracking-[0.15em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {checking ? "Проверка..." : "Подтвердить →"}
              </button>
            </form>
          </div>
        )}

        {/* ── Форма регистрации ───────────────────────── */}
        {stage === "register" && (
          <div className="animate-slide-up">
            <div className="mb-8 text-center">
              <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-2">
                Испытание пройдено
              </p>
              <h2 className="font-heading text-3xl font-light text-ivory">
                Создайте аккаунт
              </h2>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-ghost tracking-widest uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-charcoal border border-ash text-ivory font-body text-sm px-4 py-3 outline-none focus:border-gold-dark transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-ghost tracking-widest uppercase">
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="bg-charcoal border border-ash text-ivory font-body text-sm px-4 py-3 outline-none focus:border-gold-dark transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-ghost tracking-widest uppercase">
                  Пароль ещё раз
                </label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="bg-charcoal border border-ash text-ivory font-body text-sm px-4 py-3 outline-none focus:border-gold-dark transition-colors"
                />
              </div>

              {regError && (
                <p className="font-mono text-xs text-crimson tracking-wide">
                  {regError}
                </p>
              )}

              <button
                type="submit"
                disabled={registering}
                className="w-full py-4 bg-gold text-obsidian font-body text-sm tracking-[0.15em] uppercase hover:bg-gold-light transition-all duration-300 disabled:opacity-50 mt-2"
              >
                {registering ? "Создание аккаунта..." : "Зарегистрироваться"}
              </button>
            </form>
          </div>
        )}

        {/* ── Экран "проверьте почту" ─────────────────── */}
        {stage === "verify" && (
          <div className="text-center animate-fade-in">
            <div
              className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-6"
              style={{ borderColor: "rgba(201,168,76,0.4)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                  stroke="#c9a84c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="font-heading text-3xl font-light text-ivory mb-4">
              Проверьте почту
            </h2>
            <p className="font-body text-sm text-ghost leading-relaxed">
              Мы отправили письмо с подтверждением на{" "}
              <span className="text-gold">{email}</span>.
              <br />
              Перейдите по ссылке в письме для активации аккаунта.
            </p>
            <div className="divider-gold w-24 mx-auto mt-8" />
            <p className="font-mono text-xs text-ash mt-6 tracking-widest">
              Письмо не пришло? Проверь папку «Спам»
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
