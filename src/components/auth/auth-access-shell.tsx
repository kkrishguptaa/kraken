import type { ReactNode } from "react";

type AuthAccessShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthAccessShell({
  title,
  subtitle,
  children,
}: AuthAccessShellProps) {
  return (
    <main className="min-h-screen bg-paper-base px-4 py-16 text-paper-ink sm:px-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-paper-muted">
            Access Check
          </p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
            {title}
          </h1>
          <p className="text-sm text-paper-muted sm:text-base">{subtitle}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
