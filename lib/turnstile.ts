const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type VerifyTurnstileParams = {
  remoteIp?: string;
  token: string;
};

export type TurnstileVerificationResult = {
  errorCodes: string[];
  success: boolean;
};

export async function verifyTurnstileToken({
  remoteIp,
  token,
}: VerifyTurnstileParams): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured");
  }

  const body = new URLSearchParams({
    response: token,
    secret: secretKey,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Turnstile verification failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    "error-codes"?: string[];
    success?: boolean;
  };

  return {
    errorCodes: data["error-codes"] ?? [],
    success: Boolean(data.success),
  };
}
