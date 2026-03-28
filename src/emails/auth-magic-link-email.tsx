import { Link, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "@/emails/components/email-shell";

type AuthMagicLinkEmailProps = {
  url: string;
};

export function AuthMagicLinkEmail({ url }: AuthMagicLinkEmailProps) {
  return (
    <EmailShell
      preview="Open your secure Kraken sign-in link"
      eyebrow="Account Access"
      title="Sign in to Kraken"
      intro={
        <Text style={emailStyles.copy}>
          Use the secure link below to continue into your account. It expires
          soon and can only be used once.
        </Text>
      }
      action={{ href: url, label: "Open Sign-In Link" }}
      footer={
        <>
          <Text style={styles.footerText}>
            If you did not request this sign-in, you can safely ignore this
            email.
          </Text>
          <Text style={styles.footerText}>
            If the button does not open, copy this link into your browser:
          </Text>
          <Link href={url} style={styles.link}>
            {url}
          </Link>
        </>
      }
    />
  );
}

const styles = {
  footerText: {
    margin: "0 0 8px",
    fontSize: "13px",
    color: "#645d52",
    lineHeight: "1.6",
  },
  link: {
    color: "#16120f",
    fontSize: "13px",
    lineHeight: "1.6",
    textDecoration: "underline",
  },
} as const;
