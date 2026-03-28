"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { publications, user } from "@/db/schema";
import { useOnboarded } from "@/hooks/onboarded";
import { db } from "@/lib/db";
import { normalizeDomain } from "@/lib/utils/domain";
import {
  addProjectDomain,
  removeProjectDomain,
  verifyProjectDomain,
} from "@/lib/vercel-domains";

function getErrorDetail(error: unknown): string | null {
  if (error instanceof Error) {
    const detail = error.message.trim();
    return detail.length > 0 ? detail.slice(0, 240) : null;
  }

  return null;
}

function toSettingsRedirect(status: string, detail?: string | null): never {
  const params = new URLSearchParams({ status });

  if (detail) {
    params.set("detail", detail);
  }

  redirect(`/settings?${params.toString()}`);
}

async function ensurePublication(userId: string, fallbackName: string) {
  const existing = await db
    .select({ id: publications.id })
    .from(publications)
    .where(eq(publications.userId, userId))
    .then((rows) => rows[0]);

  if (existing) {
    return existing;
  }

  const created = await db
    .insert(publications)
    .values({
      userId,
      name: fallbackName,
      updatedAt: new Date(),
    })
    .returning({ id: publications.id })
    .then((rows) => rows[0]);

  return created;
}

export async function updateDisplayName(formData: FormData) {
  const session = await useOnboarded();
  const rawName = formData.get("name");
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (name.length < 2) {
    toSettingsRedirect("invalid-name");
  }

  await db
    .update(user)
    .set({ name, updatedAt: new Date() })
    .where(eq(user.id, session.user.id));

  revalidatePath("/settings");
  revalidatePath(`/~${session.user.username}`);
  toSettingsRedirect("name-updated");
}

export async function updatePublicationTitle(formData: FormData) {
  const session = await useOnboarded();
  const rawTitle = formData.get("publicationTitle");
  const publicationTitle = typeof rawTitle === "string" ? rawTitle.trim() : "";

  if (publicationTitle.length < 2) {
    toSettingsRedirect("invalid-publication-title");
  }

  const publication = await ensurePublication(
    session.user.id,
    `${session.user.name || session.user.username} Publication`,
  );

  await db
    .update(publications)
    .set({ name: publicationTitle, updatedAt: new Date() })
    .where(eq(publications.id, publication.id));

  revalidatePath("/settings");
  revalidatePath(`/~${session.user.username}`);
  toSettingsRedirect("publication-title-updated");
}

export async function addCustomDomain(formData: FormData) {
  const session = await useOnboarded();
  const rawDomain = formData.get("customDomain");
  const domain =
    typeof rawDomain === "string" ? normalizeDomain(rawDomain) : "";

  if (!domain) {
    toSettingsRedirect("invalid-domain");
  }

  const publication = await ensurePublication(
    session.user.id,
    `${session.user.name || session.user.username} Publication`,
  );

  try {
    const result = await addProjectDomain(domain);

    await db
      .update(publications)
      .set({
        customDomain: domain,
        customDomainVerified: result.verified,
        updatedAt: new Date(),
      })
      .where(eq(publications.id, publication.id));

    revalidatePath("/settings");
    toSettingsRedirect(
      result.verified ? "domain-added" : "domain-pending-verification",
    );
  } catch (error) {
    const detail = getErrorDetail(error);

    await db
      .update(publications)
      .set({
        customDomain: domain,
        customDomainVerified: false,
        updatedAt: new Date(),
      })
      .where(eq(publications.id, publication.id));

    revalidatePath("/settings");
    toSettingsRedirect("domain-pending-verification", detail);
  }
}

export async function verifyCustomDomain(formData: FormData) {
  const session = await useOnboarded();
  const rawDomain = formData.get("customDomain");
  const domain =
    typeof rawDomain === "string" ? normalizeDomain(rawDomain) : "";

  if (!domain) {
    toSettingsRedirect("invalid-domain");
  }

  try {
    const result = await verifyProjectDomain(domain);

    await db
      .update(publications)
      .set({
        customDomain: domain,
        customDomainVerified: result.verified,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(publications.userId, session.user.id),
          eq(publications.customDomain, domain),
        ),
      );

    revalidatePath("/settings");
    toSettingsRedirect(
      result.verified ? "domain-verified" : "domain-pending-verification",
    );
  } catch (error) {
    const detail = getErrorDetail(error);
    toSettingsRedirect("domain-verify-failed", detail);
  }
}

export async function removeCustomDomain(formData: FormData) {
  const session = await useOnboarded();
  const rawDomain = formData.get("customDomain");
  const domain =
    typeof rawDomain === "string" ? normalizeDomain(rawDomain) : "";

  if (!domain) {
    toSettingsRedirect("invalid-domain");
  }

  try {
    await removeProjectDomain(domain);
  } catch {
    // Continue local cleanup even if Vercel API already removed the domain.
  }

  await db
    .update(publications)
    .set({
      customDomain: null,
      customDomainVerified: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(publications.userId, session.user.id),
        eq(publications.customDomain, domain),
      ),
    );

  revalidatePath("/settings");
  toSettingsRedirect("domain-removed");
}
