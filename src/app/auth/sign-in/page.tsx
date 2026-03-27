import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignInForm } from "@/components/auth/sign-in-form";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <AuthSplitLayout>
      <SignInForm />
    </AuthSplitLayout>
  );
}
