import { count } from "drizzle-orm";
import Link from "next/link";
import type { ReactNode } from "react";
import { user } from "@/db/schema";
import { db } from "@/lib/db";

type AuthSplitLayoutProps = {
  children: ReactNode;
};

export async function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  let numberOfUsers = 0;
  try {
    const result = await db.select({ count: count() }).from(user);
    numberOfUsers = result[0]?.count ?? 0;
  } catch {
    // Database unavailable, use default counter
    numberOfUsers = 0;
  }

  const numberEndings = ["th", "st", "nd", "rd"];
  const getOrdinal = (n: number) => {
    const v = n % 100;
    return (
      n + (numberEndings[(v - 20) % 10] || numberEndings[v] || numberEndings[0])
    );
  };
  const ordinalNumber = getOrdinal(numberOfUsers + 1);
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-paper-border bg-paper-base px-6 py-4 lg:px-12">
          <Link
            href="/"
            className="font-serif text-lg font-medium tracking-tight"
          >
            KRAKEN
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-paper-muted transition hover:text-paper-ink"
          >
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>

        {/* Form content */}
        <div className="flex flex-1 flex-col bg-paper-base px-6 py-12 lg:px-12">
          {children}
        </div>
      </div>

      {/* Right side - Promo */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-paper-ink px-12 text-white lg:flex">
        <div className="max-w-md space-y-6 text-center">
          <h2 className="font-serif text-4xl font-normal tracking-tight">
            KRAKEN NEWS
          </h2>
          <div className="h-px bg-white/20" />
          <p className="font-serif text-xl italic leading-relaxed text-white/90">
            Newsletter for friends not subscribers. A place for anyone who
            wishes to write about their day to their friends, and keep connect
            with them for as long as possible. No algorithms, no ads, just you
            and your friends.
          </p>
          <p className="text-sm text-white/70">
            Become the {ordinalNumber} person to join the KRAKEN community. We
            can't wait to see what you'll share.
          </p>
        </div>
      </div>
    </div>
  );
}
