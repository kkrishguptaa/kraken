import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

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
    <Html>
      <Head />
      <Preview>You are subscribed to {publicationName}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Subscription confirmed</Heading>
          <Text style={styles.copy}>
            You will now receive new editions from {publicationName} in your
            inbox.
          </Text>

          <Section style={styles.buttonWrap}>
            <Button href={publicationUrl} style={styles.button}>
              Visit publication
            </Button>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            If this was not you, you can unsubscribe instantly.
          </Text>
          <Text style={styles.footer}>
            <a href={unsubscribeUrl} style={styles.link}>
              Unsubscribe from this publication
            </a>
          </Text>
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
  hr: {
    borderColor: "#d4cab5",
    margin: "20px 0",
  },
  footer: {
    margin: "0 0 6px",
    fontSize: "13px",
    color: "#645d52",
    lineHeight: "1.5",
  },
  link: {
    color: "#16120f",
    textDecoration: "underline",
  },
};
