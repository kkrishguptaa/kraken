import Link from "next/link";

interface IssueCardProps {
  slug: string;
  editionNumber: number;
  title: string;
  date: string;
  excerpt: string;
}

export default function IssueCard({
  slug,
  editionNumber,
  title,
  date,
  excerpt,
}: IssueCardProps) {
  return (
    <article className="border border-ink-border p-6 no-round h-full flex flex-col hover:bg-zinc-100 transition-colors">
      <div className="flex justify-between items-baseline mb-4 text-xs font-sans uppercase tracking-wider text-muted-ink">
        <span>No. {editionNumber}</span>
        <span>{date}</span>
      </div>
      <Link href={`/@${slug}/issue/${editionNumber}`}>
        <h3 className="text-2xl font-serif mb-3 leading-tight hover:underline">
          {title}
        </h3>
      </Link>
      <p className="text-muted-ink line-clamp-3 mb-4 text-sm font-serif">
        {excerpt}
      </p>
      <div className="mt-auto">
        <Link
          href={`/@${slug}/issue/${editionNumber}`}
          className="text-xs font-sans uppercase tracking-[0.2em] font-medium border-b border-ink"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}
