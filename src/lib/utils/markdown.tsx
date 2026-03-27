import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSanitize from 'rehype-sanitize'
import remarkGithub from 'remark-github'
import rehypePrism from 'rehype-prism-plus'
import Markdown from 'react-markdown'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import 'prism-themes/themes/prism-ghcolors.css' // Clean GitHub-inspired theme

export function MarkdownRender({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return <article className={`prose ${className}`}>
    <Markdown
      remarkPlugins={[
        remarkGfm,
        [remarkGithub, { repository: 'kkrishguptaa/kraken' }],
        remarkMath
      ]}
      rehypePlugins={[
        rehypeSanitize,
        rehypeKatex,
        rehypePrism,
      ]}
    >{children}</Markdown>
  </article>
}
