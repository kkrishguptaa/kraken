import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { subscribers } from "@/db/schema";
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
      userId: subscribers.userId,
    })
    .from(subscribers)
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
  const resolvedUserId =
    resolveVerifiedSubscriptionUserId({
      sessionUserId: session?.user?.id,
      sessionEmail: session?.user?.email,
      targetEmail: subscriber.email,
    }) ?? subscriber.userId;

  await db
    .update(subscribers)
    .set({
      emailNotificationsEnabled: false,
      userId: resolvedUserId ?? undefined,
    })
    .where(eq(subscribers.id, subscriber.id));

  const appUrl = getAppUrl();

  if (resolvedUserId) {
    return NextResponse.redirect(`${appUrl}/subscriptions?status=unsubscribed`);
  }

  return new NextResponse("You have been unsubscribed from this publication.", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
