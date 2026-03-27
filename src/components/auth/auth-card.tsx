import { Separator } from "@base-ui/react/separator";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
};

export function AuthCard({
  title,
  description,
  children,
  aside,
}: AuthCardProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <article className="border border-paper-border bg-white/70 p-5 shadow-[6px_6px_0_0_rgb(22_18_15_/_0.08)] sm:p-8">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl leading-tight sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="text-sm leading-relaxed text-paper-muted">
              {description}
            </p>
          ) : null}
        </div>

        <Separator className="my-6 bg-paper-border" />

        {children}
      </article>

      {aside ? (
        <aside className="border border-paper-border bg-white/65 p-5 sm:p-6">
          {aside}
        </aside>
      ) : null}
    </section>
  );
}
