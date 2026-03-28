import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article } from "@/components/editorial";
import { ArticleCard, EditorialGrid, Masthead } from "@/components/editorial";
import { SubscriptionBox } from "@/components/editorial/SubscriptionBox";
import { publications, user } from "@/db/schema";
import { getSession } from "@/hooks/session";
import { db } from "@/lib/db";
import { isViewerSubscribedToPublication } from "@/lib/queries/subscriptions";
import { getIssuesByUsername } from "@/lib/queries/updates";
import { assignCardSizes, getCardGridClasses } from "@/lib/utils/card-layout";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ subscribe?: string }>;
}

type UserRecord = {
  id: string;
  username: string | null;
  publicationName: string | null;
};

export default async function PublicationPage({
  params,
  searchParams,
}: PageProps) {
  const { username } = await params;
  const { subscribe } = await searchParams;

  let userRecord: UserRecord | undefined;
  try {
    userRecord = await db
      .select({
        id: user.id,
        username: user.username,
        publicationName: publications.name,
      })
      .from(user)
      .leftJoin(publications, eq(publications.userId, user.id))
      .where(eq(user.username, username))
      .then((rows) => rows[0]);
  } catch {
    notFound();
  }

  if (!userRecord) {
    notFound();
  }

  const session = await getSession();
  let articles: Article[] = [];
  try {
    articles = await getIssuesByUsername(username, 12);
  } catch {
    // Database unavailable, show empty list
  }
  const publicationTitle =
    userRecord.publicationName || `${username} publication`;
  const isOwnPublication = session?.user?.username === username;
  let isSubscribed = false;
  if (!!session?.user?.email && !isOwnPublication) {
    try {
      isSubscribed = await isViewerSubscribedToPublication(
        username,
        session.user.email,
      );
    } catch {
      // Database unavailable, assume not subscribed
    }
  }

  const cardSizes = assignCardSizes(articles.length);

  return (
    <main className="min-h-screen bg-paper-base">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="py-8">
          <Masthead
            userName={session?.user?.name}
            userImage={session?.user?.image}
            userUsername={session?.user?.username}
            showAvatar={!!session}
            title={publicationTitle}
            linkTo={`/~${username}`}
            className="mb-8"
          />
        </div>

        <div className="mb-8">
          <SubscriptionBox
            publicationUsername={username}
            publicationName={publicationTitle}
            isAuthenticated={!!session}
            isOwnPublication={isOwnPublication}
            isSubscribed={isSubscribed}
            returnTo={`/~${username}`}
            status={subscribe}
          />
        </div>

        {articles.length > 0 && (
          <EditorialGrid>
            {articles.map((article, index) => {
              const size = cardSizes[index];
              const gridClasses = getCardGridClasses(size);
              return (
                <Link
                  key={article.id}
                  href={`/~${username}/${article.editionNumber}`}
                  className={`${gridClasses} group h-full`}
                >
                  <ArticleCard article={article} size={size} />
                </Link>
              );
            })}
          </EditorialGrid>
        )}

        {articles.length === 0 && (
          <div className="text-center py-16 px-6">
            <p className="text-body-editorial text-paper-muted">
              No published updates yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
