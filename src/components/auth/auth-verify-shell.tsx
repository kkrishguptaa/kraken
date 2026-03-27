import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

type AuthVerifyShellProps = {
  children: ReactNode;
};

export function AuthVerifyShell({ children }: AuthVerifyShellProps) {
  return (
    <AuthShell
      title="Verify and continue"
      subtitle="Use an email code or magic link to securely continue into your account."
      eyebrow="Verification"
    >
      {children}
    </AuthShell>
  );
}
