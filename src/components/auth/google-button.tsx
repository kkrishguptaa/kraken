"use client";

import { Button } from "@base-ui/react/button";
import { authClient } from "@/lib/auth-client";

type GoogleButtonProps = {
  className?: string;
  label?: string;
};

export function GoogleButton({
  className,
  label = "Sign in with Google",
}: GoogleButtonProps) {
  return (
    <Button
      type="button"
      onClick={async () => {
        await authClient.signIn.social({ provider: "google" });
      }}
      className={
        className ??
        "flex cursor-pointer items-center gap-2 border px-4 py-2 text-sm transition hover:bg-gray-100"
      }
    >
      {label}
    </Button>
  );
}
