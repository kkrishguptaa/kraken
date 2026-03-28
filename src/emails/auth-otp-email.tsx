import { Section, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "@/emails/components/email-shell";

type AuthOtpEmailProps = {
  otp: string;
  type: "sign-in" | "email-verification" | "forgot-password";
};

export function AuthOtpEmail({ otp, type }: AuthOtpEmailProps) {
  const titleMap = {
    "sign-in": "Your sign in code",
    "email-verification": "Verify your email",
    "forgot-password": "Reset your password",
  } as const;
  const introMap = {
    "sign-in": "Enter this one-time code in Kraken to finish signing in.",
    "email-verification":
      "Enter this code to verify your email address and continue setting up Kraken.",
    "forgot-password":
      "Enter this code to confirm that you want to reset your password.",
  } as const;

  const title = titleMap[type] || "Your Kraken code";
  const intro = introMap[type] || "Enter this one-time code in Kraken.";

  return (
    <EmailShell
      preview={title}
      eyebrow={
        type === "email-verification" ? "Email Verification" : "Account Access"
      }
      title={title}
      intro={<Text style={emailStyles.copy}>{intro}</Text>}
      footer={
        <Text style={emailStyles.muted}>
          This code expires soon. If you did not request it, you can ignore this
          email.
        </Text>
      }
    >
      <Section style={styles.codeCard}>
        <Text style={styles.codeLabel}>One-time code</Text>
        <Text style={styles.code}>{otp}</Text>
      </Section>
    </EmailShell>
  );
}

const styles = {
  codeCard: {
    backgroundColor: "#f6f1e7",
    border: "1px solid #d4cab5",
    padding: "20px 22px",
  },
  codeLabel: {
    margin: "0 0 8px",
    color: "#645d52",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },
  code: {
    margin: "0",
    color: "#16120f",
    fontSize: "28px",
    letterSpacing: "0.24em",
    fontWeight: "700",
  },
} as const;
