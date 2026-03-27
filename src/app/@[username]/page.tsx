import {
  ArticleCard,
  EditorialGrid,
  Masthead,
} from "@/components/editorial";
import { getSession } from "@/hooks/session";
import { getIssuesByUsername } from "@/lib/queries/updates";
import { assignCardSizes, getCardGridClasses } from "@/lib/utils/card-layout";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username); // Remove @ prefix if present

  // Verify user exists
  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.username, decodedUsername))
    .then((rows) => rows[0]);

  if (!userRecord) {
    notFound();
  }

  const session = await getSession();
  const articles = await getIssuesByUsername(decodedUsername, 12);

  // Assign card sizes
  const cardSizes = assignCardSizes(articles.length);

  return (
    <main className="min-h-screen bg-[var(--color-paper-base)]">
      {/* Container with consistent max-width and padding */}
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

        {/* User header */}
        <div className="mb-8 pb-6 border-b border-[var(--color-paper-border)]">
          <h1 className="text-3xl font-semibold text-[var(--color-paper-ink)]">
            {userRecord.name || decodedUsername}
          </h1>
          <p className="text-meta text-[var(--color-paper-muted)]">
            @{decodedUsername}
          </p>
        </div>

        {/* Masonry grid with varied card sizes */}
        {articles.length > 0 && (
          <EditorialGrid>
            {articles.map((article, index) => {
              const size = cardSizes[index];
              const gridClasses = getCardGridClasses(size);
              return (
                <Link
                  key={article.id}
                  href={`/@${decodedUsername}/${article.id}`}
                  className={`${gridClasses} h-full hover:opacity-80 transition-opacity`}
                >
                  <ArticleCard article={article} size={size} />
                </Link>
              );
            })}
          </EditorialGrid>
        )}

        {/* Empty state */}
        {articles.length === 0 && (
          <div className="text-center py-16 px-6">
            <p className="text-body-editorial text-[var(--color-paper-muted)]">
              No published updates yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
