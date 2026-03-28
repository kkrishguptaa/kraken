"use client";

import { Button } from "@base-ui/react/button";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sendMagicLink, sendSignInOTP } from "@/actions/auth-actions";
import { AuthField } from "@/components/auth/auth-field";
import {
  authHelpCardClassName,
  authPrimaryButtonClassName,
  joinClassNames,
} from "@/components/auth/auth-styles";

type EmailAuthFormValues = {
  email: string;
};

type AuthMethod = "magic-link" | "otp";

export function EmailAuthForm() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("otp");
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EmailAuthFormValues>({
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-paper-muted">
          PASSWORDLESS ACCESS
        </p>
        <h1 className="font-serif text-3xl leading-tight">
          Sign in with email
        </h1>
        <p className="text-sm text-paper-muted">
          Choose your preferred authentication method below
        </p>
      </div>

      <div className="space-y-6">
        {/* Auth method selection */}
        <div className="space-y-3">
          <div className="block text-xs font-medium text-paper-ink">
            Authentication method
          </div>

          <RadioGroup
            value={authMethod}
            onValueChange={(value) => setAuthMethod(value as AuthMethod)}
            className="space-y-3"
          >
            {/* OTP Radio */}
            <div
              className={joinClassNames(
                "flex cursor-pointer items-start gap-3 rounded border-2 p-4 transition",
                authMethod === "otp"
                  ? "border-paper-ink bg-paper-ink/5"
                  : "border-paper-border bg-white hover:border-paper-border/60",
              )}
            >
              <Radio.Root
                value="otp"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-paper-border bg-white transition data-[checked]:border-paper-ink data-[checked]:bg-paper-ink"
              >
                <Radio.Indicator className="h-2 w-2 rounded-full bg-white" />
              </Radio.Root>
              <div className="flex-1">
                <div className="text-sm font-medium text-paper-ink">
                  Email OTP (One-Time Password)
                </div>
                <div className="mt-1 text-xs text-paper-muted">
                  Get a 6-digit code sent to your email that you'll enter on the
                  next screen
                </div>
              </div>
            </div>

            {/* Magic Link Radio */}
            <div
              className={joinClassNames(
                "flex cursor-pointer items-start gap-3 rounded border-2 p-4 transition",
                authMethod === "magic-link"
                  ? "border-paper-ink bg-paper-ink/5"
                  : "border-paper-border bg-white hover:border-paper-border/60",
              )}
            >
              <Radio.Root
                value="magic-link"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-paper-border bg-white transition data-[checked]:border-paper-ink data-[checked]:bg-paper-ink"
              >
                <Radio.Indicator className="h-2 w-2 rounded-full bg-white" />
              </Radio.Root>
              <div className="flex-1">
                <div className="text-sm font-medium text-paper-ink">
                  Magic Link
                </div>
                <div className="mt-1 text-xs text-paper-muted">
                  Get a secure link sent to your email that signs you in
                  instantly
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            clearErrors("root");
            const email = values.email.trim().toLowerCase();

            if (authMethod === "otp") {
              const result = await sendSignInOTP(email);
              if (!result.ok) {
                setError("root", { message: result.message });
                return;
              }

              router.push(
                `/auth/verify-email?email=${encodeURIComponent(email)}&flow=sign-in&method=otp`,
              );
            } else {
              const result = await sendMagicLink(email);
              if (!result.ok) {
                setError("root", { message: result.message });
                return;
              }

              router.push(
                `/auth/verify-email?email=${encodeURIComponent(email)}&flow=sign-in&method=magic-link`,
              );
            }

            router.refresh();
          })}
        >
          {/* Email field */}
          <AuthField
            id="email"
            label="Email address"
            error={errors.email?.message}
            type="email"
            autoComplete="email"
            placeholder="krish@krishg.com"
            labelClassName="block text-xs font-medium text-paper-ink"
            className="placeholder:text-paper-muted/50"
            {...register("email", {
              required: "Email is required.",
              validate: (email) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  return "Enter a valid email address.";
                }
                if (email.length > 254) {
                  return "Email address is too long.";
                }
                return true;
              },
            })}
          />

          {errors.root?.message ? (
            <p className="text-sm text-red-700">{errors.root.message}</p>
          ) : null}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={authPrimaryButtonClassName}
          >
            {isSubmitting
              ? "Sending..."
              : authMethod === "otp"
                ? "Send OTP Code"
                : "Send Magic Link"}
          </Button>

          {/* Back to password login */}
          <p className="text-center text-sm text-paper-muted">
            Prefer password login?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-paper-ink underline underline-offset-2 hover:text-black"
            >
              Sign in with password
            </Link>
          </p>
        </form>

        {/* Help text */}
        <div className={authHelpCardClassName}>
          <p className="text-xs text-paper-muted">
            {authMethod === "otp" ? (
              <>
                <strong className="font-medium text-paper-ink">
                  How OTP works:
                </strong>{" "}
                We'll send a 6-digit code to your email. Enter that code on the
                next screen to sign in. Codes expire after 10 minutes.
              </>
            ) : (
              <>
                <strong className="font-medium text-paper-ink">
                  How Magic Link works:
                </strong>{" "}
                We'll send a secure link to your email. Click it to sign in
                instantly. Links expire after 10 minutes and can only be used
                once.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
