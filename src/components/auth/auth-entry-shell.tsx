import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

type AuthEntryShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthEntryShell({
  title,
  subtitle,
  children,
  footer,
}: AuthEntryShellProps) {
  return (
    <AuthShell
      title={title}
      subtitle={subtitle}
      eyebrow="Account Access"
      footer={footer}
    >
      {children}
    </AuthShell>
  );
}
