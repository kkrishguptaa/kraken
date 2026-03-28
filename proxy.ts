import { type NextRequest, NextResponse } from "next/server";

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

  if (isPrimaryHost(hostname)) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
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

  const rewriteUrl = new URL(
    `/@${payload.username}${pathname}${search}`,
    request.url,
  );

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
