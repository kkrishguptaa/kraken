import { redirect } from "next/navigation";
import { useAuthenticated } from "./authenticated";

export async function useNotOnboarded() {
  const session = await useAuthenticated();

  if (session.user.username) {
    redirect("/");
  }

  return session;
}
