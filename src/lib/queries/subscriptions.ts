import { and, eq } from "drizzle-orm";
import { publications, subscribers, user } from "@/db/schema";
import { db } from "@/lib/db";

export async function isViewerSubscribedToPublication(
  publicationUsername: string,
  viewerEmail?: string | null,
): Promise<boolean> {
  if (!viewerEmail) {
    return false;
  }

  const existing = await db
    .select({ id: subscribers.id })
    .from(subscribers)
    .innerJoin(publications, eq(subscribers.publicationId, publications.id))
    .innerJoin(user, eq(publications.userId, user.id))
    .where(
      and(
        eq(user.username, publicationUsername),
        eq(subscribers.email, viewerEmail),
        eq(subscribers.emailNotificationsEnabled, true),
      ),
    )
    .limit(1)
    .then((rows) => rows[0]);

  return Boolean(existing);
}
