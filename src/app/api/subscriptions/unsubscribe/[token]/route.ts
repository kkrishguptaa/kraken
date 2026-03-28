import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { subscribers } from "@/db/schema";
import { db } from "@/lib/db";
import { getAppUrl } from "@/lib/resend";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;

  const subscriber = await db
    .select({ id: subscribers.id, userId: subscribers.userId })
    .from(subscribers)
    .where(eq(subscribers.token, token))
    .then((rows) => rows[0]);

  if (!subscriber) {
    return new NextResponse("Subscription token is invalid or expired.", {
      status: 404,
      headers: { "content-type": "text/plain" },
    });
  }

  await db
    .update(subscribers)
    .set({ emailNotificationsEnabled: false })
    .where(eq(subscribers.id, subscriber.id));

  const appUrl = getAppUrl();

  if (subscriber.userId) {
    return NextResponse.redirect(`${appUrl}/subscriptions?status=unsubscribed`);
  }

  return new NextResponse("You have been unsubscribed from this publication.", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
