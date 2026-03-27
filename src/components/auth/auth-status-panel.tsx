import Link from "next/link";
import type { ReactNode } from "react";

type AuthStatusPanelProps = {
  tone?: "neutral" | "warning";
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
};

export function AuthStatusPanel({
  tone = "neutral",
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  children,
}: AuthStatusPanelProps) {
  const toneClass =
    tone === "warning"
      ? "border-amber-700/40 bg-amber-50/60"
      : "border-paper-border bg-white/70";

  return (
    <section className={`space-y-5 border p-6 sm:p-8 ${toneClass}`}>
      <div className="space-y-2">
        <h2 className="font-serif text-3xl leading-tight">{title}</h2>
        <p className="text-sm leading-relaxed text-paper-muted">
          {description}
        </p>
      </div>

      {children}

      <div className="flex flex-wrap items-center gap-3">
        {primaryHref && primaryLabel ? (
          <Link
            href={primaryHref}
            className="inline-flex cursor-pointer border border-paper-ink bg-paper-ink px-4 py-2 text-sm text-paper-base transition hover:bg-black"
          >
            {primaryLabel}
          </Link>
        ) : null}

        {secondaryHref && secondaryLabel ? (
          <Link
            className="text-sm underline underline-offset-2 hover:text-paper-muted"
            href={secondaryHref}
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
