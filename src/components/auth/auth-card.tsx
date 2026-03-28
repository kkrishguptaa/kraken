import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";

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
      <Card variant="elevated">
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

        <Divider className="my-6" />

        {children}
      </Card>

      {aside ? (
        <Card variant="subtle" className="p-5 sm:p-6">
          {aside}
        </Card>
      ) : null}
    </section>
  );
}
