export function normalizeReturnTo(value: FormDataEntryValue | null): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/";
  }

  return value;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const maxLength = 254;
  return emailRegex.test(email) && email.length <= maxLength;
}

export function resolveVerifiedSubscriptionUserId(input: {
  sessionUserId?: string | null;
  sessionEmail?: string | null;
  targetEmail: string;
}): string | null {
  const normalizedSessionEmail =
    input.sessionEmail?.trim().toLowerCase() ?? null;
  const normalizedTargetEmail = input.targetEmail.trim().toLowerCase();

  if (
    !input.sessionUserId ||
    !normalizedSessionEmail ||
    normalizedSessionEmail !== normalizedTargetEmail
  ) {
    return null;
  }

  return input.sessionUserId;
}
