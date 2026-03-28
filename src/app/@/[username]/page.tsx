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

  let profile;
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
      publishedAt: string | null;
    }> = [];

  try {
    [publishedCount, followerCount, followingCount, recentIssues] = await Promise.all([
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

  const session = await getSession();

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
            linkTo={`/~${profile.username}`}
            className="mb-8"
          />
        </div>

        <section className="overflow-hidden border border-paper-border bg-white/70">
          <div className="h-32 bg-[linear-gradient(120deg,#ded3bd,#f6f1e7)]" />
          <div className="relative px-6 pb-8 pt-4 md:px-10">
            <div className="absolute -top-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-paper-base bg-paper-border text-2xl font-family-display text-paper-ink">
              {(profile.name || profile.username || "U").slice(0, 1).toUpperCase()}
            </div>

            <div className="pl-24">
              <h1 className="font-family-display text-4xl leading-tight text-paper-ink">
                {profile.name || profile.username}
              </h1>
              <p className="mt-1 text-meta-small text-paper-muted">@{profile.username}</p>
              <div className="mt-4 flex flex-wrap gap-5 text-meta-small text-paper-ink">
                <span>{publishedCount} editions</span>
                <span>{followerCount} followers</span>
                <span>{followingCount} following</span>
                <Link className="underline underline-offset-2" href={`/@${profile.username}`}>
                  Open publication
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 border border-paper-border bg-white/60 p-6 md:p-8">
          <h2 className="font-family-display text-3xl leading-tight text-paper-ink">
            Recent krakens
          </h2>

          {recentIssues.length === 0 ? (
            <p className="mt-4 text-body-editorial text-paper-muted">No published editions yet.</p>
          ) : (
            <div className="mt-5 divide-y divide-paper-border border-y border-paper-border">
              {recentIssues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/@${profile.username}/${issue.editionNumber}`}
                  className="block py-4 transition hover:bg-paper-border/40"
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
