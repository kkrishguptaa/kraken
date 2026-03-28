import Link from "next/link";
import { ArticleCard, EditorialGrid, Masthead } from "@/components/editorial";
import { useOnboarded } from "@/hooks/onboarded";
import { getFeedUpdatesForUser } from "@/lib/queries/updates";
import { assignCardSizes, getCardGridClasses } from "@/lib/utils/card-layout";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const session = await useOnboarded();
  const articles = await getFeedUpdatesForUser(session.user.id, 12);
  const cardSizes = assignCardSizes(articles.length);

  return (
    <main className="min-h-screen bg-paper-base">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="py-8">
          <Masthead
            userName={session.user.name}
            userImage={session.user.image}
            userUsername={session.user.username}
            showAvatar
            title="FEED"
            linkTo="/feed"
            className="mb-8"
          />
        </div>

        {articles.length > 0 ? (
          <EditorialGrid>
            {articles.map((article, index) => {
              const size = cardSizes[index];
              const gridClasses = getCardGridClasses(size);
              return (
                <Link
                  key={article.id}
                  href={`/@${article.userUsername}/${article.editionNumber}`}
                  className={`${gridClasses} group h-full`}
                >
                  <ArticleCard article={article} size={size} />
                </Link>
              );
            })}
          </EditorialGrid>
        ) : (
          <div className="text-center py-16 px-6">
            <p className="text-body-editorial text-paper-muted">
              Your feed is empty. Subscribe to writers and they will appear here
              automatically.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
