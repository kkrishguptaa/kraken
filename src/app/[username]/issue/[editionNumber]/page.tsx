import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import CommentSection from "@/components/CommentSection";
import HorizontalRule from "@/components/HorizontalRule";
import LikeButton from "@/components/LikeButton";
import Masthead from "@/components/Masthead";
import PageWrapper from "@/components/PageWrapper";
import ShareBar from "@/components/ShareBar";
import { db } from "@/db";
import { comments, issues, likes, publications } from "@/db/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; editionNumber: string }>;
}): Promise<Metadata> {
  const { username, editionNumber } = await params;
  const slug = decodeURIComponent(username).replace("@", "");
  const edNum = parseInt(editionNumber, 10);

  const publication = await db.query.publications.findFirst({
    where: eq(publications.slug, slug),
  });

  if (!publication) return { title: "Not Found" };

  const issue = await db.query.issues.findFirst({
    where: and(
      eq(issues.publicationId, publication.id),
      eq(issues.editionNumber, edNum),
      eq(issues.status, "published"),
    ),
  });

  if (!issue) return { title: "Not Found" };

  return {
    title: `${issue.title} | ${publication.name}`,
    description: issue.content.substring(0, 160),
    openGraph: {
      title: issue.title,
      description: issue.content.substring(0, 160),
      type: "article",
      publishedTime: issue.publishedAt?.toISOString(),
    },
  };
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ username: string; editionNumber: string }>;
}) {
  const { userId } = await auth();
  const { username, editionNumber } = await params;

  if (!username.startsWith("%40") && !username.startsWith("@")) {
    notFound();
  }

  const slug = decodeURIComponent(username).replace("@", "");
  const edNum = parseInt(editionNumber, 10);

  if (Number.isNaN(edNum)) {
    notFound();
  }

  const publication = await db.query.publications.findFirst({
    where: eq(publications.slug, slug),
  });

  if (!publication) {
    notFound();
  }

  const issue = await db.query.issues.findFirst({
    where: and(
      eq(issues.publicationId, publication.id),
      eq(issues.editionNumber, edNum),
      eq(issues.status, "published"),
    ),
  });

  if (!issue) {
    notFound();
  }

  const issueLikes = await db.query.likes.findMany({
    where: eq(likes.issueId, issue.id),
  });

  const isLiked = userId
    ? !!issueLikes.find((l) => l.userId === userId)
    : false;

  const issueComments = await db.query.comments.findMany({
    where: eq(comments.issueId, issue.id),
    with: {
      user: true,
    },
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  });

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const domain = publication.customDomainVerified
    ? publication.customDomain
    : "kraken.krishg.com";
  const url = `${protocol}://${domain}/@${publication.slug}/issue/${issue.editionNumber}`;

  return (
    <PageWrapper className="max-w-3xl">
      <div className="mb-12 text-center">
        <a
          href={`/@${publication.slug}`}
          className="text-xs font-sans uppercase tracking-[0.2em] text-muted-ink hover:text-ink transition-colors"
        >
          {publication.name}
        </a>
      </div>

      <Masthead
        publicationName={publication.name}
        editionNumber={issue.editionNumber}
        date={new Date(issue.publishedAt!).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        title={issue.title}
      />

      <div className="prose prose-zinc prose-lg max-w-none font-serif text-ink leading-relaxed">
        <ReactMarkdown>{issue.content}</ReactMarkdown>
      </div>

      <HorizontalRule />

      <ShareBar
        publicationName={publication.name}
        issueTitle={issue.title}
        editionNumber={issue.editionNumber}
        date={new Date(issue.publishedAt!).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        content={issue.content}
        url={url}
      />

      <footer className="py-12">
        <div className="flex justify-center gap-4 mb-12">
          <LikeButton
            userId={userId || undefined}
            issueId={issue.id}
            initialLiked={isLiked}
            count={issueLikes.length}
          />
        </div>

        <CommentSection
          userId={userId || undefined}
          issueId={issue.id}
          comments={issueComments}
        />
      </footer>
    </PageWrapper>
  );
}
