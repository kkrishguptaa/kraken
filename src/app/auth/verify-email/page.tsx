import { AuthCenteredLayout } from "@/components/auth/auth-centered-layout";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <AuthCenteredLayout backLabel="Back to sign in" backHref="/auth/sign-in">
      <VerifyEmailForm />
    </AuthCenteredLayout>
  );
}
