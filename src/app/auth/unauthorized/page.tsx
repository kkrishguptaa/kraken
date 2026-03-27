import { AuthAccessShell } from "@/components/auth/auth-access-shell";
import { AuthStatusPanel } from "@/components/auth/auth-status-panel";

export const dynamic = "force-dynamic";

export default function UnauthorizedPage() {
  return (
    <AuthAccessShell
      title="You're signed in, but blocked"
      subtitle="Your account doesn't currently have permission to access this resource."
    >
      <AuthStatusPanel
        tone="warning"
        title="Unauthorized"
        description="If this seems incorrect, ask a publication owner or admin to grant access."
        primaryHref="/"
        primaryLabel="Back to home"
        secondaryHref="/auth/sign-in"
        secondaryLabel="Switch account"
      />
    </AuthAccessShell>
  );
}
