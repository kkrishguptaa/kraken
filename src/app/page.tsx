import {
  ArticleCard,
  EditorialGrid,
  Masthead,
} from "@/components/editorial";
import { getSession } from "@/hooks/session";
import { getRecentUpdates } from "@/lib/queries/updates";
import { assignCardSizes, getCardGridClasses } from "@/lib/utils/card-layout";
import Link from "next/link";
import { useOnboarded } from "@/hooks/onboarded";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();

  if (session) {
    // biome-ignore lint/correctness/useHookAtTopLevel: These are not exactly hooks lol
    await useOnboarded();
  }

  const articles = await getRecentUpdates(12);

  // Assign card sizes with weighted randomization
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

        {/* Masonry grid with varied card sizes */}
        {articles.length > 0 && (
          <EditorialGrid>
            {articles.map((article, index) => {
              const size = cardSizes[index];
              const gridClasses = getCardGridClasses(size);
              return (
                <Link
                  key={article.id}
                  href={`/@${article.userUsername}/${article.id}`}
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
              No updates yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
