import { Link } from "@react-email/components";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export function EmailMarkdown({ content }: { content: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
        h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
        h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
        p: ({ children }) => <p style={styles.p}>{children}</p>,
        ul: ({ children }) => <ul style={styles.list}>{children}</ul>,
        ol: ({ children }) => <ol style={styles.list}>{children}</ol>,
        li: ({ children }) => <li style={styles.listItem}>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote style={styles.blockquote}>{children}</blockquote>
        ),
        a: ({ children, href }) => (
          <Link href={href ?? "#"} style={styles.link}>
            {children}
          </Link>
        ),
        hr: () => <hr style={styles.rule} />,
        code: ({ children }) => (
          <code style={styles.inlineCode}>{children}</code>
        ),
        pre: ({ children }) => <pre style={styles.pre}>{children}</pre>,
        strong: ({ children }) => (
          <strong style={styles.strong}>{children}</strong>
        ),
        em: ({ children }) => <em style={styles.em}>{children}</em>,
      }}
    >
      {content}
    </Markdown>
  );
}

const styles = {
  h1: {
    margin: "28px 0 14px",
    color: "#16120f",
    fontSize: "28px",
    fontWeight: "600",
    lineHeight: "1.2",
  },
  h2: {
    margin: "24px 0 12px",
    color: "#16120f",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "1.25",
  },
  h3: {
    margin: "20px 0 10px",
    color: "#16120f",
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "1.3",
  },
  p: {
    margin: "0 0 16px",
    color: "#16120f",
    fontSize: "17px",
    lineHeight: "1.75",
    whiteSpace: "pre-wrap" as const,
  },
  list: {
    margin: "0 0 16px",
    paddingLeft: "22px",
    color: "#16120f",
    fontSize: "17px",
    lineHeight: "1.75",
  },
  listItem: {
    marginBottom: "8px",
  },
  blockquote: {
    margin: "0 0 16px",
    padding: "0 0 0 16px",
    borderLeft: "3px solid #d4cab5",
    color: "#3a3229",
    fontSize: "17px",
    fontStyle: "italic",
    lineHeight: "1.75",
  },
  link: {
    color: "#16120f",
    textDecoration: "underline",
  },
  rule: {
    border: "0",
    borderTop: "1px solid #d4cab5",
    margin: "20px 0",
  },
  inlineCode: {
    backgroundColor: "#efe7d8",
    borderRadius: "2px",
    padding: "1px 4px",
    fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "14px",
  },
  pre: {
    margin: "0 0 16px",
    padding: "14px 16px",
    backgroundColor: "#efe7d8",
    color: "#16120f",
    whiteSpace: "pre-wrap" as const,
    fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    overflow: "hidden",
  },
  strong: {
    fontWeight: "700",
  },
  em: {
    fontStyle: "italic",
  },
} as const;
