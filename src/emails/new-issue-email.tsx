import { Link, Section, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "@/emails/components/email-shell";

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
  const content =
    issueContent.trim() || "Open the web edition to read this issue.";

  return (
    <EmailShell
      preview={`New issue from ${publicationName}: ${issueTitle}`}
      eyebrow={publicationName}
      title={issueTitle}
      intro={
        <Text style={emailStyles.copy}>
          A new edition has been published and is ready to read on Kraken.
        </Text>
      }
      action={{ href: issueUrl, label: "Read On Kraken" }}
      footer={
        <>
          <Text style={emailStyles.muted}>
            You are receiving this because you subscribed to {publicationName}.
          </Text>
          <Link href={unsubscribeUrl} style={styles.link}>
            Unsubscribe from this publication
          </Link>
        </>
      }
    >
      <Section style={styles.issueCard}>
        <Text style={styles.issueCopy}>{content}</Text>
      </Section>
    </EmailShell>
  );
}

const styles = {
  issueCard: {
    backgroundColor: "#f6f1e7",
    border: "1px solid #d4cab5",
    padding: "20px 22px",
  },
  issueCopy: {
    margin: "0",
    color: "#16120f",
    fontSize: "17px",
    lineHeight: "1.75",
    whiteSpace: "pre-wrap" as const,
  },
  link: {
    color: "#16120f",
    fontSize: "13px",
    lineHeight: "1.6",
    textDecoration: "underline",
  },
} as const;
