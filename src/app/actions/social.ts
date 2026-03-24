"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import {
  comments,
  follows,
  likes,
  publications,
  subscribers,
  users,
} from "@/db/schema";

export async function toggleLike(userId: string, issueId: string) {
  const existingLike = await db.query.likes.findFirst({
    where: and(eq(likes.userId, userId), eq(likes.issueId, issueId)),
  });

  if (existingLike) {
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.issueId, issueId)));
  } else {
    await db.insert(likes).values({ userId, issueId });
  }

  revalidatePath("/(publication)", "layout");
}

export async function addComment(
  userId: string,
  issueId: string,
  content: string,
) {
  await db.insert(comments).values({
    userId,
    issueId,
    content,
  });

  revalidatePath("/(publication)", "layout");
}

import { createLoopContact } from "@/lib/loops";

export async function toggleFollow(followerId: string, publicationId: string) {
  const publication = await db.query.publications.findFirst({
    where: eq(publications.id, publicationId),
  });

  if (!publication) return;

  const user = await db.query.users.findFirst({
    where: eq(users.id, followerId),
  });

  if (!user) return;

  const existingFollow = await db.query.follows.findFirst({
    where: and(
      eq(follows.followerId, followerId),
      eq(follows.publicationId, publicationId),
    ),
  });

  const tag = `subscribed-${publication.slug}`;

  if (existingFollow) {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.publicationId, publicationId),
        ),
      );
    // In a real app, we'd manage tags more carefully. For now, we'll assume we can update.
  } else {
    await db.insert(follows).values({ followerId, publicationId });
    await createLoopContact(user.email, user.username, [tag]);
  }

  revalidatePath("/(publication)", "layout");
}

export async function subscribe(publicationId: string, email: string) {
  const publication = await db.query.publications.findFirst({
    where: eq(publications.id, publicationId),
  });

  if (!publication) return { error: "Publication not found" };

  const token = uuidv4();

  await db.insert(subscribers).values({
    publicationId,
    email,
    token,
  });

  const tag = `subscribed-${publication.slug}`;
  await createLoopContact(email, undefined, [tag]);

  revalidatePath("/(publication)", "layout");
  return { success: true };
}
