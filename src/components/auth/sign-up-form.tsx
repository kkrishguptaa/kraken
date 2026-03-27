"use client";

import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpWithEmail } from "@/actions/auth-actions";
import { GoogleButton } from "@/components/auth/google-button";

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
        <h1 className="font-serif text-3xl leading-tight">Create your account</h1>
      </div>

      <div className="space-y-4">
        {/* Google Button */}
        <GoogleButton
          label="Continue with Google"
          className="w-full cursor-pointer border border-paper-border bg-white px-4 py-3 text-sm font-medium transition hover:bg-gray-50"
        />

        {/* Email OTP and Magic Link buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            onClick={() => router.push("/auth/email")}
            className="w-full cursor-pointer border border-paper-border bg-white px-4 py-3 text-sm font-medium transition hover:bg-gray-50"
          >
            Email OTP
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/auth/email")}
            className="w-full cursor-pointer border border-paper-border bg-white px-4 py-3 text-sm font-medium transition hover:bg-gray-50"
          >
            Magic Link
          </Button>
        </div>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-paper-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-paper-base px-2 text-paper-muted">
              or sign up with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            clearErrors();
            const result = await signUpWithEmail({
              ...values,
              username: values.username.trim().toLowerCase(),
            });

            if (!result.ok) {
              if (result.fieldErrors?.username) {
                setError("username", { message: result.fieldErrors.username });
              }
              setError("root", { message: result.message });
              return;
            }

            router.push(
              `/auth/verify-email?email=${encodeURIComponent(values.email)}`,
            );
            router.refresh();
          })}
        >
          {/* Name field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-paper-ink"
            >
              Full name
            </label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Krish Garg"
              className={[
                "w-full cursor-text border bg-white px-3 py-2 text-sm outline-none transition",
                "border-paper-border text-paper-ink placeholder:text-paper-muted/50",
                "focus:border-paper-accent focus:ring-2 focus:ring-[rgb(106_64_32_/_0.2)]",
                errors.name ? "border-red-600 focus:border-red-600 focus:ring-red-200" : "",
              ].join(" ")}
              {...register("name", {
                required: "Name is required.",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters.",
                },
              })}
            />
            {errors.name?.message ? (
              <p className="text-xs text-red-700">{errors.name.message}</p>
            ) : null}
          </div>

          {/* Username field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-xs font-medium text-paper-ink"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="krishg"
              className={[
                "w-full cursor-text border bg-white px-3 py-2 text-sm outline-none transition",
                "border-paper-border text-paper-ink placeholder:text-paper-muted/50",
                "focus:border-paper-accent focus:ring-2 focus:ring-[rgb(106_64_32_/_0.2)]",
                errors.username ? "border-red-600 focus:border-red-600 focus:ring-red-200" : "",
              ].join(" ")}
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
            {errors.username?.message ? (
              <p className="text-xs text-red-700">{errors.username.message}</p>
            ) : (
              <p className="text-xs text-paper-muted">
                This becomes your public profile identifier.
              </p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-paper-ink"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="krish@krishg.com"
              className={[
                "w-full cursor-text border bg-white px-3 py-2 text-sm outline-none transition",
                "border-paper-border text-paper-ink placeholder:text-paper-muted/50",
                "focus:border-paper-accent focus:ring-2 focus:ring-[rgb(106_64_32_/_0.2)]",
                errors.email ? "border-red-600 focus:border-red-600 focus:ring-red-200" : "",
              ].join(" ")}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />
            {errors.email?.message ? (
              <p className="text-xs text-red-700">{errors.email.message}</p>
            ) : null}
          </div>

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
                className={[
                  "w-full cursor-text border bg-white px-3 py-2 pr-16 text-sm outline-none transition",
                  "border-paper-border text-paper-ink",
                  "focus:border-paper-accent focus:ring-2 focus:ring-[rgb(106_64_32_/_0.2)]",
                  errors.password ? "border-red-600 focus:border-red-600 focus:ring-red-200" : "",
                ].join(" ")}
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
            className="w-full cursor-pointer border border-paper-ink bg-paper-ink px-4 py-3 text-sm font-medium text-paper-base transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
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
