import { Resend } from "resend";

export function getAppUrl(): string {
  return (
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || "Kraken <onboarding@resend.dev>";
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}
