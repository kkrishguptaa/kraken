import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Article } from "@/components/editorial";
import { ArticleCard, EditorialGrid, Masthead } from "@/components/editorial";
import { SubscriptionBox } from "@/components/editorial/SubscriptionBox";
import { follows, publications, user } from "@/db/schema";
import { getSession } from "@/hooks/session";
import { db } from "@/lib/db";
import { isViewerSubscribedToPublication } from "@/lib/queries/subscriptions";
import { getIssuesByUsername } from "@/lib/queries/updates";
import { assignCardSizes, getCardGridClasses } from "@/lib/utils/card-layout";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ subscribe?: string }>;
}

function parsePublicationHandle(
  rawHandle: string,
): { username: string; isLegacyProfileRoute: boolean } | null {
  if (rawHandle.length < 2) {
    return null;
  }

  if (rawHandle.startsWith("@")) {
    return { username: rawHandle.slice(1), isLegacyProfileRoute: true };
  }

  if (rawHandle.startsWith("~")) {
    return { username: rawHandle.slice(1), isLegacyProfileRoute: false };
  }

  return null;
}

export default async function PublicHandlePage({ params, searchParams }: PageProps) {
  const { handle } = await params;
  const parsed = parsePublicationHandle(handle);

  if (!parsed || !parsed.username) {
    notFound();
  }

  if (parsed.isLegacyProfileRoute) {
    redirect(`/~${parsed.username}`);
  }

  const publicationUsername = parsed.username;

  const { subscribe } = await searchParams;

  let publicationRecord:
    | {
        id: string;
        username: string | null;
        publicationName: string | null;
      }
    | undefined;

  try {
    publicationRecord = await db
      .select({
        id: user.id,
        username: user.username,
        publicationName: publications.name,
      })
      .from(user)
      .leftJoin(publications, eq(publications.userId, user.id))
      .where(eq(user.username, publicationUsername))
      .then((rows) => rows[0]);
  } catch {
    notFound();
  }

  if (!publicationRecord) {
    notFound();
  }

  let session = null;
  try {
    session = await getSession();
  } catch {
    // If session lookup fails, still render publication publicly.
  }

  let articles: Article[] = [];

  try {
    articles = await getIssuesByUsername(publicationUsername, 12);
  } catch {
    // Database unavailable, show empty list
  }

  const publicationTitle =
    publicationRecord.publicationName || `${publicationUsername} publication`;
  const isOwnPublication = session?.user?.username === publicationUsername;
  let isSubscribed = false;
  let isFollowing = false;

  if (!!session?.user?.email && !isOwnPublication) {
    try {
      isSubscribed = await isViewerSubscribedToPublication(
        publicationUsername,
        session.user.email,
      );
    } catch {
      // Database unavailable, assume not subscribed
    }
  }

  if (session?.user?.id && !isOwnPublication) {
    try {
      const followRecord = await db
        .select({ followerId: follows.followerId })
        .from(follows)
        .where(
          and(
            eq(follows.followerId, session.user.id),
            eq(follows.followingId, publicationRecord.id),
          ),
        )
        .then((rows) => rows[0]);

      isFollowing = Boolean(followRecord);
    } catch {
      // Database unavailable, assume not following
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
            linkTo={`/~${publicationUsername}`}
            className="mb-8"
          />
        </div>

        <div className="mb-8">
          <SubscriptionBox
            publicationUsername={publicationUsername}
            publicationName={publicationTitle}
            isAuthenticated={!!session}
            isOwnPublication={isOwnPublication}
            isSubscribed={isSubscribed}
            isFollowing={isFollowing}
            returnTo={`/~${publicationUsername}`}
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
                  href={`/~${publicationUsername}/${article.editionNumber}`}
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
