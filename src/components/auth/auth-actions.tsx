import { Button } from "@base-ui/react/button";
import Link from "next/link";
import type { ReactNode } from "react";

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
        className="w-full cursor-pointer border border-paper-ink bg-paper-ink px-4 py-2 text-sm text-paper-base transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
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
