import { Link, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "@/emails/components/email-shell";

type SubscriptionConfirmationEmailProps = {
  publicationName: string;
  publicationUsername: string;
  publicationUrl: string;
  unsubscribeUrl: string;
};

export function SubscriptionConfirmationEmail({
  publicationName,
  publicationUsername,
  publicationUrl,
  unsubscribeUrl,
}: SubscriptionConfirmationEmailProps) {
  return (
    <EmailShell
      preview={`You are subscribed to ${publicationName}`}
      eyebrow={`@${publicationUsername}`}
      title="Subscription confirmed"
      intro={
        <Text style={emailStyles.copy}>
          New editions from {publicationName} will now arrive in your inbox as
          they are published.
        </Text>
      }
      action={{ href: publicationUrl, label: "Visit Publication" }}
      footer={
        <>
          <Text style={emailStyles.muted}>
            If this was not you, you can unsubscribe instantly.
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
