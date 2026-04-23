import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const MAX_ATTEMPTS_PER_DAY = 3;

function normalizeAnswer(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\u00A0/g, " ")
    .replace(/ё/gi, "е")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("ru-RU");
}

function getClientIdentifier(request: NextRequest, sessionKey?: string) {
  if (typeof sessionKey === "string" && sessionKey.trim().length > 0) {
    return `session:${sessionKey.trim()}`;
  }

  const ip =
    request.ip ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown-ip";
  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";

  return `${ip}:${userAgent}`;
}

function getAttemptDate() {
  return new Date().toISOString().slice(0, 10);
}

function isAttemptsTableMissing(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const maybeError = error as { code?: string; message?: string };
  return (
    maybeError.code === "PGRST205" &&
    typeof maybeError.message === "string" &&
    maybeError.message.includes("daily_question_attempts")
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, userAnswer, sessionKey } = body;

    if (!questionId || typeof userAnswer !== "string") {
      return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const identifier = getClientIdentifier(request, sessionKey);
    const attemptDate = getAttemptDate();

    const { data: existingAttempt, error: attemptReadError } = await supabase
      .from("daily_question_attempts")
      .select("attempts_count")
      .eq("identifier", identifier)
      .eq("question_id", questionId)
      .eq("attempt_date", attemptDate)
      .maybeSingle();

    const attemptsTrackingAvailable = !isAttemptsTableMissing(attemptReadError);

    if (attemptReadError && attemptsTrackingAvailable) {
      return NextResponse.json(
        { error: "Не удалось проверить лимит попыток" },
        { status: 500 }
      );
    }

    const attemptsUsed =
      attemptsTrackingAvailable ? existingAttempt?.attempts_count ?? 0 : 0;

    if (attemptsTrackingAvailable && attemptsUsed >= MAX_ATTEMPTS_PER_DAY) {
      return NextResponse.json(
        {
          correct: false,
          blocked: true,
          remainingAttempts: 0,
          message: "Лимит попыток на сегодня исчерпан",
        },
        { status: 429 }
      );
    }

    const { data, error } = await supabase
      .from("question_answers")
      .select("correct_answer")
      .eq("question_id", questionId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Вопрос не найден" }, { status: 404 });
    }

    const isCorrect =
      normalizeAnswer(data.correct_answer) === normalizeAnswer(userAnswer);

    if (isCorrect) {
      return NextResponse.json({
        correct: true,
        remainingAttempts: attemptsTrackingAvailable
          ? Math.max(0, MAX_ATTEMPTS_PER_DAY - attemptsUsed)
          : MAX_ATTEMPTS_PER_DAY,
      });
    }

    const nextAttemptsUsed = attemptsUsed + 1;

    if (attemptsTrackingAvailable) {
      const { error: attemptWriteError } = await supabase
        .from("daily_question_attempts")
        .upsert(
          {
            identifier,
            question_id: questionId,
            attempt_date: attemptDate,
            attempts_count: nextAttemptsUsed,
          },
          {
            onConflict: "identifier,question_id,attempt_date",
          }
        );

      if (attemptWriteError) {
        return NextResponse.json(
          { error: "Не удалось сохранить попытку" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      correct: false,
      blocked: attemptsTrackingAvailable
        ? nextAttemptsUsed >= MAX_ATTEMPTS_PER_DAY
        : false,
      remainingAttempts: attemptsTrackingAvailable
        ? Math.max(0, MAX_ATTEMPTS_PER_DAY - nextAttemptsUsed)
        : MAX_ATTEMPTS_PER_DAY,
    });
  } catch {
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 });
  }
}
