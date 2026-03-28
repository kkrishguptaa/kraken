import { AuthCenteredLayout } from "@/components/auth/auth-centered-layout";
import { EmailAuthForm } from "@/components/auth/email-auth-form";

export const dynamic = "force-dynamic";

export default async function EmailAuthPage() {
  return (
    <AuthCenteredLayout>
      <EmailAuthForm />
    </AuthCenteredLayout>
  );
}
