import { AuthCenteredLayout } from "@/components/auth/auth-centered-layout";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  return (
    <AuthCenteredLayout>
      <SignUpForm />
    </AuthCenteredLayout>
  );
}
