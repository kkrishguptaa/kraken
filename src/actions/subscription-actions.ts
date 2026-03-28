"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { jsx } from "react/jsx-runtime";
import { publications, subscribers, user } from "@/db/schema";
import { SubscriptionConfirmationEmail } from "@/emails/subscription-confirmation-email";
import { SubscriptionOptInEmail } from "@/emails/subscription-opt-in-email";
import { useAuthenticated } from "@/hooks/authenticated";
import { getSession } from "@/hooks/session";
import { db } from "@/lib/db";
import { getAppUrl, getFromEmail, getResendClient } from "@/lib/resend";

function makeToken() {
  return crypto.randomUUID().replaceAll("-", "");
}

function normalizeReturnTo(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/";
  }

  return value;
}

function isValidEmail(email: string): boolean {
  // RFC 5322 simplified - check for basic email structure
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const maxLength = 254; // RFC 5321
  return emailRegex.test(email) && email.length <= maxLength;
}

function redirectWithStatus(returnTo: string, status: string): never {
  const separator = returnTo.includes("?") ? "&" : "?";
  const key = returnTo.startsWith("/subscriptions") ? "status" : "subscribe";
  redirect(`${returnTo}${separator}${key}=${status}`);
}

async function sendSubscriptionEmail(input: {
  to: string;
  publicationName: string;
  publicationUsername: string;
  token: string;
  type: "confirmation" | "opt-in";
}) {
  const resend = getResendClient();
  if (!resend) {
    return;
  }

  const appUrl = getAppUrl();
  const unsubscribeUrl = `${appUrl}/api/subscriptions/unsubscribe/${input.token}`;

  if (input.type === "confirmation") {
    const publicationUrl = `${appUrl}/@${input.publicationUsername}`;
    await resend.emails.send({
      from: getFromEmail(),
      to: input.to,
      subject: `Subscribed: ${input.publicationName}`,
      react: jsx(SubscriptionConfirmationEmail, {
        publicationName: input.publicationName,
        publicationUsername: input.publicationUsername,
        publicationUrl,
        unsubscribeUrl,
      }),
    });
  } else {
    const confirmUrl = `${appUrl}/api/subscriptions/confirm/${input.token}`;
    await resend.emails.send({
      from: getFromEmail(),
      to: input.to,
      subject: `Confirm subscription: ${input.publicationName}`,
      react: jsx(SubscriptionOptInEmail, {
        publicationName: input.publicationName,
        publicationUsername: input.publicationUsername,
        confirmUrl,
        unsubscribeUrl,
      }),
    });
  }
}

export async function subscribeToPublication(formData: FormData) {
  const session = await getSession();
  const returnTo = normalizeReturnTo(formData.get("returnTo"));

  const rawUsername = formData.get("publicationUsername");
  const publicationUsername =
    typeof rawUsername === "string"
      ? rawUsername.trim().toLowerCase().replace(/^@/, "")
      : "";

  const rawEmail = formData.get("email");
  const emailFromInput =
    typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  const email = emailFromInput || session?.user?.email || "";

  const rawName = formData.get("name");
  const name =
    session?.user?.name || (typeof rawName === "string" ? rawName.trim() : null);

  if (!publicationUsername) {
    redirectWithStatus(returnTo, "missing-publication");
  }

  if (!email || !isValidEmail(email)) {
    redirectWithStatus(returnTo, "missing-email");
  }

  const publication = await db
    .select({
      id: publications.id,
      name: publications.name,
      ownerUsername: user.username,
    })
    .from(publications)
    .innerJoin(user, eq(publications.userId, user.id))
    .where(eq(user.username, publicationUsername))
    .then((rows) => rows[0]);

  if (!publication) {
    redirectWithStatus(returnTo, "publication-not-found");
  }

  const accountForEmail = await db
    .select({ id: user.id, name: user.name, email: user.email })
    .from(user)
    .where(eq(user.email, email))
    .then((rows) => rows[0]);

  const isKnownUserEmail = Boolean(accountForEmail);

  const effectiveUserId =
    accountForEmail?.id || (session?.user?.email === email ? session.user.id : null);

  const effectiveName = accountForEmail?.name || name;

  const existing = await db
    .select({ id: subscribers.id, token: subscribers.token })
    .from(subscribers)
    .where(
      and(
        eq(subscribers.publicationId, publication.id),
        eq(subscribers.email, email),
      ),
    )
    .then((rows) => rows[0]);

  let subscriberId = existing?.id;
  let token = existing?.token;

  if (existing) {
    await db
      .update(subscribers)
      .set({
        userId: effectiveUserId,
        name: effectiveName,
        emailNotificationsEnabled: isKnownUserEmail,
      })
      .where(eq(subscribers.id, existing.id));
  } else {
    token = makeToken();

    const created = await db
      .insert(subscribers)
      .values({
        publicationId: publication.id,
        email,
        name: effectiveName,
        userId: effectiveUserId,
        emailNotificationsEnabled: isKnownUserEmail,
        token,
      })
      .returning({ id: subscribers.id })
      .then((rows) => rows[0]);

    subscriberId = created.id;
  }

  if (token && publication.ownerUsername) {
    if (isKnownUserEmail) {
      await sendSubscriptionEmail({
        to: email,
        publicationName: publication.name,
        publicationUsername: publication.ownerUsername,
        token,
        type: "confirmation",
      });
    } else {
      await sendSubscriptionEmail({
        to: email,
        publicationName: publication.name,
        publicationUsername: publication.ownerUsername,
        token,
        type: "opt-in",
      });
    }
  }

  revalidatePath("/subscriptions");
  revalidatePath("/");
  revalidatePath(`/@${publicationUsername}`);

  redirectWithStatus(returnTo, isKnownUserEmail ? "subscribed" : "check-email");
}

export async function updateSubscriptionNotifications(formData: FormData) {
  const session = await useAuthenticated();

  const subscriberId = formData.get("subscriberId");
  const enabled = formData.get("enabled") === "true";

  if (typeof subscriberId !== "string") {
    redirect("/subscriptions?status=invalid-subscriber");
  }

  await db
    .update(subscribers)
    .set({ emailNotificationsEnabled: enabled })
    .where(and(eq(subscribers.id, subscriberId), eq(subscribers.userId, session.user.id)));

  revalidatePath("/subscriptions");
  redirect("/subscriptions?status=updated");
}

export async function removeSubscription(formData: FormData) {
  const session = await useAuthenticated();

  const subscriberId = formData.get("subscriberId");

  if (typeof subscriberId !== "string") {
    redirect("/subscriptions?status=invalid-subscriber");
  }

  await db
    .delete(subscribers)
    .where(and(eq(subscribers.id, subscriberId), eq(subscribers.userId, session.user.id)));

  revalidatePath("/subscriptions");
  redirect("/subscriptions?status=removed");
}
