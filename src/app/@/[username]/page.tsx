import { and, count, desc, eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/editorial";
import { follows, issues, user } from "@/db/schema";
import { getSession } from "@/hooks/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;

  let profile:
    | {
        id: string;
        username: string | null;
        name: string | null;
        image: string | null;
        createdAt: Date;
      }
    | undefined;
  try {
    profile = await db
      .select({
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.username, username))
      .then((rows) => rows[0]);
  } catch {
    notFound();
  }

  if (!profile) {
    notFound();
  }

  let publishedCount = 0,
    followerCount = 0,
    followingCount = 0,
    recentIssues: Array<{
      id: string;
      title: string;
      editionNumber: number;
      publishedAt: Date | null;
    }> = [];

  try {
    [publishedCount, followerCount, followingCount, recentIssues] =
      await Promise.all([
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
        db
          .select({
            id: issues.id,
            title: issues.title,
            editionNumber: issues.editionNumber,
            publishedAt: issues.publishedAt,
          })
          .from(issues)
          .where(
            and(
              eq(issues.userId, profile.id),
              eq(issues.status, "published"),
              isNull(issues.deletedAt),
            ),
          )
          .orderBy(desc(issues.publishedAt))
          .limit(12),
      ]);
  } catch {
    // Database unavailable, use defaults
  }

  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.error("Failed to get session:", error);
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
              <p className="text-meta text-paper-muted">Public front page</p>
              <h1 className="mt-3 font-family-display text-[clamp(2.4rem,4.8vw,4rem)] leading-[0.95] text-paper-ink">
                {profile.name || profile.username}
              </h1>
              <p className="mt-2 text-body-editorial text-paper-muted">
                A living publication for regular updates, archived by edition
                and meant to be read in sequence.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-meta-small text-paper-ink">
                <span className="border border-paper-border px-3 py-2">
                  @{profile.username}
                </span>
                <span className="border border-paper-border px-3 py-2">
                  {publishedCount} editions
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
                  className="border border-paper-ink bg-paper-ink px-4 py-2 text-meta-small text-paper-base transition hover:border-paper-accent hover:bg-paper-accent"
                  href={`/@${profile.username}`}
                >
                  Open publication
                </Link>
                <Link
                  className="border border-paper-border px-4 py-2 text-meta-small text-paper-ink transition hover:bg-paper-border/50"
                  href={`/feed`}
                >
                  Browse the feed
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 border border-paper-border bg-white/60 p-6 md:p-8">
          <div className="flex flex-col gap-3 border-b border-paper-border pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-meta text-paper-muted">Archive</p>
              <h2 className="font-family-display text-3xl leading-tight text-paper-ink">
                Recent krakens
              </h2>
            </div>
            <p className="max-w-xl text-body-editorial text-paper-muted">
              Start anywhere, then follow the edition trail forward. Each issue
              deepens the publication.
            </p>
          </div>

          {recentIssues.length === 0 ? (
            <p className="mt-4 text-body-editorial text-paper-muted">
              No published editions yet.
            </p>
          ) : (
            <div className="mt-5 divide-y divide-paper-border border-y border-paper-border">
              {recentIssues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/@${profile.username}/${issue.editionNumber}`}
                  className="block px-3 py-4 transition hover:bg-paper-border/40 md:px-4"
                >
                  <p className="font-family-display text-2xl leading-tight text-paper-ink">
                    {issue.title}
                  </p>
                  <p className="mt-1 text-meta-small text-paper-muted">
                    Edition #{issue.editionNumber}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
