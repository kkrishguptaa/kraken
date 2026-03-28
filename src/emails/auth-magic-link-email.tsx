import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type AuthMagicLinkEmailProps = {
  url: string;
};

export function AuthMagicLinkEmail({ url }: AuthMagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Kraken</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Sign in to Kraken</Heading>
          <Text style={styles.copy}>
            Use this secure link to sign in to your Kraken account.
          </Text>
          <Section style={styles.buttonWrap}>
            <Button href={url} style={styles.button}>
              Sign in
            </Button>
          </Section>
          <Text style={styles.footer}>If you did not request this, you can ignore this email.</Text>
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
  buttonWrap: {
    margin: "18px 0 16px",
  },
  button: {
    backgroundColor: "#16120f",
    color: "#f6f1e7",
    textDecoration: "none",
    padding: "11px 16px",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  footer: {
    margin: "0",
    fontSize: "13px",
    color: "#645d52",
    lineHeight: "1.5",
  },
};
