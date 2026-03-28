import { and, count, eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article } from "@/components/editorial";
import { ArticleCard, EditorialGrid, Masthead } from "@/components/editorial";
import { SubscriptionBox } from "@/components/editorial/SubscriptionBox";
import { follows, issues, publications, user } from "@/db/schema";
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

function parseHandle(rawHandle: string):
  | { kind: "profile"; username: string }
  | { kind: "publication"; username: string }
  | null {
  if (rawHandle.length < 2) {
    return null;
  }

  if (rawHandle.startsWith("@")) {
    return { kind: "profile", username: rawHandle.slice(1) };
  }

  if (rawHandle.startsWith("~")) {
    return { kind: "publication", username: rawHandle.slice(1) };
  }

  return null;
}

export default async function PublicHandlePage({ params, searchParams }: PageProps) {
  const { handle } = await params;
  const parsed = parseHandle(handle);

  if (!parsed) {
    notFound();
  }

  if (parsed.kind === "profile") {
    let profile:
      | {
          id: string;
          username: string | null;
          name: string | null;
          image: string | null;
        }
      | undefined;

    try {
      profile = await db
        .select({
          id: user.id,
          username: user.username,
          name: user.name,
          image: user.image,
        })
        .from(user)
        .where(eq(user.username, parsed.username))
        .then((rows) => rows[0]);
    } catch {
      notFound();
    }

    if (!profile) {
      notFound();
    }

    let publishedCount = 0;
    let followerCount = 0;
    let followingCount = 0;

    try {
      [publishedCount, followerCount, followingCount] = await Promise.all([
        db
          .select({ count: count() })
          .from(issues)
          .where(
            and(
              eq(issues.userId, profile.id),
              eq(issues.status, "published"),
              isNull(issues.deletedAt),
            ),
          )
          .then((rows) => rows[0]?.count ?? 0),
        db
          .select({ count: count() })
          .from(follows)
          .where(eq(follows.followingId, profile.id))
          .then((rows) => rows[0]?.count ?? 0),
        db
          .select({ count: count() })
          .from(follows)
          .where(eq(follows.followerId, profile.id))
          .then((rows) => rows[0]?.count ?? 0),
      ]);
    } catch {
      // Database unavailable, use defaults
    }

    let session = null;
    try {
      session = await getSession();
    } catch {
      // If session fails, still render public profile.
    }

    return (
      <main className="min-h-screen bg-paper-base">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="py-8">
            <Masthead
              userName={session?.user?.name}
              userImage={session?.user?.image}
              userUsername={session?.user?.username}
              showAvatar={!!session}
              title={`${profile.name || profile.username}`}
              linkTo={`/@${profile.username}`}
              className="mb-8"
            />
          </div>

          <section className="border border-paper-border bg-white/70">
            <div className="grid gap-8 p-6 md:grid-cols-[112px_minmax(0,1fr)] md:p-10">
              <div className="flex h-24 w-24 items-center justify-center border border-paper-ink bg-paper-base font-family-display text-4xl text-paper-ink">
                {(profile.name || profile.username || "U")
                  .slice(0, 1)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-meta text-paper-muted">Public profile</p>
                <h1 className="mt-3 font-family-display text-[clamp(2.4rem,4.8vw,4rem)] leading-[0.95] text-paper-ink">
                  {profile.name || profile.username}
                </h1>
                <p className="mt-2 text-body-editorial text-paper-muted">
                  Personal profile and social graph for this writer. Read their
                  publication at the publication route.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-paper-ink">
                  <span className="border border-paper-border px-3 py-2">
                    @{profile.username}
                  </span>
                  <span className="border border-paper-border px-3 py-2">
                    {publishedCount} published issues
                  </span>
                  <span className="border border-paper-border px-3 py-2">
                    {followerCount} followers
                  </span>
                  <span className="border border-paper-border px-3 py-2">
                    {followingCount} following
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="border border-paper-ink bg-paper-ink px-4 py-2 text-sm text-paper-base transition hover:border-paper-accent hover:bg-paper-accent"
                    href={`/~${profile.username}`}
                  >
                    Open publication
                  </Link>
                  <Link
                    className="border border-paper-border px-4 py-2 text-sm text-paper-ink transition hover:bg-paper-border/50"
                    href="/feed"
                  >
                    Browse the feed
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

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
      .where(eq(user.username, parsed.username))
      .then((rows) => rows[0]);
  } catch {
    notFound();
  }

  if (!publicationRecord) {
    notFound();
  }

  const session = await getSession();
  let articles: Article[] = [];

  try {
    articles = await getIssuesByUsername(parsed.username, 12);
  } catch {
    // Database unavailable, show empty list
  }

  const publicationTitle =
    publicationRecord.publicationName || `${parsed.username} publication`;
  const isOwnPublication = session?.user?.username === parsed.username;
  let isSubscribed = false;

  if (!!session?.user?.email && !isOwnPublication) {
    try {
      isSubscribed = await isViewerSubscribedToPublication(
        parsed.username,
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
            linkTo={`/~${parsed.username}`}
            className="mb-8"
          />
        </div>

        <div className="mb-8">
          <SubscriptionBox
            publicationUsername={parsed.username}
            publicationName={publicationTitle}
            isAuthenticated={!!session}
            isOwnPublication={isOwnPublication}
            isSubscribed={isSubscribed}
            returnTo={`/~${parsed.username}`}
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
                  href={`/~${parsed.username}/${article.editionNumber}`}
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
