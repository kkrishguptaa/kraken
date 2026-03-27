import { AuthAccessShell } from "@/components/auth/auth-access-shell";
import { AuthStatusPanel } from "@/components/auth/auth-status-panel";

export const dynamic = "force-dynamic";

export default function UnauthenticatedPage() {
  return (
    <AuthAccessShell
      title="You're not signed in"
      subtitle="This page requires an authenticated account session."
    >
      <AuthStatusPanel
        title="Session required"
        description="Please sign in to access this area."
        primaryHref="/auth/sign-in"
        primaryLabel="Go to sign in"
        secondaryHref="/auth/sign-up"
        secondaryLabel="Create a new account"
      />
    </AuthAccessShell>
  );
}
