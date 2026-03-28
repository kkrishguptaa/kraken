import Link from "next/link";
import type { ReactNode } from "react";

type AuthCenteredLayoutProps = {
  children: ReactNode;
  backLabel?: string;
  backHref?: string;
};

export function AuthCenteredLayout({
  children,
  backLabel = "Back to home",
  backHref = "/",
}: AuthCenteredLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-paper-base">
      {/* Header */}
      <div className="border-b border-paper-border bg-paper-base px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="font-serif text-lg font-medium tracking-tight"
          >
            KRAKEN NEWS
          </Link>
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm text-paper-muted transition hover:text-paper-ink"
          >
            <span>←</span>
            <span>{backLabel}</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
