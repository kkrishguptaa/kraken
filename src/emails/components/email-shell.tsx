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
import type { ReactNode } from "react";

type EmailShellProps = {
  preview: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  action?: {
    href: string;
    label: string;
  };
  children?: ReactNode;
  footer?: ReactNode;
};

export function EmailShell({
  preview,
  eyebrow,
  title,
  intro,
  action,
  children,
  footer,
}: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.masthead}>Kraken</Text>
          <Hr style={styles.rule} />

          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Heading style={styles.heading}>{title}</Heading>

          {intro ? <Section style={styles.section}>{intro}</Section> : null}
          {children ? (
            <Section style={styles.section}>{children}</Section>
          ) : null}

          {action ? (
            <Section style={styles.buttonWrap}>
              <Button href={action.href} style={styles.button}>
                {action.label}
              </Button>
            </Section>
          ) : null}

          {footer ? (
            <>
              <Hr style={styles.rule} />
              <Section style={styles.footerWrap}>{footer}</Section>
            </>
          ) : null}
        </Container>
      </Body>
    </Html>
  );
}

export const emailStyles = {
  copy: {
    margin: "0",
    color: "#16120f",
    fontSize: "17px",
    lineHeight: "1.75",
  },
  muted: {
    margin: "0 0 8px",
    color: "#645d52",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  link: {
    color: "#16120f",
    textDecoration: "underline",
  },
} as const;

const styles = {
  body: {
    backgroundColor: "#f6f1e7",
    color: "#16120f",
    fontFamily: "Georgia, 'Times New Roman', serif",
    margin: "0",
    padding: "24px 12px",
  },
  container: {
    margin: "0 auto",
    maxWidth: "620px",
    backgroundColor: "#fffdf8",
    border: "1px solid #d4cab5",
    padding: "32px",
  },
  masthead: {
    margin: "0",
    color: "#16120f",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
  },
  rule: {
    borderColor: "#d4cab5",
    margin: "16px 0 18px",
  },
  eyebrow: {
    margin: "0 0 12px",
    color: "#645d52",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },
  heading: {
    margin: "0",
    color: "#16120f",
    fontSize: "32px",
    fontWeight: "500",
    lineHeight: "1.15",
  },
  section: {
    marginTop: "18px",
  },
  buttonWrap: {
    marginTop: "22px",
  },
  button: {
    backgroundColor: "#16120f",
    color: "#f6f1e7",
    textDecoration: "none",
    padding: "12px 18px",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },
  footerWrap: {
    marginTop: "4px",
  },
} as const;
