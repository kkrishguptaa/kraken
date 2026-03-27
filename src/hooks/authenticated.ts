import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function useAuthenticated() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/unauthenticated");
  }

  return session;
}
