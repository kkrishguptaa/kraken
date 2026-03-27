import { and, desc, eq, isNull } from "drizzle-orm";
import type { Article } from "@/components/editorial";
import { issues, publications, user } from "@/db/schema";
import { db } from "@/lib/db";
import { calculateReadTime } from "../utils/text";

/**
 * Fetch recent published updates for homepage
 */
export async function getRecentUpdates(limit = 10): Promise<Article[]> {
  const results = await db
    .select({
      id: issues.id,
      title: issues.title,
      content: issues.content,
      editionNumber: issues.editionNumber,
      publishedAt: issues.publishedAt,
      publicationName: publications.name,
      userId: issues.userId,
      userUsername: user.username,
    })
    .from(issues)
    .leftJoin(publications, eq(issues.publicationId, publications.id))
    .leftJoin(user, eq(issues.userId, user.id))
    .where(and(eq(issues.status, "published"), isNull(issues.deletedAt)))
    .orderBy(desc(issues.publishedAt))
    .limit(limit);

  return results.map((row) => ({
    id: row.id,
    publicationName: row.publicationName || "Untitled Publication",
    editionNumber: row.editionNumber || 1,
    headline: row.title,
    content: row.content,
    publishedAt: row.publishedAt || new Date(),
    readTime: calculateReadTime(row.content),
    userId: row.userId,
    userUsername: row.userUsername || "unknown",
  }));
}

/**
 * Fetch published updates by username
 */
export async function getIssuesByUsername(username: string, limit = 10): Promise<Article[]> {
  const results = await db
    .select({
      id: issues.id,
      title: issues.title,
      content: issues.content,
      editionNumber: issues.editionNumber,
      publishedAt: issues.publishedAt,
      publicationName: publications.name,
      userId: issues.userId,
      userUsername: user.username,
    })
    .from(issues)
    .leftJoin(publications, eq(issues.publicationId, publications.id))
    .leftJoin(user, eq(issues.userId, user.id))
    .where(
      and(
        eq(user.username, username),
        eq(issues.status, "published"),
        isNull(issues.deletedAt),
      ),
    )
    .orderBy(desc(issues.publishedAt))
    .limit(limit);

  return results.map((row) => ({
    id: row.id,
    publicationName: row.publicationName || "Untitled Publication",
    editionNumber: row.editionNumber || 1,
    headline: row.title,
    content: row.content,
    publishedAt: row.publishedAt || new Date(),
    readTime: calculateReadTime(row.content),
    userId: row.userId,
    userUsername: row.userUsername || "unknown",
  }));
}

/**
 * Fetch a single issue by ID (for detail view)
 */
export async function getIssueById(issueId: string) {
  const result = await db
    .select({
      id: issues.id,
      title: issues.title,
      content: issues.content,
      editionNumber: issues.editionNumber,
      publishedAt: issues.publishedAt,
      publicationName: publications.name,
      userId: issues.userId,
      userName: user.name,
      userUsername: user.username,
      userImage: user.image,
    })
    .from(issues)
    .leftJoin(publications, eq(issues.publicationId, publications.id))
    .leftJoin(user, eq(issues.userId, user.id))
    .where(
      and(
        eq(issues.id, issueId),
        eq(issues.status, "published"),
        isNull(issues.deletedAt),
      ),
    )
    .then((rows) => rows[0]);

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    publicationName: result.publicationName || "Untitled Publication",
    editionNumber: result.editionNumber || 1,
    headline: result.title,
    content: result.content,
    publishedAt: result.publishedAt || new Date(),
    readTime: calculateReadTime(result.content),
    userId: result.userId,
    userName: result.userName,
    userUsername: result.userUsername,
    userImage: result.userImage,
  };
}

/**
 * Get publications for a specific user
 */
export async function getUserPublications(userId: string) {
  return await db
    .select()
    .from(publications)
    .where(eq(publications.userId, userId));
}
