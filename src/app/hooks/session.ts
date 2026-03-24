"use server";

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { useAuthenticated } from "./authenticated";

export async function useSession() {
  await useAuthenticated();

  const session = await auth.api.getSession({
    headers: await headers()
  })

  return session!;
}