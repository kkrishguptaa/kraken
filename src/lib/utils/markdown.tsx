import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

export function MarkdownRender({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <article className={`prose ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSanitize, rehypeKatex]}
      >
        {children}
      </Markdown>
    </article>
  );
}
