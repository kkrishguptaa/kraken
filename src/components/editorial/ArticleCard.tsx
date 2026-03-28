import { MarkdownRender } from "@/lib/utils/markdown";
import { DateDisplay } from "./DateDisplay";

export interface Article {
  id: string;
  publicationName: string;
  editionNumber: number;
  headline: string;
  content: string;
  publishedAt: Date | string;
  readTime: number;
  userId: string;
  userUsername?: string;
}

export type CardSize = "wide" | "standard" | "tall";

interface ArticleCardProps {
  article: Article;
  size?: CardSize;
  className?: string;
}

const LINE_CLAMP_CLASS_MAP: Record<CardSize, string> = {
  standard: "line-clamp-6",
  wide: "line-clamp-12",
  tall: "line-clamp-30",
};

export function ArticleCard({
  article,
  size = "standard",
  className = "",
}: ArticleCardProps) {
  const lineClampClass = LINE_CLAMP_CLASS_MAP[size];

  return (
    <article
      className={`flex h-full flex-col bg-paper-base p-6 lg:p-8 ${className}`}
    >
      <h2 className="text-headline leading-tight text-balance text-paper-ink underline-offset-8 group-hover:underline">
        {article.headline}
      </h2>

      <div className="my-4 flex justify-end">
        <DateDisplay
          date={article.publishedAt}
          className="text-meta text-paper-muted"
        />
      </div>

      <hr className="mb-4 border-t border-paper-border" />

      <div className="mb-2 flex-1 overflow-hidden">
        <MarkdownRender
          className={`max-w-none text-body-editorial leading-relaxed text-paper-ink prose-p:my-0 prose-headings:hidden prose-hr:hidden prose-pre:hidden prose-blockquote:hidden ${lineClampClass}`}
        >
          {article.content}
        </MarkdownRender>
      </div>
    </article>
  );
}
