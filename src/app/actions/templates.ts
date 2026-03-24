"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { templates } from "@/db/schema";

export async function saveTemplate(
  publicationId: string,
  name: string,
  content: string,
) {
  const [newTemplate] = await db
    .insert(templates)
    .values({
      publicationId,
      name,
      content,
    })
    .returning();

  revalidatePath("/editor", "layout");
  return newTemplate;
}

export async function deleteTemplate(id: string) {
  await db.delete(templates).where(eq(templates.id, id));
  revalidatePath("/editor", "layout");
}

export async function applyTemplate(id: string) {
  const template = await db.query.templates.findFirst({
    where: eq(templates.id, id),
  });
  return template?.content || "";
}
