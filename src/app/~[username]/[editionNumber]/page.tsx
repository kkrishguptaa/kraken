import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PublicationIssueView } from "@/components/editorial/PublicationIssueView";
import { publications, user } from "@/db/schema";
import { getSession } from "@/hooks/session";
import { db } from "@/lib/db";
import { isViewerSubscribedToPublication } from "@/lib/queries/subscriptions";
import { getIssueByEditionNumber } from "@/lib/queries/updates";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string; editionNumber: string }>;
  searchParams: Promise<{ subscribe?: string }>;
}

export default async function PublicationIssuePage({
  params,
  searchParams,
}: PageProps) {
  const { username, editionNumber } = await params;
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
    .select({ publicationName: publications.name })
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

  return (
    <PublicationIssueView
      username={username}
      publicationTitle={publicationTitle}
      issue={issue}
      session={session}
      isOwnPublication={isOwnPublication}
      isSubscribed={isSubscribed}
      subscribe={subscribe}
    />
  );
}
