import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

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

  const title = titleMap[type] || "Your Kraken code";

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>{title}</Heading>
          <Text style={styles.copy}>Enter this code in Kraken:</Text>
          <Text style={styles.code}>{otp}</Text>
          <Text style={styles.footer}>This code expires soon. If you did not request it, ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f1e7",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#16120f",
    margin: "0",
    padding: "24px 0",
  },
  container: {
    margin: "0 auto",
    maxWidth: "600px",
    border: "1px solid #d4cab5",
    backgroundColor: "#fffdf8",
    padding: "32px",
  },
  heading: {
    margin: "0 0 12px",
    fontSize: "30px",
    fontWeight: "500",
    lineHeight: "1.15",
  },
  copy: {
    margin: "0 0 8px",
    fontSize: "17px",
    lineHeight: "1.75",
  },
  code: {
    margin: "12px 0 16px",
    fontSize: "28px",
    letterSpacing: "0.24em",
    fontWeight: "700",
  },
  footer: {
    margin: "0",
    fontSize: "13px",
    color: "#645d52",
    lineHeight: "1.5",
  },
};
