"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { issues } from "@/db/schema";

export async function saveIssue(
  issueId: string,
  data: Partial<typeof issues.$inferInsert>,
) {
  await db
    .update(issues)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(issues.id, issueId));

  revalidatePath(`/editor/${issueId}`);
}

export async function createIssue(publicationId: string) {
  // Get highest edition number
  const latestIssue = await db.query.issues.findFirst({
    where: eq(issues.publicationId, publicationId),
    orderBy: (issues, { desc }) => [desc(issues.editionNumber)],
  });

  const editionNumber = (latestIssue?.editionNumber || 0) + 1;

  const newIssue = await db
    .insert(issues)
    .values({
      publicationId,
      title: "Untitled Issue",
      editionNumber,
      content: "",
      status: "draft",
    })
    .returning();

  return newIssue[0];
}

import { redirect } from "next/navigation";
import { sendIssueBroadcast } from "@/lib/loops";

export async function publishIssue(issueId: string) {
  const issue = await db.query.issues.findFirst({
    where: eq(issues.id, issueId),
    with: {
      publication: true,
    },
  });

  if (!issue) return;

  await db
    .update(issues)
    .set({
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(issues.id, issueId));

  // Send emails via Loops broadcast
  await sendIssueBroadcast(
    issue.publication.name,
    issue.title,
    issue.editionNumber,
    issue.content,
    `subscribed-${issue.publication.slug}`,
  );

  revalidatePath("/");
  revalidatePath(`/editor/${issueId}`);
  revalidatePath(`/@${issue.publication.slug}`);
  revalidatePath(`/@${issue.publication.slug}/issue/${issue.editionNumber}`);
  redirect(`/@${issue.publication.slug}/issue/${issue.editionNumber}`);
}
