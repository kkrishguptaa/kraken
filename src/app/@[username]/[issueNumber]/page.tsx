import { DateDisplay } from "@/components/editorial/DateDisplay";
import { getSession } from "@/hooks/session";
import { getIssueById } from "@/lib/queries/updates";
import { Masthead } from "@/components/editorial";
import { MarkdownRender } from "@/lib/utils/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string; issueNumber: string }>;
}

export default async function IssuePage({ params }: PageProps) {
  const { issueNumber } = await params;

  // issueNumber is actually the UUID of the issue
  const issue = await getIssueById(issueNumber);

  if (!issue) {
    notFound();
  }

  const session = await getSession();

  return (
    <main className="min-h-screen bg-[var(--color-paper-base)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Masthead */}
        <div className="py-8">
          <Masthead
            userName={session?.user?.name}
            userImage={session?.user?.image}
            userUsername={session?.user?.username}
            showAvatar={!!session}
            className="mb-8"
          />
        </div>

        {/* Issue detail */}
        <article className="bg-[var(--color-paper-base)] py-8 lg:py-12">
          {/* Header section */}
          <div className="max-w-3xl mx-auto mb-8">
            {/* Publication info */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-meta text-[var(--color-paper-muted)] uppercase truncate">
                {issue.publicationName}
              </span>
              <span className="text-meta-small text-[var(--color-paper-muted)] whitespace-nowrap">
                ED. #{issue.editionNumber}
              </span>
            </div>

            {/* Divider */}
            <hr className="border-t border-[var(--color-paper-border)] mb-6" />

            {/* Headline */}
            <h1 className="text-headline leading-tight mb-4">{issue.headline}</h1>

            {/* Metadata */}
            <div className="flex items-center justify-between mb-2 text-meta-small text-[var(--color-paper-muted)]">
              <div className="flex gap-4">
                {issue.userUsername && (
                  <Link
                    href={`/@${issue.userUsername}`}
                    className="hover:underline text-[var(--color-paper-ink)]"
                  >
                    by {issue.userName || issue.userUsername}
                  </Link>
                )}
                <span>{issue.readTime} min read</span>
              </div>
              <DateDisplay date={issue.publishedAt} />
            </div>

            {/* Divider */}
            <hr className="border-t border-[var(--color-paper-border)] mt-4" />
          </div>

          {/* Main content - rendered markdown */}
          <div className="max-w-3xl mx-auto">
            <MarkdownRender className="prose-lg max-w-none text-body-editorial text-[var(--color-paper-ink)] leading-relaxed">
              {issue.content}
            </MarkdownRender>
          </div>
        </article>
      </div>
    </main>
  );
}
