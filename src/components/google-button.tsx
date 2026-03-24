"use client"

import { authClient } from "@/lib/auth-client"

export function GoogleButton() {
  return (
    <button type="button" onClick={async () => {
      await authClient.signIn.social({ provider: 'google'})
    }} className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
      Sign in with Google
    </button>
  )
}
