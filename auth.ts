import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  captcha,
  emailOTP,
  haveIBeenPwned,
  lastLoginMethod,
  magicLink,
  twoFactor,
  username,
} from "better-auth/plugins";
import * as schema from "@/db/schema";
import { db } from "@/lib/db";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    twoFactor(),
    username(),
    magicLink({
      async sendMagicLink({ email, token, url, metadata }, ctx) {},
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    captcha({
      provider: "google-recaptcha",
      secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY!,
    }),
    haveIBeenPwned(),
    lastLoginMethod(),
    nextCookies(), // needs to be last in the plugins array
  ],
});
