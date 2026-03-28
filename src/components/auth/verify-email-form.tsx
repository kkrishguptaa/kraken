"use client";

import { Button } from "@base-ui/react/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  sendEmailVerificationOTP,
  sendMagicLink,
  sendSignInOTP,
  signInWithEmailOTP,
  verifyEmailWithOTP,
} from "@/actions/auth-actions";
import {
  authHelpCardClassName,
  authPrimaryButtonClassName,
} from "@/components/auth/auth-styles";
import { Button as UIButton } from "@/components/ui/button";

export function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpSlotIds = [
    "otp-digit-1",
    "otp-digit-2",
    "otp-digit-3",
    "otp-digit-4",
    "otp-digit-5",
    "otp-digit-6",
  ] as const;

  const email = params.get("email")?.trim().toLowerCase() ?? "";
  const notice = params.get("notice");
  const method = params.get("method") === "magic-link" ? "magic-link" : "otp";
  const flow =
    params.get("flow") === "sign-in" ? "sign-in" : "email-verification";
  const isMagicLink = method === "magic-link";
  const isEmailVerification = flow === "email-verification";
  const wrongEmailHref = isEmailVerification ? "/auth/sign-up" : "/auth/email";
  const title = isMagicLink
    ? "Check your email"
    : isEmailVerification
      ? "Enter the verification code"
      : "Enter your sign in code";
  const lead = isMagicLink
    ? "We sent a secure sign-in link to"
    : isEmailVerification
      ? "We sent a 6-digit verification code to"
      : "We sent a 6-digit sign in code to";
  const resendSuccessMessage = isMagicLink
    ? "Fresh magic link sent. Check your inbox."
    : "Code sent. Check your inbox.";

  // Refs for the 6 digit inputs
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleDigitChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue.length > 1) {
      // If user pastes multiple digits, distribute them
      const pastedDigits = numericValue.split("").slice(0, 6);
      const newDigits = [...digits];
      pastedDigits.forEach((digit, i) => {
        const digitIndex = index + i;
        if (digitIndex < 6) {
          newDigits[digitIndex] = digit;
        }
      });
      setDigits(newDigits);
      // Focus the last filled digit or the 6th input
      const lastIndex = Math.min(index + pastedDigits.length, 5);
      inputRefs[lastIndex].current?.focus();
    } else {
      const newDigits = [...digits];
      newDigits[index] = numericValue;
      setDigits(newDigits);

      // Auto-focus next input
      if (numericValue && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // If current input is empty, focus previous
        inputRefs[index - 1].current?.focus();
      }
    }
    // Handle left arrow
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    // Handle right arrow
    else if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email is required to resend code.");
      return;
    }

    setIsResending(true);
    setMessage(null);
    setError(null);

    const result = isMagicLink
      ? await sendMagicLink(email)
      : isEmailVerification
        ? await sendEmailVerificationOTP(email)
        : await sendSignInOTP(email);

    setIsResending(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage(resendSuccessMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (isMagicLink) {
      return;
    }

    const otp = digits.join("");

    if (otp.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsSubmitting(true);

    const result = isEmailVerification
      ? await verifyEmailWithOTP({
          email,
          otp,
        })
      : await signInWithEmailOTP({
          email,
          otp,
        });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage(
      isEmailVerification
        ? "Email verified. Continuing..."
        : "Signed in. Redirecting...",
    );
    router.push(isEmailVerification ? "/auth/onboarding" : "/");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-paper-muted">
          CHECK YOUR EMAIL
        </p>
        <h1 className="font-serif text-4xl leading-tight">{title}</h1>
        <p className="text-sm text-paper-muted">
          {lead}{" "}
          <span className="font-medium text-paper-ink">
            {email || "your email"}
          </span>{" "}
          <Link
            href={wrongEmailHref}
            className="text-paper-ink underline underline-offset-2 hover:text-black"
          >
            Wrong email?
          </Link>
        </p>
        {notice === "send-failed" ? (
          <p className="text-sm text-red-700">
            We could not send the first code. Use the resend action below to try
            again.
          </p>
        ) : null}
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {!isMagicLink ? (
          <div className="space-y-3">
            <div className="block text-center text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
              VERIFICATION CODE
            </div>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otpSlotIds.map((slotId, index) => (
                <input
                  key={slotId}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={6}
                  value={digits[index]}
                  className="h-14 w-12 border border-paper-border bg-white text-center text-2xl font-mono outline-none transition focus:border-paper-ink focus:ring-2 focus:ring-paper-ink/20 sm:h-16 sm:w-14"
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={authHelpCardClassName}>
            <p className="text-sm text-paper-muted">
              Use the button in the email to continue signing in. Magic links
              expire quickly and can only be used once.
            </p>
          </div>
        )}

        {error ? (
          <p className="text-center text-sm text-red-700">{error}</p>
        ) : null}

        {message ? (
          <p className="text-center text-sm text-green-700">{message}</p>
        ) : null}

        {/* Submit button */}
        {!isMagicLink ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            className={authPrimaryButtonClassName}
          >
            {isSubmitting
              ? isEmailVerification
                ? "Verifying..."
                : "Signing in..."
              : isEmailVerification
                ? "Verify Email"
                : "Sign In"}
          </Button>
        ) : null}

        <p className="text-center text-sm text-paper-muted">
          {isMagicLink ? "Need another link?" : "Didn't receive it?"}{" "}
          <UIButton
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            variant="underline"
            className="font-medium text-paper-ink underline underline-offset-2 hover:text-black disabled:opacity-50 px-0 py-0 text-sm inline"
          >
            {isResending
              ? "Sending..."
              : isMagicLink
                ? "Resend magic link"
                : "Resend code"}
          </UIButton>
        </p>
      </form>
    </div>
  );
}
