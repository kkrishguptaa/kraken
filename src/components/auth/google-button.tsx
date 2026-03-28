"use client";

import { Button } from "@base-ui/react/button";
import {
  authSurfaceButtonClassName,
  joinClassNames,
} from "@/components/auth/auth-styles";
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
      className={joinClassNames(
        "flex items-center justify-center gap-2",
        authSurfaceButtonClassName,
        className,
      )}
    >
      {label}
    </Button>
  );
}
