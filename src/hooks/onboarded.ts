import { redirect } from "next/navigation";
import { useAuthenticated } from "./authenticated";

export async function useOnboarded() {
  const session = await useAuthenticated();

  if (!session.user.username) {
    redirect("/auth/onboarding");
  }

  return session;
}
