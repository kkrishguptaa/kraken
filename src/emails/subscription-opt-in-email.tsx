import { Link, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "@/emails/components/email-shell";

type SubscriptionOptInEmailProps = {
  publicationName: string;
  publicationUsername: string;
  confirmUrl: string;
  unsubscribeUrl: string;
};

export function SubscriptionOptInEmail({
  publicationName,
  publicationUsername,
  confirmUrl,
  unsubscribeUrl,
}: SubscriptionOptInEmailProps) {
  return (
    <EmailShell
      preview={`Confirm your subscription to ${publicationName}`}
      eyebrow={`@${publicationUsername}`}
      title="Confirm your subscription"
      intro={
        <Text style={emailStyles.copy}>
          Confirm once and new editions from {publicationName} will start
          arriving in your inbox.
        </Text>
      }
      action={{ href: confirmUrl, label: "Confirm Subscription" }}
      footer={
        <>
          <Text style={emailStyles.muted}>
            If this was not you, ignore this email or unsubscribe instantly.
          </Text>
          <Link href={unsubscribeUrl} style={styles.link}>
            Unsubscribe from this publication
          </Link>
        </>
      }
    />
  );
}

const styles = {
  link: {
    color: "#16120f",
    fontSize: "13px",
    lineHeight: "1.6",
    textDecoration: "underline",
  },
} as const;
