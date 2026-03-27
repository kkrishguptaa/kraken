import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

type AuthOnboardingShellProps = {
  children: ReactNode;
};

export function AuthOnboardingShell({ children }: AuthOnboardingShellProps) {
  return (
    <AuthShell
      title="Choose your username"
      subtitle="One final step: pick a unique username to complete your profile."
      eyebrow="Onboarding"
    >
      {children}
    </AuthShell>
  );
}
