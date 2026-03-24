"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { publications } from "@/db/schema";

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

export async function addCustomDomain(publicationId: string, domain: string) {
  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    return { error: "Vercel configuration missing" };
  }

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains${
      VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ""
    }`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
    },
  );

  const data = await response.json();

  if (data.error) {
    return { error: data.error.message };
  }

  await db
    .update(publications)
    .set({
      customDomain: domain,
      customDomainVerified: false,
      vercelDomainId: data.uid || null,
    })
    .where(eq(publications.id, publicationId));

  revalidatePath("/");
  return { success: true };
}

export async function verifyCustomDomain(publicationId: string) {
  const publication = await db.query.publications.findFirst({
    where: eq(publications.id, publicationId),
  });

  if (!publication || !publication.customDomain) {
    return { error: "No custom domain set" };
  }

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${publication.customDomain}/verify${
      VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ""
    }`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
    },
  );

  const data = await response.json();

  if (data.verified) {
    await db
      .update(publications)
      .set({
        customDomainVerified: true,
      })
      .where(eq(publications.id, publicationId));

    revalidatePath("/");
    return { success: true };
  }

  return {
    error:
      "Domain not yet verified. Please ensure DNS records are set correctly.",
  };
}
