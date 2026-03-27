"use client";

import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { saveOnboardingUsername } from "@/actions/auth-actions";
import { authClient } from "@/lib/auth-client";

type OnboardingFormValues = {
  name: string;
  username: string;
};

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export function OnboardingForm() {
  const router = useRouter();
  const [destination, setDestination] = useState<"home" | "editorial">("home");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [checkingTimeout, setCheckingTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    defaultValues: {
      name: "",
      username: "",
    },
  });

  const username = watch("username");

  // Real-time username availability checking with debouncing
  useEffect(() => {
    // Clear existing timeout
    if (checkingTimeout) {
      clearTimeout(checkingTimeout);
    }

    const trimmedUsername = username.trim().toLowerCase();

    // Reset if empty
    if (!trimmedUsername) {
      setUsernameStatus("idle");
      return;
    }

    // Check pattern validity first
    const isValidPattern = /^[a-zA-Z0-9_]+$/.test(trimmedUsername);
    if (!isValidPattern) {
      setUsernameStatus("invalid");
      return;
    }

    // Check length
    if (trimmedUsername.length < 3) {
      setUsernameStatus("invalid");
      return;
    }

    // Set status to checking
    setUsernameStatus("checking");

    // Debounce the API call
    const timeout = setTimeout(async () => {
      try {
        const result = await authClient.isUsernameAvailable({
          username: trimmedUsername,
        });

        if (result.error) {
          setUsernameStatus("idle");
          return;
        }

        if (result.data?.available) {
          setUsernameStatus("available");
          clearErrors("username");
        } else {
          setUsernameStatus("taken");
          setError("username", {
            message: "This username is already taken.",
          });
        }
      } catch (error) {
        setUsernameStatus("idle");
      }
    }, 500); // 500ms debounce

    setCheckingTimeout(timeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [username, setError, clearErrors]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-paper-muted">
          WELCOME TO KRAKEN
        </p>
        <h1 className="font-serif text-3xl leading-tight">Complete your profile</h1>
        <p className="text-sm text-paper-muted">
          Choose your username and display name to get started
        </p>
      </div>

      <div className="space-y-6">
        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            clearErrors();

            // Double-check username availability before submitting
            if (usernameStatus !== "available") {
              setError("username", {
                message: "Please choose a valid and available username.",
              });
              return;
            }

            const result = await saveOnboardingUsername({
              username: values.username.trim().toLowerCase(),
              name: values.name.trim(),
            });

            if (!result.ok) {
              if (result.fieldErrors?.username) {
                setError("username", { message: result.fieldErrors.username });
              }
              setError("root", { message: result.message });
              return;
            }

            // Navigate based on selected destination
            if (destination === "editorial") {
              router.push("/editorial");
            } else {
              router.push("/");
            }
            router.refresh();
          })}
        >
          {/* Name field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-paper-ink"
            >
              Display name
            </label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Krish Gupta"
              className={[
                "w-full cursor-text border bg-white px-3 py-2 text-sm outline-none transition",
                "border-paper-border text-paper-ink placeholder:text-paper-muted/50",
                "focus:border-paper-accent focus:ring-2 focus:ring-[rgb(106_64_32_/_0.2)]",
                errors.name
                  ? "border-red-600 focus:border-red-600 focus:ring-red-200"
                  : "",
              ].join(" ")}
              {...register("name", {
                required: "Display name is required.",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters.",
                },
              })}
            />
            {errors.name?.message ? (
              <p className="text-xs text-red-700">{errors.name.message}</p>
            ) : (
              <p className="text-xs text-paper-muted">
                This is how your name appears on your publication
              </p>
            )}
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
                usernameStatus === "taken" || errors.username
                  ? "border-red-600 focus:border-red-600 focus:ring-red-200"
                  : usernameStatus === "available"
                    ? "border-green-600 focus:border-green-600 focus:ring-green-200"
                    : "",
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

            {/* Username status and URL preview */}
            <div className="space-y-1">
              {usernameStatus === "checking" && (
                <p className="text-xs text-paper-muted">
                  Checking availability...
                </p>
              )}
              {usernameStatus === "available" && !errors.username && (
                <p className="text-xs text-green-700">
                  ✓ Username is available
                </p>
              )}
              {(usernameStatus === "taken" || errors.username) && (
                <p className="text-xs text-red-700">
                  {errors.username?.message || "This username is taken."}
                </p>
              )}
              {usernameStatus === "idle" && !errors.username && (
                <p className="text-xs text-paper-muted">
                  Your unique identifier
                </p>
              )}

              {/* Live URL preview */}
              {username && username.trim() && (
                <p className="text-xs text-paper-muted">
                  Your URL:{" "}
                  <span className="font-mono text-paper-ink">
                    kraken.krishg.com/@{username.trim().toLowerCase()}
                  </span>
                </p>
              )}
            </div>
          </div>

          {errors.root?.message ? (
            <p className="text-sm text-red-700">{errors.root.message}</p>
          ) : null}

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || usernameStatus !== "available"}
              onClick={() => setDestination("editorial")}
              className="w-full cursor-pointer border border-paper-ink bg-paper-ink px-4 py-3 text-sm font-medium text-paper-base transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && destination === "editorial"
                ? "Setting up..."
                : "Start Writing"}
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || usernameStatus !== "available"}
              onClick={() => setDestination("home")}
              className="w-full cursor-pointer border border-paper-border bg-white px-4 py-3 text-sm font-medium text-paper-ink transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && destination === "home"
                ? "Setting up..."
                : "Go to Home"}
            </Button>
          </div>
        </form>

        {/* Info box */}
        <div className="rounded border border-paper-border bg-white p-4">
          <p className="text-xs text-paper-muted">
            <strong className="font-medium text-paper-ink">
              What's the difference?
            </strong>{" "}
            Start Writing takes you directly to the editorial page where you can create your first Kraken. Go to Home shows you the feed and your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
