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
import { jsx } from "react/jsx-runtime";
import * as schema from "@/db/schema";
import { AuthMagicLinkEmail } from "@/emails/auth-magic-link-email";
import { AuthOtpEmail } from "@/emails/auth-otp-email";
import { db } from "@/lib/db";
import { getFromEmail, getResendClient } from "@/lib/resend";

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
      async sendMagicLink({ email, url }) {
        const resend = getResendClient();
        if (!resend) {
          return;
        }

        await resend.emails.send({
          from: getFromEmail(),
          to: email,
          subject: "Sign in to Kraken",
          react: jsx(AuthMagicLinkEmail, {
            url,
          }),
        });
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const resend = getResendClient();
        if (!resend) {
          return;
        }

        await resend.emails.send({
          from: getFromEmail(),
          to: email,
          subject:
            type === "email-verification"
              ? "Verify your email"
              : type === "sign-in"
                ? "Your sign in code"
                : "Your verification code",
          react: jsx(AuthOtpEmail, {
            otp,
            type,
          }),
        });
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
