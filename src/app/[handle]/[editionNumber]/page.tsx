import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PublicationIssueView } from "@/components/editorial/PublicationIssueView";
import { follows, publications, user } from "@/db/schema";
import { getSession } from "@/hooks/session";
import { db } from "@/lib/db";
import { isViewerSubscribedToPublication } from "@/lib/queries/subscriptions";
import { getIssueByEditionNumber } from "@/lib/queries/updates";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ handle: string; editionNumber: string }>;
  searchParams: Promise<{ subscribe?: string }>;
}

function parsePublicationHandle(rawHandle: string): string | null {
  if (!rawHandle.startsWith("~") || rawHandle.length < 2) {
    return null;
  }

  return rawHandle.slice(1);
}

export default async function PublicationIssuePage({
  params,
  searchParams,
}: PageProps) {
  const { handle, editionNumber } = await params;
  const username = parsePublicationHandle(handle);

  if (!username) {
    notFound();
  }

  const { subscribe } = await searchParams;
  const normalizedEditionNumber = decodeURIComponent(editionNumber);
  const parsedEditionNumber = Number.parseInt(normalizedEditionNumber, 10);

  if (!/^\d+$/.test(normalizedEditionNumber) || parsedEditionNumber < 1) {
    notFound();
  }

  const issue = await getIssueByEditionNumber(username, parsedEditionNumber);

  if (!issue) {
    notFound();
  }

  const publication = await db
    .select({ publicationName: publications.name, ownerId: user.id })
    .from(user)
    .leftJoin(publications, eq(publications.userId, user.id))
    .where(eq(user.username, username))
    .then((rows) => rows[0]);

  const session = await getSession();
  const publicationTitle =
    publication?.publicationName || issue.publicationName || "KRAKEN";
  const isOwnPublication = session?.user?.username === username;
  const isSubscribed =
    !!session?.user?.email && !isOwnPublication
      ? await isViewerSubscribedToPublication(username, session.user.email)
      : false;
  const isFollowing =
    !!session?.user?.id && !!publication?.ownerId && !isOwnPublication
      ? Boolean(
          await db
            .select({ followerId: follows.followerId })
            .from(follows)
            .where(
              and(
                eq(follows.followerId, session.user.id),
                eq(follows.followingId, publication.ownerId),
              ),
            )
            .then((rows) => rows[0]),
        )
      : false;

  return (
    <PublicationIssueView
      username={username}
      publicationTitle={publicationTitle}
      issue={issue}
      session={session}
      isOwnPublication={isOwnPublication}
      isSubscribed={isSubscribed}
      isFollowing={isFollowing}
      subscribe={subscribe}
    />
  );
}
