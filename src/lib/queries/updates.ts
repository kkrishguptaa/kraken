import { and, count, desc, eq, inArray, isNull } from "drizzle-orm";
import type { Article, IssueSocialState } from "@/components/editorial";
import { follows, issues, likes, publications, user } from "@/db/schema";
import { db } from "@/lib/db";
import { calculateReadTime } from "../utils/text";

/**
 * Validate username format
 */
function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(username);
}

type ArticleRow = {
  id: string;
  title: string;
  content: string;
  editionNumber: number;
  publishedAt: Date | null;
  publicationName: string | null;
  userId: string;
  userUsername: string | null;
};

async function getIssueSocialState(
  issueIds: string[],
  viewerUserId?: string | null,
): Promise<Map<string, IssueSocialState>> {
  if (issueIds.length === 0) {
    return new Map();
  }

  const [likeCounts, viewerLikes] = await Promise.all([
    db
      .select({
        issueId: likes.issueId,
        likeCount: count(likes.issueId),
      })
      .from(likes)
      .where(inArray(likes.issueId, issueIds))
      .groupBy(likes.issueId),
    viewerUserId
      ? db
          .select({ issueId: likes.issueId })
          .from(likes)
          .where(
            and(
              eq(likes.userId, viewerUserId),
              inArray(likes.issueId, issueIds),
            ),
          )
      : Promise.resolve([]),
  ]);

  const countMap = new Map(
    likeCounts.map((row) => [row.issueId, Number(row.likeCount)]),
  );
  const likedIssueIds = new Set(viewerLikes.map((row) => row.issueId));

  return new Map(
    issueIds.map((issueId) => [
      issueId,
      {
        likeCount: countMap.get(issueId) ?? 0,
        viewerHasLiked: likedIssueIds.has(issueId),
      },
    ]),
  );
}

function mapArticleRow(
  row: ArticleRow,
  socialState?: IssueSocialState,
): Article {
  return {
    id: row.id,
    publicationName: row.publicationName || "Untitled Publication",
    editionNumber: row.editionNumber || 1,
    headline: row.title,
    content: row.content,
    publishedAt: row.publishedAt ?? new Date(),
    readTime: calculateReadTime(row.content),
    userId: row.userId,
    userUsername: row.userUsername || "unknown",
    likeCount: socialState?.likeCount ?? 0,
    viewerHasLiked: socialState?.viewerHasLiked ?? false,
  };
}

/**
 * Fetch recent published updates for homepage
 */
export async function getRecentUpdates(
  limit = 10,
  viewerUserId?: string | null,
): Promise<Article[]> {
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

  const socialState = await getIssueSocialState(
    results.map((row) => row.id),
    viewerUserId,
  );

  return results.map((row) => mapArticleRow(row, socialState.get(row.id)));
}

export async function getFeedUpdatesForUser(
  viewerUserId: string,
  limit = 10,
): Promise<Article[]> {
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
    .from(follows)
    .innerJoin(user, eq(follows.followingId, user.id))
    .innerJoin(issues, eq(issues.userId, user.id))
    .leftJoin(publications, eq(issues.publicationId, publications.id))
    .where(
      and(
        eq(follows.followerId, viewerUserId),
        eq(issues.status, "published"),
        isNull(issues.deletedAt),
      ),
    )
    .orderBy(desc(issues.publishedAt))
    .limit(limit);

  const socialState = await getIssueSocialState(
    results.map((row) => row.id),
    viewerUserId,
  );

  return results.map((row) => mapArticleRow(row, socialState.get(row.id)));
}

/**
 * Fetch published updates by username
 */
export async function getIssuesByUsername(
  username: string,
  limit = 10,
  viewerUserId?: string | null,
): Promise<Article[]> {
  if (!isValidUsername(username)) {
    return [];
  }

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
    .innerJoin(user, eq(issues.userId, user.id))
    .where(
      and(
        eq(user.username, username),
        eq(issues.status, "published"),
        isNull(issues.deletedAt),
      ),
    )
    .orderBy(desc(issues.publishedAt))
    .limit(limit);

  const socialState = await getIssueSocialState(
    results.map((row) => row.id),
    viewerUserId,
  );

  return results.map((row) => mapArticleRow(row, socialState.get(row.id)));
}

/**
 * Fetch a single published issue by username + edition number (for detail view)
 */
export async function getIssueByEditionNumber(
  username: string,
  editionNumber: number,
  viewerUserId?: string | null,
) {
  if (
    !isValidUsername(username) ||
    !Number.isInteger(editionNumber) ||
    editionNumber < 1
  ) {
    return null;
  }

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
        eq(user.username, username),
        eq(issues.editionNumber, editionNumber),
        eq(issues.status, "published"),
        isNull(issues.deletedAt),
      ),
    )
    .then((rows) => rows[0]);

  if (!result) {
    return null;
  }

  const socialState = await getIssueSocialState([result.id], viewerUserId);
  const issueSocialState = socialState.get(result.id);

  return {
    id: result.id,
    publicationName: result.publicationName || "Untitled Publication",
    editionNumber: result.editionNumber || 1,
    headline: result.title,
    content: result.content,
    publishedAt: result.publishedAt ?? new Date(),
    readTime: calculateReadTime(result.content),
    userId: result.userId,
    userName: result.userName,
    userUsername: result.userUsername,
    userImage: result.userImage,
    likeCount: issueSocialState?.likeCount ?? 0,
    viewerHasLiked: issueSocialState?.viewerHasLiked ?? false,
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
