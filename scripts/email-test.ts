import dotenv from "dotenv";
import { jsx } from "react/jsx-runtime";
import { AuthMagicLinkEmail } from "@/emails/auth-magic-link-email";
import { AuthOtpEmail } from "@/emails/auth-otp-email";
import { NewIssueEmail } from "@/emails/new-issue-email";
import { SubscriptionConfirmationEmail } from "@/emails/subscription-confirmation-email";
import { SubscriptionOptInEmail } from "@/emails/subscription-opt-in-email";
import { getAppUrl, getFromEmail, getResendClient } from "@/lib/resend";

dotenv.config({
  path: `${process.cwd()}/.env.local`,
});

async function run() {
  const resend = getResendClient();
  const to = process.env.TEST_EMAIL_TO;

  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!to) {
    throw new Error(
      "Set TEST_EMAIL_TO in your environment to run email tests.",
    );
  }

  const appUrl = getAppUrl();
  const from = getFromEmail();

  const emails = [
    {
      subject: "[Kraken Test] New Issue",
      react: jsx(NewIssueEmail, {
        publicationName: "Kraken Daily",
        issueTitle: "A calm saturday issue",
        issueUrl: `${appUrl}/@kraken/12`,
        issueContent:
          "This is the full issue content.\n\nIt includes multiple paragraphs and spacing, exactly as your subscribers receive it.",
        unsubscribeUrl: `${appUrl}/api/subscriptions/unsubscribe/test-token`,
      }),
    },
    {
      subject: "[Kraken Test] Subscription Confirmed",
      react: jsx(SubscriptionConfirmationEmail, {
        publicationName: "Kraken Daily",
        publicationUsername: "kraken",
        publicationUrl: `${appUrl}/@kraken`,
        unsubscribeUrl: `${appUrl}/api/subscriptions/unsubscribe/test-token`,
      }),
    },
    {
      subject: "[Kraken Test] Confirm Subscription",
      react: jsx(SubscriptionOptInEmail, {
        publicationName: "Kraken Daily",
        publicationUsername: "kraken",
        confirmUrl: `${appUrl}/api/subscriptions/confirm/test-token`,
        unsubscribeUrl: `${appUrl}/api/subscriptions/unsubscribe/test-token`,
      }),
    },
    {
      subject: "[Kraken Test] Auth Magic Link",
      react: jsx(AuthMagicLinkEmail, {
        url: `${appUrl}/auth/sign-in?magic=1`,
      }),
    },
    {
      subject: "[Kraken Test] Auth OTP",
      react: jsx(AuthOtpEmail, {
        otp: "935421",
        type: "sign-in",
      }),
    },
  ];

  for (const email of emails) {
    await resend.emails.send({
      from,
      to,
      subject: email.subject,
      react: email.react,
    });
  }

  console.log(`Sent ${emails.length} test emails to ${to}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
