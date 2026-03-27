"use client";

import { authClient } from "@/lib/auth-client";

type AuthActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

function toMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const maybe = error as { message?: unknown; error?: { message?: unknown } };
    if (typeof maybe.message === "string") return maybe.message;
    if (typeof maybe.error?.message === "string") return maybe.error.message;
  }
  return "Something went wrong. Please try again.";
}

export async function signInWithEmail(input: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  const response = await authClient.signIn.email(input);
  if (response.error) {
    return { ok: false, message: toMessage(response.error) };
  }
  return { ok: true };
}

export async function signUpWithEmail(input: {
  name: string;
  email: string;
  password: string;
  username: string;
}): Promise<AuthActionResult> {
  const availability = await authClient.isUsernameAvailable({
    username: input.username,
  });
  if (availability.error) {
    return { ok: false, message: toMessage(availability.error) };
  }
  if (!availability.data?.available) {
    return {
      ok: false,
      message: "Please choose a different username.",
      fieldErrors: { username: "This username is already taken." },
    };
  }

  const response = await authClient.signUp.email(input);
  if (response.error) {
    return { ok: false, message: toMessage(response.error) };
  }
  return { ok: true };
}

export async function saveOnboardingUsername(input: {
  username: string;
  name?: string;
}): Promise<AuthActionResult> {
  const availability = await authClient.isUsernameAvailable({
    username: input.username,
  });

  if (availability.error) {
    return { ok: false, message: toMessage(availability.error) };
  }

  if (!availability.data?.available) {
    return {
      ok: false,
      message: "Please choose a different username.",
      fieldErrors: { username: "This username is already taken." },
    };
  }

  const update = await authClient.updateUser({
    username: input.username,
    name: input.name,
  });

  if (update.error) {
    return { ok: false, message: toMessage(update.error) };
  }

  return { ok: true };
}

export async function sendEmailVerificationOTP(
  email: string,
): Promise<AuthActionResult> {
  const response = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "email-verification",
  });

  if (response.error) {
    return { ok: false, message: toMessage(response.error) };
  }

  return { ok: true, message: "We sent a verification code to your inbox." };
}

export async function sendSignInOTP(email: string): Promise<AuthActionResult> {
  const response = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "sign-in",
  });

  if (response.error) {
    return { ok: false, message: toMessage(response.error) };
  }

  return { ok: true, message: "OTP sent. Check your inbox for the code." };
}

export async function signInWithEmailOTP(input: {
  email: string;
  otp: string;
  name?: string;
}): Promise<AuthActionResult> {
  const response = await authClient.signIn.emailOtp({
    email: input.email,
    otp: input.otp,
    name: input.name,
  });

  if (response.error) {
    return { ok: false, message: toMessage(response.error) };
  }

  return { ok: true, message: "Signed in successfully." };
}

export async function sendMagicLink(email: string): Promise<AuthActionResult> {
  const response = await authClient.signIn.magicLink({
    email,
    callbackURL: "/",
    newUserCallbackURL: "/auth/onboarding",
    errorCallbackURL: "/auth/sign-in",
  });

  if (response.error) {
    return { ok: false, message: toMessage(response.error) };
  }

  return { ok: true, message: "Magic link sent. Open it from your email." };
}

export async function verifyEmailWithOTP(input: {
  email: string;
  otp: string;
}): Promise<AuthActionResult> {
  const response = await authClient.emailOtp.verifyEmail({
    email: input.email,
    otp: input.otp,
  });

  if (response.error) {
    return { ok: false, message: toMessage(response.error) };
  }

  if (!response.data?.status) {
    return { ok: false, message: "Invalid verification code." };
  }

  return { ok: true, message: "Email verified. You can continue." };
}
