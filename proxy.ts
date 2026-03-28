import { type NextRequest, NextResponse } from "next/server";

function getHandleUsername(pathname: string): string | null {
  if (!pathname.startsWith("/@") && !pathname.startsWith("/~")) {
    return null;
  }

  const withoutLeadingSlash = pathname.slice(1);
  const firstSegment = withoutLeadingSlash.split("/")[0];
  const username = firstSegment.slice(1).trim().toLowerCase();

  return username.length > 0 ? username : null;
}

function isPrimaryHost(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return true;
  }

  if (hostname.endsWith(".vercel.app")) {
    return true;
  }

  const appUrl = process.env.BETTER_AUTH_URL;
  if (!appUrl) {
    return false;
  }

  try {
    const appHost = new URL(appUrl).hostname;
    return hostname === appHost;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const hostHeader = request.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0];
  const pathname = request.nextUrl.pathname;

  if (isPrimaryHost(hostname)) {
    return NextResponse.next();
  }

  const search = request.nextUrl.search;
  const lookupUrl = new URL(
    `/api/internal/domain-lookup?domain=${encodeURIComponent(hostname)}`,
    request.url,
  );

  const lookup = await fetch(lookupUrl, {
    headers: {
      "x-kraken-proxy": "1",
    },
  });

  if (!lookup.ok) {
    return NextResponse.next();
  }

  const payload = (await lookup.json()) as { username?: string };
  if (!payload.username) {
    return NextResponse.next();
  }

  const ownerUsername = payload.username.toLowerCase();
  const handleUsername = getHandleUsername(pathname);

  if (handleUsername) {
    if (handleUsername !== ownerUsername) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.next();
  }

  const rewriteUrl = new URL(
    `/~${payload.username}${pathname}${search}`,
    request.url,
  );

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
