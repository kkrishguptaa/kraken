import { MarkdownRender } from "@/lib/utils/markdown";
import { DateDisplay } from "./DateDisplay";

export interface Article {
  id: string;
  publicationName: string;
  editionNumber: number;
  headline: string;
  content: string;
  publishedAt: Date | string;
  readTime: number; // in minutes
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
  wide: "line-clamp-10",
  tall: "line-clamp-[20]",
};

/**
 * Masonry grid article card - no borders, grid handles dividers
 * Size variants: wide (2x1), standard (1x1), tall (1x2)
 */
export function ArticleCard({
  article,
  size = "standard",
  className = "",
}: ArticleCardProps) {
  const lineClampClass = LINE_CLAMP_CLASS_MAP[size];

  return (
    <article
      className={`flex flex-col h-full bg-[var(--color-paper-base)] p-5 lg:p-6 ${className}`}
    >
      {/* Header: Publication name + Edition */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-meta text-[var(--color-paper-muted)] uppercase truncate">
          {article.publicationName}
        </span>
        <span className="text-meta-small text-[var(--color-paper-muted)] whitespace-nowrap">
          ED. #{article.editionNumber}
        </span>
      </div>

      {/* Divider after publication */}
      <hr className="border-t border-[var(--color-paper-border)] mb-3" />

      {/* Headline */}
      <h2 className="text-headline leading-tight line-clamp-3 mb-3">
        {article.headline}
      </h2>

      {/* Date */}
      <div className="flex justify-end mb-2">
        <DateDisplay date={article.publishedAt} />
      </div>

      {/* Divider after date */}
      <hr className="border-t border-[var(--color-paper-border)] mb-3" />

      {/* Content - text with line-clamp based on card size */}
      <div className="flex-1 overflow-hidden mb-4">
        <MarkdownRender
          className={`text-body-editorial text-[var(--color-paper-ink)] text-justify leading-relaxed ${lineClampClass}`}
        >
          {article.content}
        </MarkdownRender>
      </div>

      {/* Footer: Edition + Read time */}
      <div className="flex items-center justify-between text-meta-small text-[var(--color-paper-muted)] pt-2 border-t border-[var(--color-paper-border)]">
        <span>Edition #{article.editionNumber}</span>
        <span>{article.readTime} min read</span>
      </div>
    </article>
  );
}
