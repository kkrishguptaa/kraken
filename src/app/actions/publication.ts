"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { publications, users } from "@/db/schema";

export async function createPublication(formData: FormData) {
  const userId = formData.get("userId") as string;
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!userId || !username || !name) {
    return { error: "Missing required fields" };
  }

  // Check username uniqueness (in users table)
  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (existingUser && existingUser.id !== userId) {
    return { error: "Username already taken" };
  }

  // Update user username if changed
  await db.update(users).set({ username }).where(eq(users.id, userId));

  // Create publication
  try {
    await db.insert(publications).values({
      userId,
      name,
      description,
      slug: username, // Initially publication slug matches username
    });
  } catch (err) {
    console.error("Failed to create publication:", err);
    return { error: "Could not create publication. Try a different username." };
  }

  revalidatePath("/");
  redirect("/");
}
