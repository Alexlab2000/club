import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const MAX_ATTEMPTS_PER_DAY = 5;

function getClientIdentifier(request: NextRequest) {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, userAnswer } = body;

    if (!questionId || typeof userAnswer !== "string") {
      return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const identifier = getClientIdentifier(request);
    const attemptDate = getAttemptDate();

    const { data: existingAttempt, error: attemptReadError } = await supabase
      .from("daily_question_attempts")
      .select("attempts_count")
      .eq("identifier", identifier)
      .eq("question_id", questionId)
      .eq("attempt_date", attemptDate)
      .maybeSingle();

    if (attemptReadError) {
      return NextResponse.json(
        { error: "Не удалось проверить лимит попыток" },
        { status: 500 }
      );
    }

    const attemptsUsed = existingAttempt?.attempts_count ?? 0;

    if (attemptsUsed >= MAX_ATTEMPTS_PER_DAY) {
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

    const { error: attemptWriteError } = await supabase
      .from("daily_question_attempts")
      .upsert(
        {
          identifier,
          question_id: questionId,
          attempt_date: attemptDate,
          attempts_count: attemptsUsed + 1,
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

    const isCorrect =
      data.correct_answer.toLowerCase().trim() ===
      userAnswer.toLowerCase().trim();

    return NextResponse.json({
      correct: isCorrect,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS_PER_DAY - (attemptsUsed + 1)),
    });
  } catch {
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 });
  }
}
