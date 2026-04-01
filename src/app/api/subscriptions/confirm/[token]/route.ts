import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { publications, subscribers, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAppUrl } from "@/lib/resend";
import { resolveVerifiedSubscriptionUserId } from "@/lib/utils/subscription";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;

  const subscriber = await db
    .select({
      id: subscribers.id,
      email: subscribers.email,
      publicationUsername: user.username,
    })
    .from(subscribers)
    .innerJoin(publications, eq(subscribers.publicationId, publications.id))
    .innerJoin(user, eq(publications.userId, user.id))
    .where(eq(subscribers.token, token))
    .then((rows) => rows[0]);

  if (!subscriber) {
    return new NextResponse("Subscription token is invalid or expired.", {
      status: 404,
      headers: { "content-type": "text/plain" },
    });
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const resolvedUserId = resolveVerifiedSubscriptionUserId({
    sessionUserId: session?.user?.id,
    sessionEmail: session?.user?.email,
    targetEmail: subscriber.email,
  });

  await db
    .update(subscribers)
    .set({
      emailNotificationsEnabled: true,
      userId: resolvedUserId ?? undefined,
    })
    .where(eq(subscribers.id, subscriber.id));

  const appUrl = getAppUrl();

  if (subscriber.publicationUsername) {
    return NextResponse.redirect(
      `${appUrl}/~${subscriber.publicationUsername}?subscribe=subscribed`,
    );
  }

  return new NextResponse("Subscription confirmed.", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
