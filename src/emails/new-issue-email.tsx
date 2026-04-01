import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailMarkdown } from "@/emails/components/email-markdown";

type NewIssueEmailProps = {
  publicationName: string;
  issueTitle: string;
  issueContent: string;
  signOff?: string;
  unsubscribeUrl?: string;
};

export function NewIssueEmail({
  publicationName,
  issueTitle,
  issueContent,
  signOff,
  unsubscribeUrl,
}: NewIssueEmailProps) {
  const content =
    issueContent.trim() || "Open the web edition to read this issue.";
  const resolvedSignOff = signOff?.trim() || publicationName;

  return (
    <Html>
      <Head />
      <Preview>{`${publicationName}: ${issueTitle}`}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.publication}>{publicationName}</Text>
          <Text style={styles.title}>{issueTitle}</Text>

          <Section style={styles.issueWrap}>
            <EmailMarkdown content={content} />
          </Section>

          <Text style={styles.signOff}>— {resolvedSignOff}</Text>
          {unsubscribeUrl ? (
            <Text style={styles.unsubscribeWrap}>
              <Link href={unsubscribeUrl} style={styles.unsubscribeLink}>
                Unsubscribe
              </Link>
            </Text>
          ) : null}
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#fffdf8",
    color: "#16120f",
    fontFamily: "Georgia, 'Times New Roman', serif",
    margin: "0",
    padding: "24px 12px",
  },
  container: {
    margin: "0 auto",
    maxWidth: "680px",
    padding: "24px 8px 40px",
  },
  publication: {
    margin: "0 0 18px",
    color: "#645d52",
    fontSize: "14px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  title: {
    margin: "0 0 24px",
    color: "#16120f",
    fontSize: "34px",
    fontWeight: "500",
    lineHeight: "1.15",
  },
  issueWrap: {
    margin: "0",
  },
  signOff: {
    margin: "28px 0 0",
    color: "#16120f",
    fontSize: "17px",
    lineHeight: "1.75",
  },
  unsubscribeWrap: {
    margin: "24px 0 0",
  },
  unsubscribeLink: {
    color: "#645d52",
    fontSize: "13px",
    lineHeight: "1.6",
    textDecoration: "underline",
  },
} as const;
