"use client";

import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmail } from "@/actions/auth-actions";
import { AuthEntryOptions } from "@/components/auth/auth-entry-options";
import { AuthField } from "@/components/auth/auth-field";
import {
  authPrimaryButtonClassName,
  getAuthInputClassName,
} from "@/components/auth/auth-styles";

type SignInFormValues = {
  email: string;
  password: string;
};

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-paper-muted">
          WELCOME BACK
        </p>
        <h1 className="font-serif text-3xl leading-tight">
          Sign in to your account
        </h1>
      </div>

      <div className="space-y-4">
        <AuthEntryOptions separatorLabel="or sign in with email" />

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            clearErrors("root");
            const result = await signInWithEmail(values);
            if (!result.ok) {
              setError("root", { message: result.message });
              return;
            }
            router.push("/");
            router.refresh();
          })}
        >
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-paper-ink"
              >
                Password
              </label>
              <Link
                href="/auth/verify-email"
                className="text-xs text-paper-muted hover:text-paper-ink"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          {/* Sign up link */}
          <p className="text-center text-sm text-paper-muted">
            Don't have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-paper-ink underline underline-offset-2 hover:text-black"
            >
              Create one
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-paper-muted">
          By signing in you agree to our{" "}
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
