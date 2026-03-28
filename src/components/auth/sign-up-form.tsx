"use client";

import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  sendEmailVerificationOTP,
  signUpWithEmail,
} from "@/actions/auth-actions";
import { AuthEntryOptions } from "@/components/auth/auth-entry-options";
import { AuthField } from "@/components/auth/auth-field";
import {
  authPrimaryButtonClassName,
  getAuthInputClassName,
} from "@/components/auth/auth-styles";

type SignUpFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-paper-muted">
          GET STARTED
        </p>
        <h1 className="font-serif text-3xl leading-tight">
          Create your account
        </h1>
      </div>

      <div className="space-y-4">
        <AuthEntryOptions separatorLabel="or sign up with email" />

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            clearErrors();
            const email = values.email.trim().toLowerCase();
            const result = await signUpWithEmail({
              ...values,
              email,
              username: values.username.trim().toLowerCase(),
            });

            if (!result.ok) {
              if (result.fieldErrors?.username) {
                setError("username", { message: result.fieldErrors.username });
              }
              setError("root", { message: result.message });
              return;
            }

            const verifyResult = await sendEmailVerificationOTP(email);
            router.push(
              `/auth/verify-email?email=${encodeURIComponent(email)}&flow=email-verification&method=otp${verifyResult.ok ? "" : "&notice=send-failed"}`,
            );
            router.refresh();
          })}
        >
          {/* Name field */}
          <AuthField
            id="name"
            label="Full name"
            labelClassName="block text-xs font-medium text-paper-ink"
            error={errors.name?.message}
            type="text"
            autoComplete="name"
            placeholder="Krish Garg"
            className="placeholder:text-paper-muted/50"
            {...register("name", {
              required: "Name is required.",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters.",
              },
            })}
          />

          {/* Username field */}
          <AuthField
            id="username"
            label="Username"
            labelClassName="block text-xs font-medium text-paper-ink"
            error={errors.username?.message}
            hint="This becomes your public profile identifier."
            type="text"
            autoComplete="username"
            placeholder="krishg"
            className="placeholder:text-paper-muted/50"
            {...register("username", {
              required: "Username is required.",
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Use letters, numbers, or underscores only.",
              },
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters.",
              },
            })}
          />

          {/* Email field */}
          <AuthField
            id="email"
            label="Email"
            labelClassName="block text-xs font-medium text-paper-ink"
            error={errors.email?.message}
            type="email"
            autoComplete="email"
            placeholder="krish@krishg.com"
            className="placeholder:text-paper-muted/50"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
          />

          {/* Password field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-paper-ink"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={getAuthInputClassName({
                  invalid: Boolean(errors.password),
                  className: "pr-16",
                })}
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-paper-muted hover:text-paper-ink"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password?.message ? (
              <p className="text-xs text-red-700">{errors.password.message}</p>
            ) : null}
          </div>

          {errors.root?.message ? (
            <p className="text-sm text-red-700">{errors.root.message}</p>
          ) : null}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={authPrimaryButtonClassName}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>

          {/* Sign in link */}
          <p className="text-center text-sm text-paper-muted">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-paper-ink underline underline-offset-2 hover:text-black"
            >
              Sign in
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-paper-muted">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
