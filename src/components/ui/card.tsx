import clsx, { type ClassValue } from "clsx";
import type { ReactNode } from "react";

type CardVariant = "default" | "elevated" | "subtle";

const CardVariants: {
  [x in CardVariant]: ClassValue;
} = {
  default: "border border-paper-border bg-white/70",
  elevated: "border border-paper-border bg-white/70 shadow-card",
  subtle: "border border-paper-border bg-white/65",
};

export function Card({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}) {
  return (
    <div className={clsx(CardVariants[variant], "p-5 sm:p-8", className)}>
      {children}
    </div>
  );
}
