import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { publications, user } from "@/db/schema";
import { db } from "@/lib/db";

function normalizeLookupDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/\.$/, "");
}

async function findDomainOwner(domain: string) {
  return db
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
}

export async function GET(request: Request) {
  const internalHeader = request.headers.get("x-kraken-proxy");
  if (internalHeader !== "1") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const domainValue = searchParams.get("domain");
  const domain = domainValue ? normalizeLookupDomain(domainValue) : null;

  if (!domain) {
    return NextResponse.json({ error: "domain-required" }, { status: 400 });
  }

  let match = await findDomainOwner(domain);

  if (!match && domain.startsWith("www.")) {
    match = await findDomainOwner(domain.slice(4));
  }

  if (!match?.username) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  return NextResponse.json({ username: match.username });
}
