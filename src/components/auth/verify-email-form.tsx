"use client";

import { Button } from "@base-ui/react/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  sendSignInOTP,
  signInWithEmailOTP,
} from "@/actions/auth-actions";

export function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);

  const email = params.get("email") ?? "";

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
    e: React.KeyboardEvent<HTMLInputElement>
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
    if (!email?.trim()) {
      setError("Email is required to resend code.");
      return;
    }

    setIsResending(true);
    setMessage(null);
    setError(null);

    const result = await sendSignInOTP(email.trim());

    setIsResending(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage("Code sent! Check your inbox.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const otp = digits.join("");

    if (otp.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsSubmitting(true);

    const result = await signInWithEmailOTP({
      email,
      otp,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage("Success!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-paper-muted">
          CHECK YOUR EMAIL
        </p>
        <h1 className="font-serif text-4xl leading-tight">
          Enter the verification code
        </h1>
        <p className="text-sm text-paper-muted">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-paper-ink">{email || "your email"}</span>
          {" "}
          <Link
            href="/auth/sign-in"
            className="text-paper-ink underline underline-offset-2 hover:text-black"
          >
            Wrong email?
          </Link>
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* 6 Digit Inputs */}
        <div className="space-y-3">
          <label className="block text-center text-xs font-medium uppercase tracking-[0.2em] text-paper-muted">
            VERIFICATION CODE
          </label>
          <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                className="h-14 w-12 border border-paper-border bg-white text-center text-2xl font-mono outline-none transition focus:border-paper-ink focus:ring-2 focus:ring-paper-ink/20 sm:h-16 sm:w-14"
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
        </div>

        {error ? (
          <p className="text-center text-sm text-red-700">{error}</p>
        ) : null}

        {message ? (
          <p className="text-center text-sm text-green-700">{message}</p>
        ) : null}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer border border-paper-ink bg-paper-ink px-4 py-3 text-sm font-medium text-paper-base transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>

        {/* Resend link */}
        <p className="text-center text-sm text-paper-muted">
          Didn't receive it?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="font-medium text-paper-ink underline underline-offset-2 hover:text-black disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </p>
      </form>
    </div>
  );
}
