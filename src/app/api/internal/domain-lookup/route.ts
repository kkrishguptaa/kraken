import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { publications, user } from "@/db/schema";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const internalHeader = request.headers.get("x-kraken-proxy");
  if (internalHeader !== "1") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain")?.trim().toLowerCase();

  if (!domain) {
    return NextResponse.json({ error: "domain-required" }, { status: 400 });
  }

  const match = await db
    .select({ username: user.username })
    .from(publications)
    .innerJoin(user, eq(publications.userId, user.id))
    .where(
      and(
        eq(publications.customDomain, domain),
        eq(publications.customDomainVerified, true),
      ),
    )
    .then((rows) => rows[0]);

  if (!match?.username) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  return NextResponse.json({ username: match.username });
}
