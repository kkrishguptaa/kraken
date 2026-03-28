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

type NewIssueEmailProps = {
  publicationName: string;
  issueTitle: string;
  issueUrl: string;
  issueContent: string;
  unsubscribeUrl: string;
};

export function NewIssueEmail({
  publicationName,
  issueTitle,
  issueUrl,
  issueContent,
  unsubscribeUrl,
}: NewIssueEmailProps) {
  // Escape HTML in content to prevent injection
  const sanitizedContent = issueContent.replace(/[<>]/g, (char) =>
    char === '<' ? '&lt;' : '&gt;'
  );

  return (
    <Html>
      <Head />
      <Preview>New issue from {publicationName}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.eyebrow}>{publicationName}</Text>
          <Heading style={styles.heading}>{issueTitle}</Heading>
          <Text style={styles.copy}>{sanitizedContent}</Text>

          <Section style={styles.buttonWrap}>
            <Button href={issueUrl} style={styles.button}>
              Read this issue
            </Button>
          </Section>

          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            You are receiving this because you subscribed to {publicationName}.
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
  eyebrow: {
    margin: "0 0 14px",
    color: "#645d52",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },
  heading: {
    margin: "0 0 14px",
    fontSize: "30px",
    fontWeight: "500",
    lineHeight: "1.15",
  },
  copy: {
    margin: "0 0 16px",
    fontSize: "17px",
    lineHeight: "1.75",
    whiteSpace: "pre-wrap" as const,
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
