import { AuthCenteredLayout } from "@/components/auth/auth-centered-layout";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { useNotOnboarded } from "@/hooks/not-onboarded";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  await useNotOnboarded();

  return (
    <AuthCenteredLayout>
      <OnboardingForm />
    </AuthCenteredLayout>
  );
}
