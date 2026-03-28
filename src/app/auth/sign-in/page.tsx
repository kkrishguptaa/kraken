import { AuthCenteredLayout } from "@/components/auth/auth-centered-layout";
import { SignInForm } from "@/components/auth/sign-in-form";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  return (
    <AuthCenteredLayout>
      <SignInForm />
    </AuthCenteredLayout>
  );
}
