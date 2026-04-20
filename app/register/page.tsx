"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Question {
  id: string;
  question_text: string;
  order_priority: number;
}

type Stage = "loading" | "quiz" | "register" | "verify";

export default function RegisterPage() {
  const [stage, setStage] = useState<Stage>("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [shaking, setShaking] = useState(false);
  const [checking, setChecking] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [regError, setRegError] = useState("");
  const [registering, setRegistering] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadQuestions() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("registration_questions")
        .select("id, question_text, order_priority")
        .order("order_priority", { ascending: true });

      if (error || !data || data.length < 5) {
        setError("Не удалось загрузить 5 вопросов для регистрации. Проверь базу данных.");
        return;
      }

      setQuestions(shuffleQuestions(data.slice(0, 5)));
      setStage("quiz");
    }

    loadQuestions();
  }, []);

  useEffect(() => {
    if (stage === "quiz" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [stage, currentStep]);

  async function handleCheckAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || checking || blocked) return;

    setChecking(true);
    setError("");

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: questions[currentStep].id,
          userAnswer: answer.trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 429 || data.blocked) {
        setBlocked(true);
        setRemainingAttempts(0);
        setError("Лимит попыток на этот вопрос исчерпан на сегодня. Попробуй завтра.");
        setChecking(false);
        return;
      }

      if (data.correct) {
        setAnswer("");
        setError("");
        setBlocked(false);
        setRemainingAttempts(5);

        if (currentStep + 1 >= questions.length) {
          setStage("register");
        } else {
          setCurrentStep((step) => step + 1);
        }
      } else {
        setRemainingAttempts(data.remainingAttempts ?? 0);

        if (data.remainingAttempts === 0) {
          setBlocked(true);
          setError("Лимит попыток на этот вопрос исчерпан на сегодня. Попробуй завтра.");
        } else {
          setError(
            `Неверно. Осталось попыток на сегодня: ${data.remainingAttempts}`
          );
          setShaking(true);
          setTimeout(() => setShaking(false), 400);
        }
      }
    } catch {
      setError("Ошибка соединения. Попробуй снова.");
    }

    setChecking(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");

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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/welcome`,
      },
    });

    if (error) {
      setRegError(error.message);
      setRegistering(false);
    } else {
      setStage("verify");
    }
  }

  const progress =
    questions.length > 0
      ? Math.round((currentStep / questions.length) * 100)
      : 0;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-obsidian overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 h-96 w-96 opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #c9a84c, transparent)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 flex flex-col items-center">
          <button
            onClick={() => router.push("/")}
            className="self-start mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ghost transition-colors hover:text-ivory"
          >
            <span>←</span> Назад
          </button>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-ghost">
            Вступление в клуб
          </p>
          <div className="divider-gold w-24" />
        </div>

        {stage === "loading" && (
          <div className="text-center">
            <p className="animate-pulse font-mono text-xs tracking-widest text-ghost">
              Загрузка...
            </p>
          </div>
        )}

        {stage === "quiz" && questions.length > 0 && (
          <div className="animate-slide-up">
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-ghost">
                  ВОПРОС {currentStep + 1} / {questions.length}
                </span>
                <span className="font-mono text-xs text-gold">{progress}%</span>
              </div>
              <div className="h-px w-full bg-ash">
                <div
                  className="h-px bg-gold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-8 border border-ash bg-glass p-6">
              <h2 className="font-heading text-2xl font-light leading-relaxed text-ivory">
                {questions[currentStep].question_text}
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
                  className={`w-full bg-charcoal px-4 py-4 font-body text-sm text-ivory outline-none transition-colors ${
                    error
                      ? "border border-crimson"
                      : "border border-ash focus:border-gold-dark"
                  } ${blocked ? "cursor-not-allowed opacity-50" : ""}`}
                />
              </div>

              <p className="font-mono text-xs tracking-wide text-ghost">
                Осталось попыток на сегодня: {remainingAttempts}
              </p>

              {error && (
                <p className="font-mono text-xs tracking-wide text-crimson">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={checking || blocked || !answer.trim()}
                className="w-full border border-gold-dark py-4 font-body text-sm uppercase tracking-[0.15em] text-gold transition-all duration-300 hover:bg-gold hover:text-obsidian disabled:cursor-not-allowed disabled:opacity-30"
              >
                {checking ? "Проверка..." : "Далее →"}
              </button>
            </form>
          </div>
        )}

        {stage === "register" && (
          <div className="animate-slide-up">
            <div className="mb-8 text-center">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
                Испытание пройдено
              </p>
              <h2 className="font-heading text-3xl font-light text-ivory">
                Создайте аккаунт
              </h2>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
                  minLength={8}
                  autoComplete="new-password"
                  className="bg-charcoal border border-ash px-4 py-3 font-body text-sm text-ivory outline-none transition-colors focus:border-gold-dark"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase tracking-widest text-ghost">
                  Пароль ещё раз
                </label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="bg-charcoal border border-ash px-4 py-3 font-body text-sm text-ivory outline-none transition-colors focus:border-gold-dark"
                />
              </div>

              {regError && (
                <p className="font-mono text-xs tracking-wide text-crimson">
                  {regError}
                </p>
              )}

              <button
                type="submit"
                disabled={registering}
                className="mt-2 w-full bg-gold py-4 font-body text-sm uppercase tracking-[0.15em] text-obsidian transition-all duration-300 hover:bg-gold-light disabled:opacity-50"
              >
                {registering ? "Создание аккаунта..." : "Зарегистрироваться"}
              </button>
            </form>
          </div>
        )}

        {stage === "verify" && (
          <div className="text-center animate-fade-in">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border"
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
            <h2 className="mb-4 font-heading text-3xl font-light text-ivory">
              Проверьте почту
            </h2>
            <p className="font-body text-sm leading-relaxed text-ghost">
              Мы отправили письмо с подтверждением на{" "}
              <span className="text-gold">{email}</span>.
              <br />
              Перейдите по ссылке в письме для активации аккаунта.
            </p>
            <div className="divider-gold mx-auto mt-8 w-24" />
            <p className="mt-6 font-mono text-xs tracking-widest text-ash">
              Письмо не пришло? Проверь папку «Спам»
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function shuffleQuestions(items: Question[]) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
