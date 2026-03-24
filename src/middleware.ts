import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { NextResponse } from "next/server";
import { publications } from "@/db/schema";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk",
  "/unsubscribe(.*)",
  "/@(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // The main domain where the platform is hosted
  const mainDomain =
    process.env.NEXT_PUBLIC_APP_URL?.replace("https://", "").replace(
      "http://",
      "",
    ) || "kraken.krishg.com";

  // 1. Handle Custom Domain Rewriting
  if (
    hostname !== mainDomain &&
    !hostname.includes("localhost") &&
    !hostname.endsWith(".vercel.app")
  ) {
    const slug = await getSlugForCustomDomain(hostname);
    if (slug) {
      // Rewrite custom domain to /@slug/...
      return NextResponse.rewrite(
        new URL(`/@${slug}${url.pathname}`, request.url),
      );
    }
  }

  // 2. Auth Protection
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

// This would typically involve a database query or an Edge Config lookup
async function getSlugForCustomDomain(
  hostname: string,
): Promise<string | null> {
  if (!process.env.DATABASE_URL) return null;

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  const [publication] = await db
    .select({ slug: publications.slug })
    .from(publications)
    .where(
      and(
        eq(publications.customDomain, hostname),
        eq(publications.customDomainVerified, true),
      ),
    )
    .limit(1);

  return publication?.slug || null;
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
