import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  eyebrow = "Kraken Auth",
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="auth-paper-grain relative min-h-screen px-4 py-8 text-paper-ink sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-paper-muted">
            {eyebrow}
          </p>
          <div className="space-y-3">
            <h1 className="font-serif text-4xl leading-none tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-paper-muted sm:text-base">
              {subtitle}
            </p>
          </div>
          <div className="h-px w-full bg-paper-border" />
        </header>

        {children}

        {footer ? (
          <footer className="pt-3 text-sm text-paper-muted">{footer}</footer>
        ) : null}
      </div>
    </main>
  );
}
