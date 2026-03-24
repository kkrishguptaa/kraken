import { usernameClient, twoFactorClient, magicLinkClient, emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient =  createAuthClient({
  plugins: [
    twoFactorClient(),
    usernameClient(),
    magicLinkClient(),
    emailOTPClient(),
  ]
})