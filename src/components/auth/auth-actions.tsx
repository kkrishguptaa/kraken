import { Button } from "@base-ui/react/button";
import Link from "next/link";
import type { ReactNode } from "react";
import { authPrimaryButtonClassName } from "@/components/auth/auth-styles";

type AuthActionsProps = {
  submitLabel: string;
  isPending?: boolean;
  secondaryHref?: string;
  secondaryLabel?: string;
  helper?: ReactNode;
};

export function AuthActions({
  submitLabel,
  isPending = false,
  secondaryHref,
  secondaryLabel,
  helper,
}: AuthActionsProps) {
  return (
    <div className="space-y-3 pt-2">
      <Button
        type="submit"
        disabled={isPending}
        className={authPrimaryButtonClassName}
      >
        {isPending ? "Working..." : submitLabel}
      </Button>

      {secondaryHref && secondaryLabel ? (
        <p className="text-sm text-paper-muted">
          <Link
            className="underline underline-offset-2 hover:text-paper-ink"
            href={secondaryHref}
          >
            {secondaryLabel}
          </Link>
        </p>
      ) : null}

      {helper ? <div className="text-xs text-paper-muted">{helper}</div> : null}
    </div>
  );
}
