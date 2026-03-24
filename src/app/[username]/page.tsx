import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FollowButton from "@/components/FollowButton";
import HorizontalRule from "@/components/HorizontalRule";
import IssueCard from "@/components/IssueCard";
import Masthead from "@/components/Masthead";
import PageWrapper from "@/components/PageWrapper";
import SubscribeForm from "@/components/SubscribeForm";
import { db } from "@/db";
import { follows, issues, publications } from "@/db/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const slug = decodeURIComponent(username).replace("@", "");

  const publication = await db.query.publications.findFirst({
    where: eq(publications.slug, slug),
  });

  if (!publication) return { title: "Not Found" };

  return {
    title: `${publication.name} | Kraken News`,
    description: publication.description,
    openGraph: {
      title: publication.name,
      description: publication.description || "",
      type: "website",
    },
  };
}

export default async function PublicationPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { userId } = await auth();
  const { username } = await params;

  if (!username.startsWith("%40") && !username.startsWith("@")) {
    notFound();
  }

  const slug = decodeURIComponent(username).replace("@", "");

  const publication = await db.query.publications.findFirst({
    where: eq(publications.slug, slug),
  });

  if (!publication) {
    notFound();
  }

  const publishedIssues = await db.query.issues.findMany({
    where: and(
      eq(issues.publicationId, publication.id),
      eq(issues.status, "published"),
    ),
    orderBy: [desc(issues.editionNumber)],
  });

  const isFollowing = userId
    ? !!(await db.query.follows.findFirst({
        where: and(
          eq(follows.followerId, userId),
          eq(follows.publicationId, publication.id),
        ),
      }))
    : false;

  return (
    <PageWrapper>
      <Masthead publicationName={publication.name} />

      <div className="text-center mb-16 max-w-2xl mx-auto">
        <p className="text-muted-ink font-serif text-lg italic mb-8">
          {publication.description}
        </p>
        <div className="flex justify-center gap-4">
          <FollowButton
            followerId={userId || undefined}
            publicationId={publication.id}
            initialFollowing={isFollowing}
          />
        </div>
      </div>

      <HorizontalRule />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12">
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedIssues.length === 0 ? (
              <div className="col-span-full text-center py-24 border border-dashed border-ink-border no-round">
                <p className="text-muted-ink font-serif italic">
                  The printing press is silent. No issues published yet.
                </p>
              </div>
            ) : (
              publishedIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  slug={publication.slug}
                  editionNumber={issue.editionNumber}
                  title={issue.title}
                  date={new Date(issue.publishedAt!).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                  excerpt={issue.content.substring(0, 200)}
                />
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-4">
          <SubscribeForm publicationId={publication.id} />
        </div>
      </div>
    </PageWrapper>
  );
}
