import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function useAuthenticated() {
  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.error("Failed to get session in useAuthenticated:", error);
    redirect("/auth/unauthenticated");
  }

  if (!session) {
    redirect("/auth/unauthenticated");
  }

  return session;
}
