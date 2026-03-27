import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { EmailAuthForm } from "@/components/auth/email-auth-form";

export const dynamic = "force-dynamic";

export default function EmailAuthPage() {
  return (
    <AuthSplitLayout>
      <EmailAuthForm />
    </AuthSplitLayout>
  );
}
